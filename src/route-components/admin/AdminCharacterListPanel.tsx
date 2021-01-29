import {h} from 'preact';
import type {CombatCharacterSchema} from '../../schemas/combat-character.schema';
import type {RootState} from '../../store/reducer';
import {connect} from 'react-redux';
import './AdminCharacterListPanel.css';
import AddCharacterForm from './AddCharacterForm';

interface AdminCharacterListPanelProps {
  characters: CombatCharacterSchema[];
}

function AdminCharacterListPanel({characters}: AdminCharacterListPanelProps) {

  return (
    <div className="AdminCharacterListPanel">

      <AddCharacterForm/>

      <ul class="character-list">
        {
          characters.map(charater => {
            return <li class="character-list-item">{charater.displayName}</li>
          })
        }
      </ul>

    </div>
  );
}

function mapStateToProps(state: RootState): AdminCharacterListPanelProps {
  return {
    characters: state.combatTracker ? state.combatTracker.characters : []
  };
}

export default connect(mapStateToProps)(AdminCharacterListPanel);
