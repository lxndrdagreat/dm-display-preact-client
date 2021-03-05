import { h } from 'preact';
import LabelledStat from './LabelledStat';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import Button from '../../../components/buttons/Button';
import Icon from '../../../components/Icon';
import { dispatch } from '@store/store';
import {
  setEditingCharacterArmorClass,
  setNpcArmorClass
} from '@store/slices/character-details.slice';
import { SocketClient } from '../../../networking/socket-client';
import { SocketMessageType } from '../../../networking/socket-message-type.schema';
import NumberInput from '../../../components/forms/NumberInput';
import ConfirmOrCancel from '../../../components/buttons/ConfirmOrCancel';
import './CharacterArmorClass.css';

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

  function onValueChange(value: number) {
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
      <div className="CharacterArmorClass">
        <NumberInput
          id={`edit-armorclass-${characterId}`}
          label="A/C"
          value={value}
          onChange={onValueChange}
        />
        <ConfirmOrCancel
          label="Armor Class"
          onConfirm={onSaveClick}
          onCancel={onDiscardClick}
        />
      </div>
    );
  }
  return (
    <div className="CharacterArmorClass">
      <LabelledStat label="A/C" value={characterAC} icon="shield" />
      <Button icon onClick={onEditClick}>
        <Icon name="pencil" />
      </Button>
    </div>
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
