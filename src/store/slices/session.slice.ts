import { createSlice } from '@reduxjs/toolkit';

export interface SessionInfo {
  id: string | null;
  token: string | null;
  password: string;
  quickJoin: {
    admin: string;
    display: string;
  };
}

const sessionSlice = createSlice({
  name: 'session',
  initialState: {
    id: null,
    token: null,
    password: '',
    quickJoin: {
      admin: '',
      display: ''
    }
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
    },

    setQuickJoin(state, action) {
      state.quickJoin = action.payload;
    },

    clearSession() {
      return {
        id: null,
        token: null,
        password: '',
        quickJoin: {
          admin: '',
          display: ''
        }
      };
    }
  }
});

export const {
  setSessionId,
  setSessionToken,
  setSessionPassword,
  clearSession,
  setQuickJoin
} = sessionSlice.actions;

export default sessionSlice.reducer;
