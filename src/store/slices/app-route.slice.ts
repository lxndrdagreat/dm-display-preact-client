import {createSlice} from '@reduxjs/toolkit';

export enum AppRoute {
  Home,
  Admin,
  Display
}

const appRouteSlice = createSlice({
  name: 'appRoute',
  initialState: AppRoute.Home as AppRoute,
  reducers: {
    setRoute(state, action) {
      return action.payload;
    }
  }
});

export const {setRoute} = appRouteSlice.actions;
export default appRouteSlice.reducer;
