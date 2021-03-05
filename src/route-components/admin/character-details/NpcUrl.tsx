import { h } from 'preact';
import type { CombatCharacterSchema } from '../../../schemas/combat-character.schema';
import Button from '../../../components/buttons/Button';
import Icon from '../../../components/Icon';
import Text from '../../../components/forms/Text';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import { dispatch } from '@store/store';
import {
  setEditingCharacterURL,
  setNpcUrl
} from '@store/slices/character-details.slice';
import './NpcUrl.css';
import { SocketClient } from '../../../networking/socket-client';
import { SocketMessageType } from '../../../networking/socket-message-type.schema';

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

  function onNpcUrlChange(value: string) {
    dispatch(setNpcUrl(value));
  }

  return (
    <div className="NpcUrl">
      <strong>URL:</strong>&nbsp;
      {editing ? (
        <div>
          <Text
            id="edit-character-url"
            label="Edit URL"
            noLabel
            value={npcUrl}
            onChange={onNpcUrlChange}
          />
          <Button icon title="Discard Changes" onClick={onDiscardClick}>
            <Icon name="cancel" />
          </Button>
          <Button icon title="Save Changes" onClick={onSaveNpcUrlClick}>
            <Icon name="confirm" />
          </Button>
        </div>
      ) : (
        <div>
          <a href={character.npc!.url} target="_blank">
            {character.npc!.url}
          </a>
          <Button icon title="Change URL" onClick={onEditNpcUrlClick}>
            <Icon name="pencil" />
          </Button>
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
    editing: state.characterDetails.editingNPCURL,
    npcUrl: state.characterDetails.npcUrl
  };
}

export default connect(mapStateToProps)(NpcUrl);
