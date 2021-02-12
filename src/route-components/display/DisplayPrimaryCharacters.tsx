import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './DisplayPrimaryCharacters.css';

interface Props {
  activeCharacter: CombatCharacterSchema | null;
  onDeckCharacter: CombatCharacterSchema | null;
}

function DisplayPrimaryCharacters({ activeCharacter, onDeckCharacter }: Props) {
  if (!activeCharacter) {
    return (
      <div className="DisplayPrimaryCharacters">
        <div>Waiting for combat to start.</div>
      </div>
    );
  }

  return (
    <div className="DisplayPrimaryCharacters">
      <div className="active-character">{activeCharacter.displayName}</div>
      {onDeckCharacter ? (
        <div className="next-character">{onDeckCharacter.displayName}</div>
      ) : null}
    </div>
  );
}

function mapStateToProps(state: RootState): Props {
  if (!state.combatTracker) {
    return {
      activeCharacter: null,
      onDeckCharacter: null
    };
  }
  const characters = state.combatTracker.characters
    .slice()
    .sort((a, b) => b.roll - a.roll);
  const activeIndex = characters.findIndex(
    (ch) => ch.id === state.combatTracker!.activeCharacterId
  );
  if (activeIndex < 0) {
    return {
      activeCharacter: null,
      onDeckCharacter: null
    };
  }
  const nextUpIndex =
    activeIndex + 1 >= characters.length ? 0 : activeIndex + 1;
  return {
    activeCharacter: state.combatTracker.characters[activeIndex],
    onDeckCharacter: state.combatTracker.characters[nextUpIndex]
  };
}

export default connect(mapStateToProps)(DisplayPrimaryCharacters);
