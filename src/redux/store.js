import { configureStore } from '@reduxjs/toolkit';
import irrReducer from './slices/irrSlice';
import cliReducer from './slices/cliSlice';

export const store = configureStore({
  reducer: {
    irr: irrReducer,
    cli: cliReducer
  }
});

export default store;
