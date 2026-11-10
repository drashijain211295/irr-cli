/**
 * CLI Actuarial Calculation Engine
 * Replicates Tata Capital / Tata AIA Life Group Sampoorna Raksha Supreme Plan
 * (COMMERCIAL VEHICLE LOAN - PREMIUM CALCULATOR, UIN: 110N173V02)
 *
 * Implements:
 * - Full 6 actuarial rate matrices (STR, NCV, UCV for Male & Female @ 14% ROI, Moratorium 0)
 * - Exact DATEDIF date arithmetic for completed years
 * - Unrolled 12-iteration circular reference solver + analytical closed-form formula
 * - Funded vs Non-Funded premium breakdown
 * - Non-Medical Limits (NML) underwriting checks
 * - 8 business rule validations
 */

import cliRateTables from '../data/cliRateTables.json';
import cliRules from '../data/cliRules.json';

/**
 * Calculates completed years between two dates (equivalent to Excel DATEDIF(d1, d2, "y"))
 */
export function calculateAge(dobDateStr, asOfDateStr) {
  if (!dobDateStr || !asOfDateStr) return 0;
  const dob = new Date(dobDateStr);
  const asOf = new Date(asOfDateStr);

  if (isNaN(dob.getTime()) || isNaN(asOf.getTime())) return 0;

  let age = asOf.getFullYear() - dob.getFullYear();
  const m = asOf.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && asOf.getDate() < dob.getDate())) {
    age--;
  }
  return Math.max(0, age);
}

/**
 * Performs dynamic 2D rate table lookup from the 6 actuarial matrices
 */
export function lookupActuarialRate(params) {
  const {
    segmentCode = 'NCV', // 'STR', 'NCV', 'UCV'
    gender = 'Male',     // 'Male', 'Female'
    age = 34,
    tenureMonths = 60,
    roi = 14,
    moratorium = 0
  } = params;

  const tableKey = `${segmentCode}_Base_Mor${moratorium}_${gender}_${roi}`;
  const termKey = `${tenureMonths}_${tenureMonths}`;

  const table = cliRateTables[tableKey];
  if (!table) {
    return {
      rate: null,
      tableKey,
      termKey,
      error: `Actuarial table '${tableKey}' not found.`
    };
  }

  const ageData = table[String(age)];
  if (!ageData) {
    return {
      rate: null,
      tableKey,
      termKey,
      error: `Age ${age} is outside the allowed underwriting range for ${segmentCode}.`
    };
  }

  const rate = ageData[termKey];
  if (rate === undefined || rate === null) {
    return {
      rate: null,
      tableKey,
      termKey,
      error: `Tenure '${termKey}' not found in actuarial table for Age ${age}.`
    };
  }

  return {
    rate: Number(rate),
    tableKey,
    termKey,
    error: null
  };
}

/**
 * Solves for Funded Insurance Premium (Premium added to Loan Amount)
 * Matches Excel Rows 94 to 106 in Input sheet
 */
export function solveFundedPremium(loanAmount, ratePerMille, gstRate = 0.18) {
  const loan = Number(loanAmount) || 0;
  const rate = Number(ratePerMille) || 0;

  if (loan <= 0 || rate <= 0) {
    return {
      revisedSumAssured: loan,
      basicPremium: 0,
      gstAmount: 0,
      payablePremium: 0,
      iterations: []
    };
  }

  // Analytical closed-form solution:
  // SA_revised = Loan / (1 - (Rate/1000 * (1 + GST)))
  const rateFactor = (rate / 1000.0) * (1.0 + gstRate);
  const analyticalSA = loan / (1.0 - rateFactor);
  const analyticalBasic = (rate / 1000.0) * analyticalSA;
  const analyticalGST = analyticalBasic * gstRate;
  const analyticalTotal = analyticalBasic + analyticalGST;

  // Simulate Excel's 12-step unrolled fixed-point iteration ladder (rows 94-106)
  const iterations = [];
  let currSA = loan;
  for (let i = 0; i <= 12; i++) {
    const basic = (rate / 1000.0) * currSA;
    const gst = basic * gstRate;
    const total = basic + gst;
    iterations.push({
      iteration: i,
      sumAssured: currSA,
      basicPremium: basic,
      gstAmount: gst,
      totalPremium: total
    });
    currSA = loan + total;
  }

  return {
    revisedSumAssured: analyticalSA,
    basicPremium: analyticalBasic,
    gstAmount: analyticalGST,
    payablePremium: analyticalTotal,
    iterations
  };
}

