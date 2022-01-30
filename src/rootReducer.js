import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';

export const initialState = {
  playlistReducer: []
};

export const rootReducer = combineReducers({
  playlistReducer: [],
  router: routerReducer
});