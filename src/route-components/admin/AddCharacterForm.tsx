import { h } from 'preact';
import type { NPCDetails } from '../../schemas/combat-character.schema';
import { useState } from 'preact/hooks';
import { SocketClient } from '../../networking/socket-client';
import { randomInt } from '../../utils/random';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import {
  Button,
  FormControlLabel,
  Grid,
  Switch,
  TextField
} from '@material-ui/core';

interface State {
  active: boolean;
  roll: number;
  displayName: string;
  adminName: string;
  nameVisible: boolean;
  npc: NPCDetails | null;
}

function initForm(): State {
  return {
    active: true,
    roll: 0,
    displayName: '',
    adminName: '',
    nameVisible: true,
    npc: null
  };
}

function initNPCDetails(): NPCDetails {
  return {
    url: '',
    maxHealth: 0,
    health: 0,
    armorClass: 0,
    actions: []
  };
}

function AddCharacterForm() {
  const [state, setState] = useState<State>(initForm());

  function onNPCBlockChange(checked: boolean) {
    if (checked) {
      setState({
        ...state,
        npc: initNPCDetails()
      });
    } else {
      setState({
        ...state,
        npc: null
      });
    }
  }

  function onRollInitClick() {
    setState({
      ...state,
      roll: randomInt(1, 21)
    });
  }

  function onAddCharacterDisplayNameChange(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value;
    setState({
      ...state,
      displayName: value
    });
  }

  function onAddCharacterAdminNameChange(event: InputEvent) {
    const value = (event.target as HTMLInputElement).value;
    setState({
      ...state,
      adminName: value
    });
  }

  function onAddCharacterRollChange(event: InputEvent) {
    const value = parseInt((event.target as HTMLInputElement).value);
    setState({
      ...state,
      roll: value
    });
  }

  function onActiveChange(event: InputEvent) {
    setState({
      ...state,
      active: !state.active
    });
  }

  function onAddCharacterNPCURLChange(value: string) {
    if (!state.npc) {
      return;
    }
    setState({
      ...state,
      npc: {
        ...state.npc,
        url: value
      }
    });
  }

  function onAddCharacterNPCHealthChange(value: number) {
    if (!state.npc) {
      return;
    }
    setState({
      ...state,
      npc: {
        ...state.npc,
        maxHealth: value,
        health: value
      }
    });
  }

  function onAddCharacterNPCArmorClassChange(value: number) {
    if (!state.npc) {
      return;
    }
    setState({
      ...state,
      npc: {
        ...state.npc,
        armorClass: value
      }
    });
  }

  function onAddCharacterClick() {
    if (!state.displayName.length) {
      return;
    }
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerAddCharacter,
      payload: {
        ...state
      }
    });
    SocketClient.instance.nextOfType(
      SocketMessageType.CombatTrackerCharacterAdded,
      () => {
        setState(initForm());
      }
    );
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12} md={6}>
        <TextField
          label="Name"
          value={state.displayName}
          onChange={onAddCharacterDisplayNameChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <TextField
          label="Admin Note"
          value={state.adminName}
          onChange={onAddCharacterAdminNameChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Initiative"
          type="number"
          value={state.roll}
          onChange={onAddCharacterRollChange}
        />
        <Button variant="text" color="secondary" onClick={onRollInitClick}>
          Roll
        </Button>
      </Grid>
      <Grid item xs={12}>
        <FormControlLabel
          control={
            <Switch
              checked={state.active}
              name="Active"
              onChange={onActiveChange}
            />
          }
          label="Active"
        />
      </Grid>
      <Grid item xs={12}>
        <Button
          color="primary"
          variant="contained"
          onClick={onAddCharacterClick}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
}

export default AddCharacterForm;