/**
 * Solves for Non-Funded Premium (Borrower pays out of pocket)
 */
export function solveNonFundedPremium(loanAmount, ratePerMille, gstRate = 0.18) {
  const loan = Number(loanAmount) || 0;
  const rate = Number(ratePerMille) || 0;

  const basicPremium = (rate / 1000.0) * loan;
  const gstAmount = basicPremium * gstRate;
  const payablePremium = basicPremium + gstAmount;

  return {
    sumAssured: loan,
    basicPremium,
    gstAmount,
    payablePremium
  };
}

/**
 * Checks Non-Medical Limit (NML) underwriting threshold
 */
export function evaluateNML(segmentCode, age, sumAssured) {
  const segmentKey = segmentCode === 'STR' ? 'StrategicCV' : (segmentCode === 'UCV' ? 'RetailUsedCV' : 'RetailNewCV');
  const nmlConfig = cliRules.NML[segmentKey];

  if (!nmlConfig || !nmlConfig.bands) {
    return {
      isMedicalRequired: false,
      limit: 0,
      status: 'Clear',
      message: 'Underwriting limits not configured'
    };
  }

  const band = nmlConfig.bands.find(b => age >= b.minAge && age <= b.maxAge);
  if (!band) {
    return {
      isMedicalRequired: true,
      limit: 0,
      status: 'Medical Required',
      message: `Age ${age} requires medical underwriting.`
    };
  }

  if (band.limit === 0) {
    return {
      isMedicalRequired: true,
      limit: 0,
      status: 'Medical Required',
      message: `All borrowers aged ${age}+ require full medical tests.`
    };
  }

  const isMedicalRequired = sumAssured > band.limit;
  return {
    isMedicalRequired,
    limit: band.limit,
    status: isMedicalRequired ? 'Medical for Borrower' : 'Clear (Non-Medical)',
    message: isMedicalRequired
      ? `Sum Assured (₹${Math.round(sumAssured).toLocaleString('en-IN')}) exceeds Non-Medical Limit of ₹${band.limit.toLocaleString('en-IN')}. Medical examination required.`
      : `Sum Assured is within Non-Medical Limit of ₹${band.limit.toLocaleString('en-IN')}. No medicals required.`
  };
}

/**
 * Evaluates the 8 core business validations matching 'Validations' sheet
 */
