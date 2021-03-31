import { h } from 'preact';
import type { CombatCharacterSchema } from '../../../schemas/combat-character.schema';
import { connect } from 'react-redux';
import type { RootState } from '@store/reducer';
import { dispatch } from '@store/store';
import {
  setEditingCharacterTopDetails,
  setTopDetails,
  setTopDetailsAdminName,
  setTopDetailsDisplayName,
  setTopDetailsInitiativeRoll
} from '@store/slices/character-details.slice';
import { SocketClient } from '../../../networking/socket-client';
import { SocketMessageType } from '../../../networking/socket-message-type.schema';
import ConfirmOrCancel from '../../../components/buttons/ConfirmOrCancel';
import { Grid, IconButton, TextField, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';

interface Props {
  character: CombatCharacterSchema;
  editing: boolean;
  displayName: string;
  adminName: string;
  roll: number;
}

function CharacterDetailsTop({
  character,
  editing,
  displayName,
  adminName,
  roll
}: Props) {
  function onEditClick() {
    if (!editing) {
      dispatch(setEditingCharacterTopDetails(true));
      dispatch(
        setTopDetails({
          displayName: character.displayName,
          adminName: character.adminName,
          roll: character.roll
        })
      );
    }
  }

  function onCancelEditClick() {
    dispatch(setEditingCharacterTopDetails(false));
  }

  function onSaveEditClick() {
    dispatch(setEditingCharacterTopDetails(false));
    console.log({ displayName, adminName, roll });
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        displayName: displayName,
        adminName: adminName,
        roll: roll
      }
    });
  }

  function onInitiativeChange(event: InputEvent) {
    try {
      const value = parseInt((event.target as HTMLInputElement).value);
      dispatch(setTopDetailsInitiativeRoll(value));
    } catch (e) {}
  }

  function onDisplayNameChange(event: InputEvent) {
    dispatch(
      setTopDetailsDisplayName((event.target as HTMLInputElement).value)
    );
  }

  function onAdminNameChange(event: InputEvent) {
    dispatch(setTopDetailsAdminName((event.target as HTMLInputElement).value));
  }

  if (!editing) {
    return (
      <Grid container>
        <Grid item sm={1}>
          <Typography variant="body1">{character.roll}</Typography>
        </Grid>
        <Grid item sm={10}>
          <Typography variant="h4" component="h3">
            {character.displayName}
          </Typography>
          {character.adminName ? (
            <Typography variant="caption">({character.adminName})</Typography>
          ) : null}
        </Grid>
        <Grid item sm={1}>
          <IconButton onClick={onEditClick}>
            <Edit />
          </IconButton>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container>
      <Grid item sm={2}>
        <TextField
          id="edit-character-initiative"
          label="Initiative"
          variant="filled"
          type="number"
          value={roll}
          onChange={onInitiativeChange}
        />
      </Grid>
      <Grid item sm={8}>
        <TextField
          id="edit-character-display-name"
          label="Name"
          variant="filled"
          value={character.displayName}
          onChange={onDisplayNameChange}
        />
        <TextField
          id="edit-character-admin-notes"
          label="Admin Note"
          variant="filled"
          value={character.adminName}
          onChange={onAdminNameChange}
        />
      </Grid>
      <Grid item sm={2}>
        <ConfirmOrCancel
          onConfirm={onSaveEditClick}
          onCancel={onCancelEditClick}
        />
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
    character: character,
    editing: state.characterDetails.editingTopDetails,
    ...state.characterDetails.topDetails
  };
}

export default connect(mapStateToProps)(CharacterDetailsTop);
