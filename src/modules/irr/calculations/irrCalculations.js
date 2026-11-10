/**
 * IRR Calculation Engine
 * Replicates ICICI Commercial Vehicle Finance IRR & Cash Flow Model
 * Supports:
 * - Direct (Reverse) Mode: EMI / Load Value -> Agreement Value -> Total Interest -> Automatic Flat Rate -> Deal IRR
 * - Forward Mode: Flat Rate -> Total Interest -> Agreement Value -> EMI -> Deal IRR
 * - Multi-tiered structured installments (up to 5 tiers like original sheet)
 * - Moratorium handling (Month 1 zero payment or multi-month deferral)
 * - Advance installments (-1 for moratorium, 0 for regular arrears, 1+ for advance)
 * - Exact 60+ period amortization cash flow schedule matching BIFF8 records
 */

/**
 * Calculates high-precision NPV for a cash flow array at periodic rate r
 * NPV(r) = sum(CF_t / (1 + r)^t)
 */
export function calculateNPV(rate, cashflows) {
  let npv = 0.0;
  for (let t = 0; t < cashflows.length; t++) {
    npv += cashflows[t] / Math.pow(1.0 + rate, t);
  }
  return npv;
}

/**
 * Derivative of NPV with respect to periodic rate r:
 * dNPV/dr = sum(-t * CF_t / (1 + r)^(t + 1))
 */
export function calculateNPVDerivative(rate, cashflows) {
  let dnpv = 0.0;
  for (let t = 1; t < cashflows.length; t++) {
    dnpv += (-t * cashflows[t]) / Math.pow(1.0 + rate, t + 1);
  }
  return dnpv;
}

/**
 * Solves for periodic Internal Rate of Return (IRR) using hybrid Bisection + Newton-Raphson
 * Exactly reproduces Excel's =IRR() function
 */
export function solveIRR(cashflows, guess = 0.01, maxIterations = 100, tolerance = 1e-12) {
  if (!cashflows || cashflows.length === 0) return 0;
  
  // Verify signs: must have at least one negative and one positive flow
  let hasPositive = false;
  let hasNegative = false;
  for (const cf of cashflows) {
    if (cf > 0) hasPositive = true;
    if (cf < 0) hasNegative = true;
  }
  if (!hasPositive || !hasNegative) return 0;

  let r = guess > 0 ? guess : 0.01;
  
  // Try Newton-Raphson first
  for (let i = 0; i < maxIterations; i++) {
    const fVal = calculateNPV(r, cashflows);
    if (Math.abs(fVal) < tolerance) {
      return r;
    }
    const fPrime = calculateNPVDerivative(r, cashflows);
    if (Math.abs(fPrime) > 1e-14) {
      const nextR = r - fVal / fPrime;
      // Keep within realistic bounds (-0.5 to 2.0 per period)
      if (nextR > -0.5 && nextR < 2.0 && Math.abs(nextR - r) < 0.5) {
        if (Math.abs(nextR - r) < tolerance) {
          return nextR;
        }
        r = nextR;
        continue;
      }
    }
    break; // Fall back to robust Bisection
  }

  // Robust Bisection Search between -0.5 and 2.0
  let low = -0.5;
  let high = 2.0;
  let fLow = calculateNPV(low, cashflows);
  let fHigh = calculateNPV(high, cashflows);

  // If bounds don't bracket, expand search
  if (fLow * fHigh > 0) {
    low = 0.000001;
    high = 0.20;
    fLow = calculateNPV(low, cashflows);
    fHigh = calculateNPV(high, cashflows);
  }

  if (fLow * fHigh <= 0) {
    for (let iter = 0; iter < 100; iter++) {
      const mid = (low + high) / 2.0;
      const fMid = calculateNPV(mid, cashflows);
      if (Math.abs(fMid) < tolerance || (high - low) / 2.0 < tolerance) {
        return mid;
      }
      if (fLow * fMid <= 0) {
        high = mid;
        fHigh = fMid;
      } else {
        low = mid;
        fLow = fMid;
      }
    }
    return (low + high) / 2.0;
  }

  return r;
}

/**
 * Main IRR Deal Evaluation Function
 */
