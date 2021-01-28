import {combineReducers} from '@reduxjs/toolkit';
import appRouteReducer from './slices/app-route.slice';
import sessionReducer from './slices/session.slice';
import userRoleReducer from './slices/user-role.slice';

const rootReducer = combineReducers({
  appRoute: appRouteReducer,
  session: sessionReducer,
  userRole: userRoleReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
