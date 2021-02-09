import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './DisplayInitiativeList.css';

interface Props {
  characters: (CombatCharacterSchema | null)[];
  total: number;
}

const maxShowing = 10;

function DisplayInitiativeList({ characters, total }: Props) {
  return (
    <div className="DisplayInitiativeList">
      {characters.map((character) => {
        return character ? (
          <div className="character">{character.displayName}</div>
        ) : (
          <div className="character next-round">Next Round</div>
        );
      })}

      {total > maxShowing ? (
        <div className="character plus-more">+{total - maxShowing} more</div>
      ) : null}
    </div>
  );
}

function mapStateToProps(state: RootState): Props {
  if (!state.combatTracker) {
    return {
      characters: [],
      total: 0,
    };
  }

  let characters: (CombatCharacterSchema | null)[] = state.combatTracker.characters
    .slice()
    .sort((a, b) => b.roll - a.roll);
  characters.push(null);
  const activeCharacterIndex = characters.findIndex(
    (ch) => ch && ch.id === state.combatTracker!.activeCharacterId,
  );
  characters = characters
    .rotate(activeCharacterIndex >= 0 ? activeCharacterIndex : 0)
    .slice(0, maxShowing);
  return {
    characters: characters,
    total: state.combatTracker.characters.length,
  };
}

export default connect(mapStateToProps)(DisplayInitiativeList);
