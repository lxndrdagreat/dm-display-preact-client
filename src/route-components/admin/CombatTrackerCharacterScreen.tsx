import { h } from 'preact';
import './CombatTrackerCharacterScreen.css';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import { connect } from 'react-redux';
import type { RootState } from '../../store/reducer';
import Button from '../../components/buttons/Button';
import Icon from '../../components/Icon';
import RangeSlider from '../../components/forms/RangeSlider';
import Checkbox from '../../components/forms/Checkbox';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import { dispatch } from '../../store/store';
import { setEditingCharacterName, setEditingCharacterURL } from '../../store/slices/character-details.slice';
import NumberInput from '../../components/forms/NumberInput';
import Text from '../../components/forms/Text';
import { useState } from 'preact/hooks';

interface CharacterScreenProps {
  character?: CombatCharacterSchema;
  editingName: boolean;
  editingNPCURL: boolean;
  editingNPCAC: boolean;
  editingNPCHealth: boolean;
}

interface CharacterTopDetailsFormState {
  roll?: number;
  displayName?: string;
  adminName?: string;
}

interface FormStates {
  forCharacter: string;
  topDetails: CharacterTopDetailsFormState;
  npcURL: string;
}

function initFormStatesForCharacter(character: CombatCharacterSchema): FormStates {
  return {
    forCharacter: character.id,
    topDetails: {
      roll: character.roll,
      displayName: character.displayName,
      adminName: character.adminName,
    },
    npcURL: character.npc?.url ? character.npc.url : '',
  };
}

