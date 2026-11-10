import { createSlice } from '@reduxjs/toolkit';
import { calculateIrrDeal } from '../../modules/irr/calculations/irrCalculations';

const STORAGE_KEY = 'autofin_irr_state_v3';

const defaultInputs = {
  assetCost: '',
  netFinance: '',
  tenureMonths: '',
  numberOfInstallments: '',
  installmentsInAdvance: -1,
  moratoriumMonths: 2,
  mode: 'reverse', // 'reverse' = calculate Flat Rate from EMI
  loadValueInput: '',
  flatRateInput: '',
  periodicity: 12,
  startDate: '2026-11-04'
};

const loadInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      const computed = calculateIrrDeal(parsed.inputs);
      return {
        inputs: parsed.inputs,
        outputs: computed.outputs,
        lastCalculatedAt: new Date().toISOString()
      };
    }
  } catch (err) {
    console.warn('Could not load IRR state from localStorage', err);
  }

  const computed = calculateIrrDeal(defaultInputs);
  return {
    inputs: defaultInputs,
    outputs: computed.outputs,
    lastCalculatedAt: new Date().toISOString()
  };
};

const initialState = loadInitialState();

const irrSlice = createSlice({
  name: 'irr',
  initialState,
  reducers: {
    updateInputs: (state, action) => {
      state.inputs = { ...state.inputs, ...action.payload };
      const computed = calculateIrrDeal(state.inputs);
      state.outputs = computed.outputs;
      state.lastCalculatedAt = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs: state.inputs }));
      } catch (e) {}
    },
    setCalculationMode: (state, action) => {
      state.inputs.mode = action.payload;
      const computed = calculateIrrDeal(state.inputs);
      state.outputs = computed.outputs;
    },
    resetToBaseline: (state) => {
      state.inputs = { ...defaultInputs };
      const computed = calculateIrrDeal(state.inputs);
      state.outputs = computed.outputs;
      state.lastCalculatedAt = new Date().toISOString();
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (e) {}
    },
    loadPreset: (state, action) => {
      state.inputs = { ...state.inputs, ...action.payload };
      const computed = calculateIrrDeal(state.inputs);
      state.outputs = computed.outputs;
      state.lastCalculatedAt = new Date().toISOString();
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({ inputs: state.inputs }));
      } catch (e) {}
    }
  }
});

export const { updateInputs, setCalculationMode, resetToBaseline, loadPreset } = irrSlice.actions;
export default irrSlice.reducer;
