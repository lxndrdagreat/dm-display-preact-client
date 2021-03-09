import { createSlice } from '@reduxjs/toolkit';
import type { CombatTrackerSchema } from '../../schemas/combat-tracker.schema';

const combatTrackerSlice = createSlice({
  name: 'combatTracker',
  initialState: null as null | CombatTrackerSchema,
  reducers: {
    setCombatTracker(state, action) {
      return action.payload;
    },

    setCombatTrackerCharacters(state, action) {
      if (!state) {
        throw new Error(
          'Cannot set characters because the combattracker is null'
        );
      }
      state.characters = action.payload;
    },

    setCombatTrackerActiveCharacterId(state, action) {
      if (!state) {
        throw new Error('CombatTracker is null');
      }
      state.activeCharacterId = action.payload;
    },

    setCombatTrackerRound(state, action) {
      if (!state) {
        throw new Error('CombatTracker is null');
      }
      state.round = action.payload;
    },

    addCombatCharacter(state, action) {
      if (!state) {
        throw new Error('CombatTracker is null');
      }
      state.characters.push(action.payload);
    },

    removeCombatCharacter(state, action) {
      if (!state) {
        throw new Error('CombatTracker is null');
      }
      state.characters = state.characters.filter(
        (ch) => ch.id !== action.payload
      );
    },

    updateCombatCharacter(state, action) {
      if (!state) {
        throw new Error('CombatTracker is null');
      }
      state.characters = state.characters.map((ch) =>
        ch.id === action.payload.id ? action.payload : ch
      );
    }
  }
});

export const {
  setCombatTracker,
  setCombatTrackerActiveCharacterId,
  setCombatTrackerCharacters,
  setCombatTrackerRound,
  addCombatCharacter,
  updateCombatCharacter,
  removeCombatCharacter
} = combatTrackerSlice.actions;
export default combatTrackerSlice.reducer;
