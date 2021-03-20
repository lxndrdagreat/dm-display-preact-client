import { createSlice } from '@reduxjs/toolkit';

interface ConnectionState {
  connected: boolean;
  hadSession: boolean;
}

function initState(): ConnectionState {
  return {
    connected: false,
    hadSession: false
  };
}

const connectionSlice = createSlice({
  name: 'connection',
  initialState: initState(),
  reducers: {
    setConnectionState(state, action) {
      return action.payload;
    },

    setConnected(state, action) {
      state.connected = action.payload;
    },

    setHadSession(state, action) {
      state.hadSession = action.payload;
    }
  }
});

export const {
  setConnectionState,
  setConnected,
  setHadSession
} = connectionSlice.actions;
export default connectionSlice.reducer;
