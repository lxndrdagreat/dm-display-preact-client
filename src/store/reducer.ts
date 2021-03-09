import { combineReducers } from '@reduxjs/toolkit';
import appRouteReducer from './slices/app-route.slice';
import sessionReducer from './slices/session.slice';
import userRoleReducer from './slices/user-role.slice';
import combatTrackerReducer from './slices/combat-tracker.slice';
import characterDetailsReducer from './slices/character-details.slice';
import serverOfflineReducer from './slices/server-offline.slice';

const rootReducer = combineReducers({
  appRoute: appRouteReducer,
  session: sessionReducer,
  userRole: userRoleReducer,
  combatTracker: combatTrackerReducer,
  characterDetails: characterDetailsReducer,
  serverOffline: serverOfflineReducer
});

export type RootState = ReturnType<typeof rootReducer>;

export default rootReducer;
