import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './AdminCharacterListPanel.css';
import AdminCombatCharacterItem from './AdminCombatCharacterItem';

interface AdminCharacterListPanelProps {
  characters: CombatCharacterSchema[];
  activeCharacterId: string | null;
}

function AdminCharacterListPanel({
  characters,
  activeCharacterId
}: AdminCharacterListPanelProps) {
  return (
    <div className="AdminCharacterListPanel">
      <ul class="character-list">
        {characters.map((character) => {
          return (
            <AdminCombatCharacterItem
              character={character}
              isTurn={activeCharacterId === character.id}
            />
          );
        })}
      </ul>
    </div>
  );
}

function mapStateToProps(state: RootState): AdminCharacterListPanelProps {
  if (!state.combatTracker) {
    return {
      characters: [],
      activeCharacterId: null
    };
  }

  return {
    characters: state.combatTracker.characters
      .slice()
      .sort((a, b) => b.roll - a.roll),
    activeCharacterId: state.combatTracker.activeCharacterId
  };
}

export default connect(mapStateToProps)(AdminCharacterListPanel);
