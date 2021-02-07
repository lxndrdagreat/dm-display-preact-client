import { createSlice } from '@reduxjs/toolkit';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';

export interface CharacterDetailsState {
  characterId: string;
  editingTopDetails: boolean;
  editingNPCURL: boolean;
  editingNPCAC: boolean;
  editingNPCHealth: boolean;
  topDetails: Pick<CombatCharacterSchema, 'displayName' | 'adminName' | 'roll'>;
  npcUrl: string;
  npcMaxHealth: number;
}

function initCharacterDetailsState(id: string): CharacterDetailsState {
  return {
    characterId: id,
    editingTopDetails: false,
    editingNPCAC: false,
    editingNPCHealth: false,
    editingNPCURL: false,

    topDetails: {
      displayName: '',
      adminName: '',
      roll: 0,
    },

    npcUrl: '',
    npcMaxHealth: 0,
  };
}

const characterDetailsSlice = createSlice({
  name: 'characterDetails',
  initialState: null as (null | CharacterDetailsState),
  reducers: {
    setViewingCharacterDetails(state, action) {
      if (action.payload === null) {
        return null;
      }
      return initCharacterDetailsState(action.payload);
    },

    setEditingCharacterTopDetails(state, action) {
      if (!state) {
        return state;
      }
      state.editingTopDetails = action.payload;
      if (state.editingTopDetails) {
        state.editingNPCAC = false;
        state.editingNPCHealth = false;
        state.editingNPCURL = false;
      }
    },

    setEditingCharacterURL(state, action) {
      if (!state) {
        return state;
      }
      state.editingNPCURL = action.payload;
      if (state.editingNPCURL) {
        state.editingNPCAC = false;
        state.editingNPCHealth = false;
        state.editingTopDetails = false;
      }
    },

    setEditingCharacterHealth(state, action) {
      if (!state) {
        return state;
      }
      state.editingNPCHealth = action.payload;
      if (state.editingNPCHealth) {
        state.editingNPCAC = false;
        state.editingNPCURL = false;
        state.editingTopDetails = false;
      }
    },

    setTopDetails(state, action) {
      if (!state) {
        return state;
      }
      state.topDetails = {
        ...state.topDetails,
        ...action.payload,
      };
    },

    setTopDetailsDisplayName(state, action) {
      if (!state) {
        return state;
      }
      state.topDetails.displayName = action.payload;
    },

    setTopDetailsAdminName(state, action) {
      if (!state) {
        return state;
      }
      state.topDetails.adminName = action.payload;
    },

    setTopDetailsInitiativeRoll(state, action) {
      if (!state) {
        return state;
      }
      state.topDetails.roll = action.payload;
    },

    setNpcUrl(state, action) {
      if (!state) {
        return state;
      }
      state.npcUrl = action.payload;
    },

    setNpcMaxHealth(state, action) {
      if (!state) {
        return state;
      }
      state.npcMaxHealth = action.payload;
    }
  },
});

export const {
  setViewingCharacterDetails,
  setEditingCharacterTopDetails,
  setEditingCharacterURL,
  setEditingCharacterHealth,
  setTopDetails,
  setTopDetailsAdminName,
  setTopDetailsDisplayName,
  setTopDetailsInitiativeRoll,
  setNpcUrl,
  setNpcMaxHealth
} = characterDetailsSlice.actions;
export default characterDetailsSlice.reducer;
