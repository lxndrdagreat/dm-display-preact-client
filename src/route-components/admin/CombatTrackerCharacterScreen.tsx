import {h} from 'preact';
import './CombatTrackerCharacterScreen.css';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import { connect } from 'react-redux';
import type { RootState } from '../../store/reducer';
import Button from '../../components/buttons/Button';
import Icon from '../../components/Icon';
import RangeSlider from '../../components/forms/RangeSlider';

interface CharacterScreenProps {
  character?: CombatCharacterSchema;
}

function CombatTrackerCharacterScreen({character}: CharacterScreenProps) {

  function onAddNPCDetailsClick() {
    // TODO: add NPC details to character
  }

  function onRemoveNPCDetailsClick() {
    if (window.confirm('Are you sure you want to remove this NPC Details block?')) {
      // TODO: remove NPC details from character
    }
  }

  function onNPCHealthChange(value: number) {
    // TODO: handle npc health change
  }

  return (
    <div className="CombatTrackerCharacterScreen">
      <h2>Character Details</h2>
      {
        !character ? (
          <em>Select a character from the list to the left to see detailed information.</em>
        ) : (
          <div className='body'>
            <h3>
              <span className='roll'>{ character.roll }</span>  { character.displayName } { character.adminName ? `(${character.adminName})` : '' }
            </h3>

            {
              character.npc ? (
                <div class="npc-details">
                  <div>
                    <RangeSlider
                      min={0}
                      max={character.npc.maxHealth}
                      value={character.npc.health}
                      id="health-slider"
                      label="HP"
                      labelMinMax
                      labelValue
                      onChange={onNPCHealthChange}
                      />
                  </div>

                  <div>
                    <Icon name="shield"/>
                    { character.npc.armorClass }
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
      character: state.combatTracker.characters.find(ch => ch.id === id)
    }
  }
  return {};
}

export default connect(mapStateToProps)(CombatTrackerCharacterScreen);
