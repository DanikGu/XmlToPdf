import { configureStore } from '@reduxjs/toolkit';
import xmlReducer from './xmlSlice';

export default configureStore({
  reducer: {
    xml: xmlReducer,
  },
});