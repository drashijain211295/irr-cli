import { createSlice } from '@reduxjs/toolkit';
import { calculateCliQuote } from '../../modules/cli/calculations/cliCalculations';

const STORAGE_KEY = 'autofin_cli_state_v3';

const defaultInputs = {
  borrowerName: '',
  dob: '',
  loanAmount: '',
  tenureMonths: 60,
  segmentCode: 'NCV', // 'STR', 'NCV', 'UCV'
  gender: 'Male',
  coverType: 'R',     // 'R' (Reducing) or 'L' (Level)
  loanInterest: 14,
  moratorium: 0,
  premiumFunding: 'Funded', // 'Funded' or 'Non-Funded'
  calculationDate: new Date().toISOString().split('T')[0],
  disbursementDate: ''
};

const loadInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const computed = calculateCliQuote(parsed.inputs);
      return {
        inputs: parsed.inputs,
        quote: computed,
        lastCalculatedAt: new Date().toISOString()
      };
    }
  } catch (err) {
    console.warn('Could not load CLI state from localStorage', err);
  }

  const computed = calculateCliQuote(defaultInputs);
  return {
    inputs: defaultInputs,
    quote: computed,
    lastCalculatedAt: new Date().toISOString()
  };
};

const initialState = loadInitialState();

const cliSlice = createSlice({
  name: 'cli',
  initialState,
  reducers: {
    updateCliInputs: (state, action) => {
      state.inputs = { ...state.inputs, ...action.payload };
      state.quote = calculateCliQuote(state.inputs);
      state.lastCalculatedAt = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs: state.inputs }));
      } catch (e) {}
    },
    setPremiumFunding: (state, action) => {
      state.inputs.premiumFunding = action.payload;
      state.quote = calculateCliQuote(state.inputs);
      state.lastCalculatedAt = new Date().toISOString();
    },
    resetCliBaseline: (state) => {
      state.inputs = { ...defaultInputs };
      state.quote = calculateCliQuote(state.inputs);
      state.lastCalculatedAt = new Date().toISOString();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    },
    loadCliPreset: (state, action) => {
      state.inputs = { ...state.inputs, ...action.payload };
      state.quote = calculateCliQuote(state.inputs);
      state.lastCalculatedAt = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs: state.inputs }));
      } catch (e) {}
    }
  }
});

export const { updateCliInputs, setPremiumFunding, resetCliBaseline, loadCliPreset } = cliSlice.actions;
export default cliSlice.reducer;
