import { h } from 'preact';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import { dispatch } from '@store/store';
import {
  setEditingCharacterArmorClass,
  setNpcArmorClass
} from '@store/slices/character-details.slice';
import { SocketClient } from '../../../networking/socket-client';
import { SocketMessageType } from '../../../networking/socket-message-type.schema';
import ConfirmOrCancel from '../../../components/buttons/ConfirmOrCancel';
import { Grid, IconButton, TextField, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';

interface Props {
  characterId: string;
  characterAC: number;
  editing: boolean;
  value: number;
}

function CharacterArmorClass({
  characterId,
  characterAC,
  editing,
  value
}: Props) {
  function onEditClick() {
    dispatch(setEditingCharacterArmorClass(true));
    dispatch(setNpcArmorClass(characterAC));
  }

  function onValueChange(event: InputEvent) {
    const value = parseInt((event.target as HTMLInputElement).value);
    dispatch(setNpcArmorClass(value));
  }

  function onDiscardClick() {
    dispatch(setEditingCharacterArmorClass(false));
  }

  function onSaveClick() {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacterNPC,
      payload: {
        id: characterId,
        npc: {
          armorClass: value
        }
      }
    });
    dispatch(setEditingCharacterArmorClass(false));
  }

  if (editing) {
    return (
      <Grid container>
        <Grid item>
          <Typography variant="subtitle2">A/C</Typography>
          <TextField value={value} onChange={onValueChange} type="number" />
        </Grid>
        <Grid item>
          <ConfirmOrCancel onConfirm={onSaveClick} onCancel={onDiscardClick} />
        </Grid>
      </Grid>
    );
  }
  return (
    <Grid container>
      <Grid item>
        <Typography variant="subtitle2">A/C</Typography>
        <Typography variant="subtitle1">{value}</Typography>
      </Grid>
      <Grid item>
        <IconButton onClick={onEditClick}>
          <Edit />
        </IconButton>
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state: RootState): Props {
  const character = state.combatTracker!.characters.find(
    (ch) => ch.id === state.characterDetails!.characterId
  );
  if (!character || !state.characterDetails) {
    throw new Error(`No active character.`);
  }
  return {
    characterId: character.id,
    characterAC: character.npc!.armorClass,
    editing: state.characterDetails.editingNPCAC,
    value: state.characterDetails.npcAC
  };
}

export default connect(mapStateToProps)(CharacterArmorClass);
