import { describe, it, expect } from 'vitest';
import { calculateIrrDeal, solveIRR } from './irrCalculations.js';

describe('IRR Calculation Engine Tests', () => {
  it('matches baseline IRR.xls active scenario (60 months, 59 installments, 50.5k EMI, Moratorium 2)', () => {
    const result = calculateIrrDeal({
      assetCost: 2388000,
      netFinance: 2215156,
      tenureMonths: 60,
      numberOfInstallments: 59,
      installmentsInAdvance: -1,
      moratoriumMonths: 2,
      mode: 'reverse',
      loadValueInput: 50500
    });

    // Verify Exposure (LTV)
    expect(result.outputs.exposurePct).toBe(92.76);
    expect(result.outputs.marginMoney).toBe(172844);

    // Verify Total Agreement Value = 59 * 50500 = 2,979,500
    expect(result.outputs.agreementValue).toBe(2979500);

    // Verify Total Interest = 2,979,500 - 2,215,156 = 764,344
    expect(result.outputs.totalInterest).toBe(764344);

    // Verify Flat Rate = 6.90104%
    expect(result.outputs.flatRatePct).toBeCloseTo(6.90104, 4);

    // Verify Deal IRR = 12.10% (0.120986...)
    expect(result.outputs.dealIrrPct).toBe(12.10);
    expect(result.outputs.dealIrrExact).toBeCloseTo(0.120986, 5);

    // Verify cashflows length
    expect(result.outputs.cashflows.length).toBe(61);
    expect(result.outputs.cashflows[0]).toBe(-2215156);
    expect(result.outputs.cashflows[1]).toBe(0); // Month 1 moratorium
    expect(result.outputs.cashflows[2]).toBe(50500);
    expect(result.outputs.cashflows[60]).toBe(50500);

    // Verify amortization closing balance is amortized to zero
    const finalRow = result.outputs.amortizationSchedule[60];
    expect(finalRow.principalBalance).toBeCloseTo(0, 0);
  });

  it('matches 36 months user test scenario (36 months, 35 installments, 33k EMI, Net Finance 10L)', () => {
    const result = calculateIrrDeal({
      assetCost: 1200000,
      netFinance: 1000000,
      tenureMonths: 36,
      numberOfInstallments: 35,
      installmentsInAdvance: -1,
      moratoriumMonths: 2,
      mode: 'reverse',
      loadValueInput: 33000
    });

    expect(result.outputs.exposurePct).toBe(83.33);
    expect(result.outputs.marginMoney).toBe(200000);
    expect(result.outputs.agreementValue).toBe(1155000);
    expect(result.outputs.totalInterest).toBe(155000);
    expect(result.outputs.flatRatePct).toBeCloseTo(5.16667, 4);
    expect(result.outputs.dealIrrPct).toBe(9.33);
  });

  it('correctly calculates forward mode from Flat Rate', () => {
    const result = calculateIrrDeal({
      assetCost: 2000000,
      netFinance: 1600000,
      tenureMonths: 48,
      numberOfInstallments: 48,
      installmentsInAdvance: 0,
      moratoriumMonths: 0,
      mode: 'forward',
      flatRateInput: 7.0
    });

    // Interest = 1,600,000 * 7% * 4 years = 448,000
    expect(result.outputs.totalInterest).toBe(448000);
    expect(result.outputs.agreementValue).toBe(2048000);
    // EMI = 2,048,000 / 48 = 42,666.67
    expect(result.outputs.primaryEmi).toBeCloseTo(42666.67, 1);
  });
});