function CombatTrackerCharacterScreen(props: CharacterScreenProps) {

  const { character } = props;

  const [formStates, setFormStates] = useState<FormStates>(
    character
      ? initFormStatesForCharacter(character)
      : {
        forCharacter: '',
        topDetails: {},
        npcURL: '',
      },
  );

  if (character && formStates.forCharacter !== character.id) {
    setFormStates(initFormStatesForCharacter(character));
  }

  function onToggleActiveChange(active: boolean) {
    if (!character) {
      return;
    }
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        active: active,
      },
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
    if (window.confirm('Are you sure you want to remove this NPC Details block?')) {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerUpdateCharacter,
        payload: {
          id: character.id,
          npc: null,
        },
      });
    }
  }

  function onEditCharacterNamesClick() {
    if (!character) {
      return;
    }
    setFormStates({
      ...formStates,
      topDetails: {
        roll: character.roll,
        displayName: character.displayName,
        adminName: character.adminName,
      },
    });
    dispatch(setEditingCharacterName(true));
  }

  function onSaveCharacterTopDetailsClick() {
    dispatch(setEditingCharacterName(false));
    if (!character || character.id !== formStates.forCharacter) {
      return;
    }
    const changes: Partial<CombatCharacterSchema> = {
      id: character.id,
    };
    if (formStates.topDetails.adminName !== character.adminName) {
      changes.adminName = formStates.topDetails.adminName;
    }
    if (formStates.topDetails.displayName &&
      formStates.topDetails.displayName !== character.displayName) {
      changes.displayName = formStates.topDetails.displayName;
    }
    if (formStates.topDetails.roll !== character.roll) {
      changes.roll = formStates.topDetails.roll;
    }
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: changes,
    });
  }

  function onCharacterInitiativeChange(value: number) {
    setFormStates({
      ...formStates,
      topDetails: {
        ...formStates.topDetails,
        roll: value,
      },
    });
  }

  function onCharacterDisplayNameChange(value: string) {
    setFormStates({
      ...formStates,
      topDetails: {
        ...formStates.topDetails,
        displayName: value,
      },
    });
  }

  function onCharacterAdminNameChange(value: string) {
    setFormStates({
      ...formStates,
      topDetails: {
        ...formStates.topDetails,
        adminName: value,
      },
    });
  }

  function onEditNPCURLClick() {
    if (!character) {
      return;
    }
    setFormStates({
      ...formStates,
      npcURL: character.npc?.url ? character.npc.url : ''
    });
    dispatch(setEditingCharacterURL(true));
  }

  function onNPCURLChange(value: string) {
    setFormStates({
      ...formStates,
      npcURL: value
    });
  }

  function onSaveNPCURLClick() {
    dispatch(setEditingCharacterURL(false));
    if (!character || character.id !== formStates.forCharacter || !character.npc) {
      return;
    }
    if (formStates.npcURL !== character.npc.url) {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerUpdateCharacter,
        payload: {
          id: character.id,
          npc: {
            ...character.npc,
            url: formStates.npcURL
          }
        }
      });
    }
  }

  function onNPCHealthChange(value: number) {
    if (!character || !character.npc) {
      return;
    }
    // FIXME: make it so we don't send the entire NPC data block
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

  return (
    <div className='CombatTrackerCharacterScreen'>
      <h2>Character Details</h2>
      {
        !character ? (
          <em>Select a character from the list to the left to see detailed information.</em>
        ) : (
          <div className='body'>
            {
              !props.editingName ? (
                <h3>
                  <span
                    className='roll'>{character.roll}</span> {character.displayName} {character.adminName ? `(${character.adminName})` : ''}
                  <Button icon
                          title='Edit'
                          onClick={onEditCharacterNamesClick}>
                    <Icon name='pencil' />
                  </Button>
                </h3>
              ) : (
                <div class='edit-character-top-details'>

                  <div class='edit-roll'>
                    <NumberInput
                      id='edit-roll'
                      value={formStates.topDetails.roll}
                      label='Initiative'
                      onChange={onCharacterInitiativeChange}
                    />
                  </div>

                  <div className='edit-character-name'>
                    <Text
                      id='edit-display-name'
                      label='Display Name'
                      value={formStates.topDetails.displayName}
                      onChange={onCharacterDisplayNameChange}
                    />
                  </div>

                  <div className='edit-character-admin-name'>
                    <Text
                      id='edit-admin-name'
                      label='Admin Note'
                      value={formStates.topDetails.adminName}
                      onChange={onCharacterAdminNameChange}
                    />
                  </div>

                  <Button icon
                          title='Save Changes'
                          onClick={onSaveCharacterTopDetailsClick}>
                    <Icon name='pencil' />
                  </Button>
                </div>
              )
            }


            <Checkbox
              id='character-details-active'
              label='Active?'
              checked={character.active}
              onChange={onToggleActiveChange}
            />

            {
              character.npc ? (
                <div class='npc-details'>
                  <div class="npc-details__url">
                    <strong>URL:</strong>&nbsp;

                    {
                      props.editingNPCURL ? (
                        <Text
                          id='edit-character-url'
                          label='Edit URL'
                          value={formStates.npcURL}
                          onChange={onNPCURLChange}
                        />
                      ) : (
                        <a href={character.npc.url} target='_blank'>{character.npc.url}</a>
                      )
                    }


                    <Button icon
                            title='Change URL'
                            onClick={props.editingNPCURL ? onSaveNPCURLClick : onEditNPCURLClick}>
                      <Icon name='pencil' />
                    </Button>
                  </div>

                  <div>
                    <RangeSlider
                      min={0}
                      max={character.npc.maxHealth}
                      value={character.npc.health}
                      id='health-slider'
                      label='HP'
                      labelMinMax
                      labelValue
                      trackChanges
                      onChange={onNPCHealthChange}
                    />
                  </div>

                  <div>
                    <Icon name='shield' />
                    {character.npc.armorClass}
                  </div>

                  <Button onClick={onRemoveNPCDetailsClick} danger>Remove NPC Details</Button>
                </div>
              ) : (
                <div>
                  <Button onClick={onAddNPCDetailsClick}>Add NPC Details</Button>
                </div>
              )
            }

          </div>
        )
      }
    </div>
  );
}

function mapStateToProps(state: RootState): CharacterScreenProps {
  if (state.characterDetails && state.combatTracker) {
    const id = state.characterDetails.characterId;
    return {
      character: state.combatTracker.characters.find(ch => ch.id === id),
      editingName: state.characterDetails.editingName,
      editingNPCAC: state.characterDetails.editingNPCAC,
      editingNPCHealth: state.characterDetails.editingNPCHealth,
      editingNPCURL: state.characterDetails.editingNPCURL,
    };
  }
  return {
    editingName: false,
    editingNPCAC: false,
    editingNPCHealth: false,
    editingNPCURL: false,
  };
}

export default connect(mapStateToProps)(CombatTrackerCharacterScreen);
