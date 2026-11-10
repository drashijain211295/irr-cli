import { describe, it, expect } from 'vitest';
import {
  calculateAge,
  lookupActuarialRate,
  solveFundedPremium,
  solveNonFundedPremium,
  calculateCliQuote
} from './cliCalculations.js';

describe('CLI Actuarial Calculation Engine Tests', () => {
  it('correctly calculates age via DATEDIF logic', () => {
    // 28-Oct-1992 to 26-Nov-2026 is exactly 34 years
    expect(calculateAge('1992-10-28', '2026-11-26')).toBe(34);
    // 15-Aug-1988 to 30-Nov-2026 is 38 years
    expect(calculateAge('1988-08-15', '2026-11-30')).toBe(38);
    // 10-Jul-1995 to 30-Nov-2026 is 31 years
    expect(calculateAge('1995-07-10', '2026-11-30')).toBe(31);
  });

  it('correctly looks up exact rates from NCV_Base_Mor0_Male_14 table', () => {
    // Age 34, 60_60 -> Cell AX20 = 15.35
    const lookup1 = lookupActuarialRate({
      segmentCode: 'NCV',
      gender: 'Male',
      age: 34,
      tenureMonths: 60
    });
    expect(lookup1.rate).toBe(15.35);

    // Age 38, 48_48 -> Cell AL24 = 17.21
    const lookup2 = lookupActuarialRate({
      segmentCode: 'NCV',
      gender: 'Male',
      age: 38,
      tenureMonths: 48
    });
    expect(lookup2.rate).toBe(17.21);

    // Age 31, 36_36 -> Cell Z17 = 8.91
    const lookup3 = lookupActuarialRate({
      segmentCode: 'NCV',
      gender: 'Male',
      age: 31,
      tenureMonths: 36
    });
    expect(lookup3.rate).toBe(8.91);
  });

  it('matches baseline CLI Calculation Sheet active scenario (Age 34, 60M, 491k loan)', () => {
    const quote = calculateCliQuote({
      dob: '1992-10-28',
      loanAmount: 491000,
      tenureMonths: 60,
      segmentCode: 'NCV',
      gender: 'Male',
      loanInterest: 14,
      premiumFunding: 'Funded',
      disbursementDate: '2026-11-26'
    });

    expect(quote.meta.entryAge).toBe(34);
    expect(quote.meta.coverageAge).toBe(39);
    expect(quote.activeQuote.ratePerMille).toBe(15.35);

    // Verify exact matches with Excel Calculator sheet cells H14, H15, H16, H17
    expect(quote.activeQuote.revisedSumAssured).toBe(500058);
    expect(quote.activeQuote.basicPremium).toBe(7676);
    expect(quote.activeQuote.gstAmount).toBe(1382);
    expect(quote.activeQuote.payablePremium).toBe(9058);

    // Verify exact analytical precision
    expect(quote.activeQuote.revisedSumAssuredExact).toBeCloseTo(500057.54, 2);
    expect(quote.activeQuote.payablePremiumExact).toBeCloseTo(9057.54, 2);

    // Verify NML (₹500k is within ₹60 Lakhs limit)
    expect(quote.underwriting.isMedicalRequired).toBe(false);
    expect(quote.underwriting.status).toBe('Clear (Non-Medical)');

    // Verify Validations
    expect(quote.validations.isValid).toBe(true);
    expect(quote.validations.errors.length).toBe(0);
  });

  it('matches scenario 2 (Age 38, 48M, 800k loan, Rate 17.21)', () => {
    const quote = calculateCliQuote({
      dob: '1988-08-15',
      loanAmount: 800000,
      tenureMonths: 48,
      segmentCode: 'NCV',
      gender: 'Male',
      disbursementDate: '2026-11-30',
      premiumFunding: 'Funded'
    });

    expect(quote.activeQuote.ratePerMille).toBe(17.21);
    expect(quote.activeQuote.revisedSumAssured).toBe(816583);
    expect(quote.activeQuote.basicPremium).toBe(14053);
    expect(quote.activeQuote.gstAmount).toBe(2530);
    expect(quote.activeQuote.payablePremium).toBe(16583);
  });

  it('matches scenario 3 (Age 31, 36M, 650k loan, Rate 8.91)', () => {
    const quote = calculateCliQuote({
      dob: '1995-07-10',
      loanAmount: 650000,
      tenureMonths: 36,
      segmentCode: 'NCV',
      gender: 'Male',
      disbursementDate: '2026-11-30',
      premiumFunding: 'Funded'
    });

    expect(quote.activeQuote.ratePerMille).toBe(8.91);
    expect(quote.activeQuote.revisedSumAssured).toBe(656907);
    expect(quote.activeQuote.basicPremium).toBe(5853);
    expect(quote.activeQuote.gstAmount).toBe(1054);
    expect(quote.activeQuote.payablePremium).toBe(6907);
  });
});
