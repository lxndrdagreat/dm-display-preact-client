import { h } from 'preact';
import './CombatTrackerCharacterScreen.css';
import type {
  CharacterConditions,
  CombatCharacterSchema,
} from '../../schemas/combat-character.schema';
import { connect } from 'react-redux';
import type { RootState } from '@store/reducer';
import Button from '../../components/buttons/Button';
import Icon from '../../components/Icon';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import type { CharacterDetailsState } from '@store/slices/character-details.slice';
import CharacterConditionList from './CharacterConditionList';
import CharacterDetailsTop from './CharacterDetailsTop';
import NpcUrl from './NpcUrl';
import CharacterHealth from './CharacterHealth';
import LabelledStat from './LabelledStat';
import CharacterArmorClass from './CharacterArmorClass';

interface CharacterScreenProps {
  character?: CombatCharacterSchema;
  details: CharacterDetailsState | null;
}

function CombatTrackerCharacterScreen(props: CharacterScreenProps) {
  const { character } = props;

  function onToggleActiveChange() {
    if (!character) {
      return;
    }
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        active: !character.active,
      },
    });
  }

  function onDuplicateCharacterClick() {
    if (!character) {
      return;
    }
    const dupe: Partial<CombatCharacterSchema> = {
      ...character,
    };
    delete dupe.id;
    delete dupe.conditions;
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerAddCharacter,
      payload: dupe as Omit<CombatCharacterSchema, 'id' | 'conditions'>,
    });
  }

  function onAddNPCDetailsClick() {
    if (!character) {
      return;
    }
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        npc: {
          armorClass: 0,
          health: 10,
          maxHealth: 10,
          url: '',
        },
      },
    });
  }

  function onRemoveNPCDetailsClick() {
    if (!character) {
      return;
    }
    if (
      window.confirm('Are you sure you want to remove this NPC Details block?')
    ) {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerUpdateCharacter,
        payload: {
          id: character.id,
          npc: null,
        },
      });
    }
  }

  function onConditionChange(condition: CharacterConditions) {
    if (!character) {
      return;
    }
    const indexOf = character.conditions.indexOf(condition);
    if (indexOf >= 0) {
      const cons = character.conditions.slice();
      cons.splice(indexOf, 1);
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerUpdateCharacter,
        payload: {
          id: character.id,
          conditions: cons,
        },
      });
    } else {
      const cons = character.conditions.slice();
      cons.push(condition);
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerUpdateCharacter,
        payload: {
          id: character.id,
          conditions: cons,
        },
      });
    }
  }

  function onDeleteCharacterClick() {
    if (!character) {
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete "${character.displayName}"?`,
      )
    ) {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerRemoveCharacter,
        payload: character.id,
      });
    }
  }

  return (
    <div className="CombatTrackerCharacterScreen">
      <h2>Character Details</h2>
      {!character ? (
        <em>
          Select a character from the list to the left to see detailed
          information.
        </em>
      ) : (
        <div className="body">
          <CharacterDetailsTop />

          <div className="info-row">
            <CharacterConditionList
              conditions={character.conditions}
              onConditionChange={onConditionChange}
            />

            <div>
              <div>
                {character.active ? (
                  <Button danger onClick={onToggleActiveChange}>
                    Deactivate
                  </Button>
                ) : (
                  <Button primary onClick={onToggleActiveChange}>
                    Activate
                  </Button>
                )}
              </div>
              <div>
                <Button onClick={onDuplicateCharacterClick}>Duplicate</Button>
              </div>
              <div>
                <Button danger onClick={onDeleteCharacterClick}>
                  Delete
                </Button>
              </div>
            </div>
          </div>

          {
            /* Character NPC Block */
            character.npc ? (
              <div class="npc-details">
                <NpcUrl />

                <CharacterHealth />

                <CharacterArmorClass />

                <Button onClick={onRemoveNPCDetailsClick} danger>
                  Remove NPC Details
                </Button>
              </div>
            ) : (
              <div>
                <Button onClick={onAddNPCDetailsClick}>Add NPC Details</Button>
              </div>
            )
          }
        </div>
      )}
    </div>
  );
}

function mapStateToProps(state: RootState): CharacterScreenProps {
  if (state.characterDetails && state.combatTracker) {
    const id = state.characterDetails.characterId;
    return {
      character: state.combatTracker.characters.find((ch) => ch.id === id),
      details: state.characterDetails,
    };
  }
  return {
    details: null,
  };
}

export default connect(mapStateToProps)(CombatTrackerCharacterScreen);
