import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './AdminCharacterListPanel.css';
import AdminCombatCharacterItem from './AdminCombatCharacterItem';

interface AdminCharacterListPanelProps {
  characters: CombatCharacterSchema[];
  activeCharacterId: string | null;
  editingCharacterId: string | null;
}

function AdminCharacterListPanel({
  characters,
  activeCharacterId,
  editingCharacterId
}: AdminCharacterListPanelProps) {
  return (
    <div className="AdminCharacterListPanel">
      <ul class="character-list">
        {characters.map((character) => {
          return (
            <AdminCombatCharacterItem
              character={character}
              isTurn={activeCharacterId === character.id}
              isEditing={editingCharacterId === character.id}
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
      activeCharacterId: null,
      editingCharacterId: null
    };
  }

  return {
    characters: state.combatTracker.characters
      .slice()
      .sort((a, b) => b.roll - a.roll),
    activeCharacterId: state.combatTracker.activeCharacterId,
    editingCharacterId: state.characterDetails
      ? state.characterDetails.characterId
      : null
  };
}

export default connect(mapStateToProps)(AdminCharacterListPanel);
