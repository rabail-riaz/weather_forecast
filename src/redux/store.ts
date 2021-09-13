import { createStore } from 'redux';
import {forecastReducer} from "./reducers/forecastReducer";

export const store = createStore(forecastReducer);