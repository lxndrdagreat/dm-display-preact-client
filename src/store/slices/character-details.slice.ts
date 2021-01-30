import {createSlice} from '@reduxjs/toolkit';

export interface CharacterDetailsState {
  characterId: string;
}

function initCharacterDetailsState(id: string): CharacterDetailsState {
  return {
    characterId: id
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
    }
  }
});

export const {setViewingCharacterDetails} = characterDetailsSlice.actions;
export default characterDetailsSlice.reducer;
