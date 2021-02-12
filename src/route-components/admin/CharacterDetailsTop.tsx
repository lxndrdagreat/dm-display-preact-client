import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import { connect } from 'react-redux';
import type { RootState } from '@store/reducer';
import Button from '../../components/buttons/Button';
import Icon from '../../components/Icon';
import NumberInput from '../../components/forms/NumberInput';
import Text from '../../components/forms/Text';
import { dispatch } from '@store/store';
import {
  setEditingCharacterTopDetails,
  setTopDetails,
  setTopDetailsAdminName,
  setTopDetailsDisplayName,
  setTopDetailsInitiativeRoll
} from '@store/slices/character-details.slice';
import './CharacterDetailsTop.css';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import ConfirmOrCancel from '../../components/buttons/ConfirmOrCancel';

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

  function onInitiativeChange(value: number) {
    dispatch(setTopDetailsInitiativeRoll(value));
  }

  function onDisplayNameChange(value: string) {
    dispatch(setTopDetailsDisplayName(value));
  }

  function onAdminNameChange(value: string) {
    dispatch(setTopDetailsAdminName(value));
  }

  return (
    <div className="CharacterDetailsTop">
      {!editing ? (
        <h3>
          <span className="roll">{character.roll}</span> {character.displayName}{' '}
          {character.adminName ? `(${character.adminName})` : ''}
          <Button icon title="Edit" onClick={onEditClick}>
            <Icon name="pencil" />
          </Button>
        </h3>
      ) : (
        <div class="edit-character-top-details">
          <div class="edit-roll">
            <NumberInput
              id="edit-roll"
              value={roll}
              label="Initiative"
              onChange={onInitiativeChange}
            />
          </div>

          <div className="edit-character-name">
            <Text
              id="edit-display-name"
              label="Display Name"
              value={displayName}
              onChange={onDisplayNameChange}
            />
          </div>

          <div className="edit-character-admin-name">
            <Text
              id="edit-admin-name"
              label="Admin Note"
              value={adminName}
              onChange={onAdminNameChange}
            />
          </div>

          <ConfirmOrCancel
            label="Changes"
            onConfirm={onSaveEditClick}
            onCancel={onCancelEditClick}
          />
        </div>
      )}
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
    character: character,
    editing: state.characterDetails.editingTopDetails,
    ...state.characterDetails.topDetails
  };
}

export default connect(mapStateToProps)(CharacterDetailsTop);
