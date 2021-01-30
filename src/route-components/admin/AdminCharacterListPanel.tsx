import {h} from 'preact';
import type {CombatCharacterSchema} from '../../schemas/combat-character.schema';
import type {RootState} from '../../store/reducer';
import {connect} from 'react-redux';
import './AdminCharacterListPanel.css';
import AdminCombatCharacterItem from './AdminCombatCharacterItem';

interface AdminCharacterListPanelProps {
  characters: CombatCharacterSchema[];
}

function AdminCharacterListPanel({characters}: AdminCharacterListPanelProps) {

  return (
    <div className="AdminCharacterListPanel">
      <ul class="character-list">
        {
          characters.map(charater => {
            return <AdminCombatCharacterItem
              character={charater}
              isTurn={false}
            />
          })
        }
      </ul>

    </div>
  );
}

function mapStateToProps(state: RootState): AdminCharacterListPanelProps {
  return {
    characters: (state.combatTracker ? state.combatTracker.characters.slice() : []).sort((a, b) => b.roll - a.roll)
  };
}

export default connect(mapStateToProps)(AdminCharacterListPanel);
