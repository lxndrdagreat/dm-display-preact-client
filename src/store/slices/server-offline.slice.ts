import { createSlice } from '@reduxjs/toolkit';

const serverOfflineSlice = createSlice({
  name: 'serverOffline',
  initialState: false,
  reducers: {
    setServerOffline(state, action) {
      return action.payload;
    }
  }
});

export const { setServerOffline } = serverOfflineSlice.actions;
export default serverOfflineSlice.reducer;
