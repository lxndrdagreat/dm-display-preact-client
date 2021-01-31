import {createSlice} from '@reduxjs/toolkit';

export interface CharacterDetailsState {
  characterId: string;
  editingName: boolean;
  editingNPCURL: boolean;
  editingNPCAC: boolean;
  editingNPCHealth: boolean;
}

function initCharacterDetailsState(id: string): CharacterDetailsState {
  return {
    characterId: id,
    editingName: false,
    editingNPCAC: false,
    editingNPCHealth: false,
    editingNPCURL: false
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
      if (!state) {
        return initCharacterDetailsState(action.payload);
      }
      state.characterId = action.payload;
    },

    setEditingCharacterName(state, action) {
      if (!state) {
        return state;
      }
      state.editingName = action.payload;
      if (state.editingName) {
        state.editingNPCAC = false;
        state.editingNPCHealth = false;
        state.editingNPCURL = false;
      }
    }
  }
});

export const {setViewingCharacterDetails, setEditingCharacterName} = characterDetailsSlice.actions;
export default characterDetailsSlice.reducer;
