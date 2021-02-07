import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import RangeSlider from '../../components/forms/RangeSlider';
import NumberInput from '../../components/forms/NumberInput';
import Button from '../../components/buttons/Button';
import Icon from '../../components/Icon';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import { dispatch } from '@store/store';
import { setEditingCharacterHealth, setNpcMaxHealth } from '@store/slices/character-details.slice';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './CharacterHealth.css';

interface Props {
  character: CombatCharacterSchema;
  editing: boolean;
  maxHealth: number;
}

function CharacterHealth({character, editing, maxHealth}: Props) {

  function onHealthChange(value: number) {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        npc: {
          ...character.npc,
          health: value,
        },
      },
    });
  }

  function onMaxHealthChange(value: number) {
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

  return (
    <div className='CharacterHealth'>
      <RangeSlider
        min={0}
        max={character.npc!.maxHealth}
        value={character.npc!.health}
        id='health-slider'
        label='HP'
        labelMinMax
        labelValue
        trackChanges
        onChange={onHealthChange}
      />

      {
        editing ? (
          <NumberInput
            id='edit-character-max-health'
            label='Max Health'
            value={maxHealth}
            onChange={onMaxHealthChange}
          />
        ) : null
      }

      {
        !editing ? (
          <Button icon
                  title='Edit Health'
                  onClick={onEditClick}>
            <Icon name='pencil' />
          </Button>
        ) : null
      }

      {
        editing ? (
          <Button icon
                  title='Discard Health'
                  onClick={onDiscardClick}>
            <Icon name='cancel' />
          </Button>
        ) : null
      }

      {
        editing ? (
          <Button icon
                  title='Save Health'
                  onClick={onSaveClick}>
            <Icon name='confirm' />
          </Button>
        ) : null
      }
    </div>
  );
}

function mapStateToProps(state: RootState): Props {
  const character = state.combatTracker!.characters.find(ch => ch.id === state.characterDetails!.characterId);
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
