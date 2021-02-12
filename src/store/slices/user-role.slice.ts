import { createSlice } from '@reduxjs/toolkit';
import type { SessionUserRole } from '../../schemas/session-user.schema';

const userRoleSlice = createSlice({
  name: 'userRole',
  initialState: null as null | SessionUserRole,
  reducers: {
    setUserRole(state, action) {
      return action.payload;
    }
  }
});

export const { setUserRole } = userRoleSlice.actions;
export default userRoleSlice.reducer;