export function validateCliDeal(params) {
  const {
    age,
    coverageAge,
    loanAmount,
    tenureMonths,
    segmentCode = 'NCV',
    loanSharePct = 100,
    calculationDate,
    disbursementDate
  } = params;

  const scheme = cliRules.SchemeOptions.find(s => s.code === segmentCode) || cliRules.SchemeOptions[1];
  const errors = [];

  // 1. Min Age check
  if (age < scheme.minAge) {
    errors.push(`Minimum Entry Age required is ${scheme.minAge} years (Current: ${age}).`);
  }

  // 2. Max Entry Age check
  if (age > scheme.maxAge) {
    errors.push(`Maximum Entry Age allowed is ${scheme.maxAge} years for ${segmentCode} (Current: ${age}).`);
  }

  // 3. Max Coverage Age check
  if (coverageAge > scheme.maxMaturityAge) {
    errors.push(`Maximum Coverage Maturity Age allowed is ${scheme.maxMaturityAge} years (Current: ${coverageAge}).`);
  }

  // 4. Min Sum Assured check
  if (loanAmount < scheme.minSA) {
    errors.push(`Sum Assured should not be less than ₹${scheme.minSA.toLocaleString('en-IN')}.`);
  }

  // 5. Max Sum Assured check
  if (loanAmount > scheme.maxSA) {
    errors.push(`Sum Assured should not be greater than ₹${(scheme.maxSA / 10000000).toFixed(0)} Crore for Death Benefit.`);
  }

  // 6. Loan Tenure check
  if (tenureMonths < scheme.minTerm || tenureMonths > scheme.maxTerm) {
    errors.push(`Loan/Policy tenure must be between ${scheme.minTerm} and ${scheme.maxTerm} months.`);
  }

  // 7. Loan Share check
  if (loanSharePct > 100) {
    errors.push('Maximum Loan Share allowed is 100% for single borrower.');
  }

  // 8. Date validity
  if (calculationDate && disbursementDate && new Date(disbursementDate) < new Date(calculationDate)) {
    errors.push('Expected Loan Disbursement Date cannot be earlier than Premium Calculation Date.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Main CLI Quote Calculation Orchestrator
 */
export function calculateCliQuote(params) {
  const {
    dob = '1992-10-28',
    loanAmount = 491000,
    tenureMonths = 60,
    segmentCode = 'NCV', // 'STR', 'NCV', 'UCV'
    gender = 'Male',
    coverType = 'R',     // 'R' (Reducing) or 'L' (Level)
    loanInterest = 14,
    moratorium = 0,
    premiumFunding = 'Funded', // 'Funded' or 'Non-Funded'
    calculationDate = new Date().toISOString().split('T')[0],
    disbursementDate = null
  } = params;

  // 1. Determine Expected Risk Commencement Date (RCD)
  // Default is 20 days after calculation date if not provided
  let rcdStr = disbursementDate;
  if (!rcdStr) {
    const calcDt = new Date(calculationDate);
    calcDt.setDate(calcDt.getDate() + 20);
    rcdStr = calcDt.toISOString().split('T')[0];
  }

  // 2. Calculate Ages
  const entryAge = calculateAge(dob, rcdStr);
  const coverageAge = entryAge + (Number(tenureMonths) / 12.0);

  // 3. Actuarial Rate Lookup
  const rateLookup = lookupActuarialRate({
    segmentCode,
    gender,
    age: entryAge,
    tenureMonths: Number(tenureMonths),
    roi: loanInterest,
    moratorium
  });

  const rate = rateLookup.rate || 0;

  // 4. Calculate Funded and Non-Funded Solutions
  const fundedResult = solveFundedPremium(loanAmount, rate);
  const nonFundedResult = solveNonFundedPremium(loanAmount, rate);

  // Active selected option
  const isFunded = premiumFunding === 'Funded';
  const activeRevisedSA = isFunded ? fundedResult.revisedSumAssured : nonFundedResult.sumAssured;
  const activeBasicPrem = isFunded ? fundedResult.basicPremium : nonFundedResult.basicPremium;
  const activeGst = isFunded ? fundedResult.gstAmount : nonFundedResult.gstAmount;
  const activePayablePrem = isFunded ? fundedResult.payablePremium : nonFundedResult.payablePremium;

  // 5. Medical Underwriting (NML)
  const nmlResult = evaluateNML(segmentCode, entryAge, activeRevisedSA);

  // 6. Validations
  const validationResult = validateCliDeal({
    age: entryAge,
    coverageAge,
    loanAmount: Number(loanAmount),
    tenureMonths: Number(tenureMonths),
    segmentCode,
    calculationDate,
    disbursementDate: rcdStr
  });

  return {
    inputs: {
      dob,
      loanAmount: Number(loanAmount),
      tenureMonths: Number(tenureMonths),
      segmentCode,
      gender,
      coverType,
      loanInterest,
      moratorium,
      premiumFunding,
      calculationDate,
      disbursementDate: rcdStr
    },
    meta: {
      entryAge,
      coverageAge,
      rateLookup,
      disclaimer: cliRules.ProductRules.disclaimer
    },
    activeQuote: {
      isFunded,
      ratePerMille: rate,
      revisedSumAssured: Math.round(activeRevisedSA),
      revisedSumAssuredExact: activeRevisedSA,
      basicPremium: Math.round(activeBasicPrem),
      basicPremiumExact: activeBasicPrem,
      gstAmount: Math.round(activeGst),
      gstAmountExact: activeGst,
      payablePremium: Math.round(activePayablePrem),
      payablePremiumExact: activePayablePrem
    },
    fundedComparison: {
      funded: {
        sumAssured: Math.round(fundedResult.revisedSumAssured),
        basic: Math.round(fundedResult.basicPremium),
        gst: Math.round(fundedResult.gstAmount),
        total: Math.round(fundedResult.payablePremium),
        exactTotal: fundedResult.payablePremium,
        iterations: fundedResult.iterations
      },
      nonFunded: {
        sumAssured: Math.round(nonFundedResult.sumAssured),
        basic: Math.round(nonFundedResult.basicPremium),
        gst: Math.round(nonFundedResult.gstAmount),
        total: Math.round(nonFundedResult.payablePremium),
        exactTotal: nonFundedResult.payablePremium
      }
    },
    underwriting: nmlResult,
    validations: validationResult
  };
}
