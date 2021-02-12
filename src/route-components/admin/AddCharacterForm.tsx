import { h } from 'preact';
import type { NPCDetails } from '../../schemas/combat-character.schema';
import { useState } from 'preact/hooks';
import Text from '../../components/forms/Text';
import Checkbox from '../../components/forms/Checkbox';
import NumberInput from '../../components/forms/NumberInput';
import FormRow from '../../components/forms/FormRow';
import Button from '../../components/buttons/Button';
import { SocketClient } from '../../networking/socket-client';
import { randomInt } from '../../utils/random';
import { SocketMessageType } from '../../networking/socket-message-type.schema';

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
    armorClass: 0
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

  function onAddCharacterDisplayNameChange(value: string) {
    setState({
      ...state,
      displayName: value
    });
  }

  function onAddCharacterAdminNameChange(value: string) {
    setState({
      ...state,
      adminName: value
    });
  }

  function onAddCharacterRollChange(value: number) {
    setState({
      ...state,
      roll: value
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
    <div className="AddCharacterForm">
      <fieldset>
        <legend>Add Character</legend>

        <FormRow>
          <Text
            id="add-character-display-name"
            label="Name"
            value={state.displayName}
            onChange={onAddCharacterDisplayNameChange}
          />

          <Text
            id="add-character-admin-name"
            label="Admin-only label"
            value={state.adminName}
            onChange={onAddCharacterAdminNameChange}
          />
        </FormRow>

        <FormRow>
          <NumberInput
            id="add-character-roll"
            label="Initiative"
            value={state.roll}
            onChange={onAddCharacterRollChange}
          />
          <div>
            <Button onClick={onRollInitClick}>Roll</Button>
          </div>
        </FormRow>

        <FormRow>
          <Checkbox id="add-character-active" label="Active" />
        </FormRow>

        <FormRow>
          <Checkbox
            id="add-character-npc-block"
            label="NPC Block"
            checked={!!state.npc}
            onChange={onNPCBlockChange}
          />
        </FormRow>
        {state.npc ? (
          <div class="add-character-npc-block">
            <FormRow>
              <Text
                id="add-character-npc-url"
                label="URL"
                onChange={onAddCharacterNPCURLChange}
              />
            </FormRow>

            <FormRow>
              <NumberInput
                id="add-character-npc-health"
                label="Health"
                value={state.npc.maxHealth}
                min={0}
                onChange={onAddCharacterNPCHealthChange}
              />

              <NumberInput
                id="add-character-npc-armorclass"
                label="A/C"
                value={state.npc.armorClass}
                min={0}
                onChange={onAddCharacterNPCArmorClassChange}
              />
            </FormRow>
          </div>
        ) : null}

        <div class="add-character-controls">
          <Button onClick={onAddCharacterClick}>Add Character</Button>
        </div>
      </fieldset>
    </div>
  );
}

export default AddCharacterForm;
