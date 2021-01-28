import { createSlice } from '@reduxjs/toolkit';

export interface SessionInfo {
  id: string | null;
  token: string | null;
  password: string;
}

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    id: null,
    token: null,
    password: ''
  } as SessionInfo,
  reducers: {
    setSessionId(state, action) {
      state.id = action.payload;
    },

    setSessionToken(state, action) {
      state.token = action.payload;
    },

    setSessionPassword(state, action) {
      state.password = action.payload;
    }
  }
});

export const { setSessionId, setSessionToken, setSessionPassword } = sessionSlice.actions;

export default sessionSlice.reducer;
