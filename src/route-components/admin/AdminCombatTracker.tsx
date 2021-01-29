import {h} from 'preact';
import Button from '../../components/buttons/Button';
import './AdminCombatTracker.css';
import AdminCharacterListPanel from './AdminCharacterListPanel';

function AdminCombatTracker() {

  function onNextClick() {

  }

  function onRestartClick() {

  }

  function onClearClick() {
    if (window.confirm('Are you sure you want to clear the combat tracker?')) {

    }
  }

  return (
    <div className="AdminCombatTracker">
      <header>
        <Button onClick={onNextClick}>Next</Button>
        <Button onClick={onRestartClick}>Restart Combat</Button>
        <Button onClick={onClearClick}>Clear Combat</Button>
      </header>

      <div class="split">
        <AdminCharacterListPanel/>
      </div>
    </div>
  );
}

export default AdminCombatTracker;
