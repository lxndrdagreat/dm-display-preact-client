import { h } from 'preact';
import type { CombatCharacterSchema } from '../../../schemas/combat-character.schema';
import { SocketClient } from '../../../networking/socket-client';
import { SocketMessageType } from '../../../networking/socket-message-type.schema';
import { dispatch } from '@store/store';
import {
  setEditingCharacterHealth,
  setNpcMaxHealth
} from '@store/slices/character-details.slice';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import ConfirmOrCancel from '../../../components/buttons/ConfirmOrCancel';
import {
  Grid,
  IconButton,
  Slider,
  TextField,
  Typography
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';

interface Props {
  character: CombatCharacterSchema;
  editing: boolean;
  maxHealth: number;
}

function CharacterHealth({ character, editing, maxHealth }: Props) {
  function onHealthChange(event: InputEvent, newValue: number | number[]) {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        npc: {
          ...character.npc,
          health: newValue
        }
      }
    });
  }

  function onMaxHealthChange(event: InputEvent) {
    const value = parseInt((event.target as HTMLInputElement).value);
    dispatch(setNpcMaxHealth(value));
  }

  function onEditClick() {
    dispatch(setEditingCharacterHealth(true));
    dispatch(setNpcMaxHealth(character.npc!.maxHealth));
  }

  function onSaveClick() {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        npc: {
          ...character.npc,
          maxHealth: maxHealth
        }
      }
    });
    dispatch(setEditingCharacterHealth(false));
  }

  function onDiscardClick() {
    dispatch(setEditingCharacterHealth(false));
  }

  if (editing) {
    return (
      <Grid container>
        <Grid item xs={6} md={3}>
          <TextField
            type="number"
            label="Max Health"
            value={maxHealth}
            onChange={onMaxHealthChange}
          />
        </Grid>
        <Grid item xs={6} md={2}>
          <ConfirmOrCancel onConfirm={onSaveClick} onCancel={onDiscardClick} />
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container>
      <Grid item xs={11}>
        <Typography id="health-slider" variant="subtitle2" gutterBottom>
          Health
        </Typography>
        <Slider
          defaultValue={character.npc!.health}
          step={1}
          aria-labelledby="health-slider"
          marks={true}
          min={0}
          max={character.npc!.maxHealth}
          value={character.npc!.health ?? 0}
          onChange={onHealthChange}
          valueLabelDisplay="auto"
        />
      </Grid>
      <Grid item xs={1}>
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
    character: character,
    editing: state.characterDetails.editingNPCHealth,
    maxHealth: state.characterDetails.npcMaxHealth
  };
}

export default connect(mapStateToProps)(CharacterHealth);
