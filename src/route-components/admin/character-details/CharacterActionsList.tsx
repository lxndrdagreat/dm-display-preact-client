import { h } from 'preact';
import CharacterActionsListItem from './CharacterActionsListItem';
import Button from '../../../components/buttons/Button';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './CharacterActionsList.css';
import { useState } from 'preact/hooks';
import ModalWrap from '../../../components/ModalWrap';
import Text from '../../../components/forms/Text';
import { SocketClient } from '../../../networking/socket-client';
import { SocketMessageType } from '../../../networking/socket-message-type.schema';

interface Props {
  characterId: string;
  actions: { name: string; info: string }[];
}

interface FormState {
  editing: boolean;
  index: number;
  nameField: string;
  infoField: string;
}

function CharacterActionsList({ actions, characterId }: Props) {
  const [state, setState] = useState<FormState>({
    editing: false,
    index: -1,
    nameField: '',
    infoField: ''
  });

  function onAddActionClick() {
    setState({
      editing: true,
      index: -1,
      nameField: '',
      infoField: ''
    });
  }

  function onSaveActionClick() {
    if (state.nameField.trim() && state.infoField.trim()) {
      if (state.index === -1) {
        const updatedActions = actions.slice();
        updatedActions.push({
          name: state.nameField,
          info: state.infoField
        });
        // new action
        SocketClient.instance.send({
          type: SocketMessageType.CombatTrackerUpdateCharacterNPC,
          payload: {
            id: characterId,
            npc: {
              actions: updatedActions
            }
          }
        });
      } else {
        // TODO: handle editing vs new
      }
    }

    setState({
      editing: false,
      index: -1,
      nameField: '',
      infoField: ''
    });
  }

  function onEditModalBackdropClick() {
    setState({
      editing: false,
      index: -1,
      nameField: '',
      infoField: ''
    });
  }

  function onActionNameChange(value: string) {
    setState({
      ...state,
      nameField: value
    });
  }

  function onActionInfoChange(value: string) {
    setState({
      ...state,
      infoField: value
    });
  }

  return (
    <div className="CharacterActionsList">
      <h4>Actions:</h4>
      <ul>
        {actions.map((action) => (
          <CharacterActionsListItem
            info={action.info}
            name={action.name}
            onEditClick={() => {}}
          />
        ))}
      </ul>

      <ModalWrap
        active={state.editing}
        onBackgroundClick={onEditModalBackdropClick}
      >
        <div className="add-action-modal-body">
          <Text
            id="edit-action-name"
            label="Name"
            onChange={onActionNameChange}
          />
          <Text
            id="edit-action-info"
            label="Info"
            long
            onChange={onActionInfoChange}
          />
          <Button primary onClick={onSaveActionClick}>
            Save
          </Button>
        </div>
      </ModalWrap>

      <Button onClick={onAddActionClick}>Add</Button>
    </div>
  );
}

function mapStateToProps(state: RootState): Props {
  if (!state.characterDetails) {
    throw new Error('No character details are being viewed.');
  }
  const character = state.combatTracker!.characters.find(
    (ch) => ch.id === state.characterDetails!.characterId
  );
  if (!character) {
    throw new Error('Character not found.');
  }
  return {
    characterId: character.id,
    actions: character.npc ? character.npc.actions ?? [] : []
  };
}

export default connect(mapStateToProps)(CharacterActionsList);
