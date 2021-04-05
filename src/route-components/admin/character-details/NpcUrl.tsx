import { Fragment, h } from 'preact';
import type { CombatCharacterSchema } from '../../../schemas/combat-character.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import { dispatch } from '@store/store';
import {
  setEditingCharacterURL,
  setNpcUrl
} from '@store/slices/character-details.slice';
import { SocketClient } from '../../../networking/socket-client';
import { SocketMessageType } from '../../../networking/socket-message-type.schema';
import { Grid, IconButton, TextField, Typography } from '@material-ui/core';
import { Edit } from '@material-ui/icons';
import ConfirmOrCancel from '../../../components/buttons/ConfirmOrCancel';

interface Props {
  character: CombatCharacterSchema;
  editing: boolean;
  npcUrl: string;
}

function NpcUrl({ character, editing, npcUrl }: Props) {
  function onEditNpcUrlClick() {
    dispatch(setEditingCharacterURL(true));
    dispatch(setNpcUrl(character.npc!.url));
  }

  function onSaveNpcUrlClick() {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        npc: {
          ...character.npc,
          url: npcUrl
        }
      }
    });
    dispatch(setEditingCharacterURL(false));
  }

  function onDiscardClick() {
    dispatch(setEditingCharacterURL(false));
  }

  function onNpcUrlChange(event: InputEvent) {
    dispatch(setNpcUrl((event.target as HTMLInputElement).value));
  }

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item sm={1}>
        <Typography variant="subtitle2">URL</Typography>
      </Grid>
      {editing ? (
        <Fragment>
          <Grid item sm={9}>
            <TextField
              id="edit-npc-url-field"
              onChange={onNpcUrlChange}
              fullWidth
              value={npcUrl}
            />
          </Grid>
          <Grid item sm={2}>
            <ConfirmOrCancel
              onConfirm={onSaveNpcUrlClick}
              onCancel={onDiscardClick}
            />
          </Grid>
        </Fragment>
      ) : (
        <Fragment>
          <Grid item sm={10}>
            <a href={character.npc!.url} target="_blank">
              {character.npc!.url}
            </a>
          </Grid>
          <Grid item sm={1}>
            <IconButton onClick={onEditNpcUrlClick}>
              <Edit />
            </IconButton>
          </Grid>
        </Fragment>
      )}
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
    editing: state.characterDetails.editingNPCURL,
    npcUrl: state.characterDetails.npcUrl
  };
}

export default connect(mapStateToProps)(NpcUrl);