export function calculateIrrDeal(params) {
  const {
    assetCost = 0,
    netFinance = 0,
    tenureMonths = 36,
    numberOfInstallments = 35,
    installmentsInAdvance = -1,
    moratoriumMonths = 2,
    mode = 'reverse', // 'reverse' (from Load Value/EMI) or 'forward' (from Flat Rate)
    flatRateInput = 0,
    loadValueInput = 0,
    structuredTiers = [], // [{ amount: 33000, count: 35 }]
    periodicity = 12,
    discountRate = 13.5,
    irrGuess = 10.0,
    startDate = '2026-11-04'
  } = params;

  const nf = Number(netFinance) || 0;
  const ac = Number(assetCost) || 0;
  const tenure = Number(tenureMonths) || 1;
  const noi = Number(numberOfInstallments) || 1;
  const adv = Number(installmentsInAdvance) || 0;
  const mor = Number(moratoriumMonths) || (adv === -1 ? 2 : 0);

  // 1. Exposure (LTV) and Margin Money
  const exposurePct = ac > 0 ? (nf / ac) * 100 : 0;
  const marginMoney = ac > nf ? ac - nf : 0;

  let flatRate = 0;
  let totalInterest = 0;
  let agreementValue = 0;
  let primaryEmi = 0;
  let totalInstallmentSum = 0;
  let balancingShortfall = 0;

  // Resolve installments array
  let tiers = [];
  if (structuredTiers && structuredTiers.length > 0) {
    tiers = structuredTiers.filter(t => t.count > 0 && t.amount > 0);
  }
  if (tiers.length === 0 && loadValueInput > 0) {
    tiers = [{ amount: Number(loadValueInput), count: noi }];
  }

  if (mode === 'reverse') {
    // Reverse Mode: Derive from Load Value / Installments
    primaryEmi = tiers.length > 0 ? tiers[0].amount : (loadValueInput || 0);
    totalInstallmentSum = tiers.reduce((sum, t) => sum + (t.amount * t.count), 0);
    agreementValue = totalInstallmentSum > 0 ? totalInstallmentSum : (primaryEmi * noi);
    totalInterest = agreementValue > nf ? agreementValue - nf : 0;
    
    // Automatic Flat Rate calculation
    const tenureYears = tenure / 12.0;
    flatRate = (nf > 0 && tenureYears > 0) ? (totalInterest / (nf * tenureYears)) * 100 : 0;
  } else {
    // Forward Mode: Derive from Flat Rate input
    flatRate = Number(flatRateInput) || 0;
    const tenureYears = tenure / 12.0;
    totalInterest = nf * (flatRate / 100.0) * tenureYears;
    agreementValue = nf + totalInterest;
    primaryEmi = noi > 0 ? agreementValue / noi : 0;
    totalInstallmentSum = tiers.length > 0 ? tiers.reduce((sum, t) => sum + (t.amount * t.count), 0) : agreementValue;
    balancingShortfall = Math.max(0, agreementValue - totalInstallmentSum);
  }

  // 2. Build Cash Flow Stream for IRR
  // Month 0: -Net Finance
  // Moratorium: 0 for deferred months
  // Remaining months: Structured EMI tiers
  const cashflows = new Array(tenure + 1).fill(0.0);
  cashflows[0] = -nf;

  let currentMonth = 1;
  // If moratorium > 0, payments start at month = moratorium (e.g. M=2 -> month 1 is 0, start at 2)
  if (mor > 1) {
    currentMonth = mor;
  } else if (adv > 0) {
    // Advance payment at month 0
    const advAmt = primaryEmi * adv;
    cashflows[0] += advAmt;
    currentMonth = 1;
  }

  // Populate installment cash flows
  if (tiers.length > 0) {
    for (const tier of tiers) {
      for (let k = 0; k < tier.count; k++) {
        if (currentMonth <= tenure) {
          cashflows[currentMonth] += tier.amount;
          currentMonth++;
        }
      }
    }
  } else {
    for (let k = 0; k < noi; k++) {
      if (currentMonth <= tenure) {
        cashflows[currentMonth] += primaryEmi;
        currentMonth++;
      }
    }
  }

  // 3. Calculate Annualized Deal IRR
  const periodicGuess = (irrGuess / 100.0) / periodicity;
  const periodicIRR = solveIRR(cashflows, periodicGuess);
  const annualizedDealIRR = periodicIRR * periodicity * 100.0;
  const effectiveAnnualIRR = (Math.pow(1.0 + periodicIRR, periodicity) - 1.0) * 100.0;

  // 4. Build Detailed Amortization Table (Cashflows sheet)
  const amortizationSchedule = [];
  let principalBalance = nf;
  let remainingInstallments = agreementValue;
  const startDt = new Date(startDate || '2026-11-04');

  for (let t = 0; t <= tenure; t++) {
    const periodDate = new Date(startDt);
    periodDate.setMonth(startDt.getMonth() + t);

    if (t === 0) {
      amortizationSchedule.push({
        period: 0,
        date: periodDate.toISOString().split('T')[0],
        installment: 0,
        accountingFlow: -nf,
        clientFlow: -nf,
        interestAccrued: 0,
        principalRepaid: 0,
        principalBalance: nf,
        remainingInstallments: agreementValue
      });
    } else {
      const flow = cashflows[t] || 0;
      const interest = principalBalance * periodicIRR;
      const principalRepaid = flow - interest;
      principalBalance = Math.max(0, principalBalance - principalRepaid);
      remainingInstallments = Math.max(0, remainingInstallments - flow);

      amortizationSchedule.push({
        period: t,
        date: periodDate.toISOString().split('T')[0],
        installment: flow,
        accountingFlow: flow,
        clientFlow: flow,
        interestAccrued: interest,
        principalRepaid: principalRepaid,
        principalBalance: principalBalance,
        remainingInstallments: remainingInstallments
      });
    }
  }

  return {
    inputs: {
      assetCost: ac,
      netFinance: nf,
      tenureMonths: tenure,
      numberOfInstallments: noi,
      installmentsInAdvance: adv,
      moratoriumMonths: mor,
      mode,
      loadValueInput: primaryEmi,
      flatRateInput: flatRate,
      periodicity,
      startDate
    },
    outputs: {
      exposurePct: Number(exposurePct.toFixed(2)),
      exposureRaw: exposurePct / 100.0,
      marginMoney: Math.round(marginMoney),
      disbursementAmt: nf,
      totalInterest: Number(totalInterest.toFixed(2)),
      agreementValue: Number(agreementValue.toFixed(2)),
      totalInstallmentSum: Number(totalInstallmentSum.toFixed(2)),
      primaryEmi: Number(primaryEmi.toFixed(2)),
      flatRatePct: Number(flatRate.toFixed(5)),
      dealIrrPct: Number(annualizedDealIRR.toFixed(2)),
      dealIrrExact: annualizedDealIRR / 100.0,
      effectiveAnnualIrrPct: Number(effectiveAnnualIRR.toFixed(2)),
      balancingShortfall: Number(balancingShortfall.toFixed(2)),
      cashflows,
      amortizationSchedule
    }
  };
}
