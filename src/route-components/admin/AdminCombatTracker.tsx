import {h} from 'preact';
import Button from '../../components/buttons/Button';
import './AdminCombatTracker.css';
import AdminCharacterListPanel from './AdminCharacterListPanel';
import CombatTrackerCharacterScreen from './CombatTrackerCharacterScreen';
import AddCharacterDialog from './AddCharacterDialog';
import {useState} from 'preact/hooks';
import {SocketClient} from '../../networking/socket-client';
import {SocketMessageType} from '../../networking/socket-message-type.schema';

interface State {
  addCharacterDialogOpen?: boolean;
}

function AdminCombatTracker() {

  const [state, setState] = useState<State>({});

  function onNextClick() {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerNextTurn,
      payload: ''
    });
  }

  function onRestartClick() {
    if (window.confirm('Are you sure you want to reset combat?')) {
      // TODO: clear combat
    }
  }

  function onClearClick() {
    if (window.confirm('Are you sure you want to clear the combat tracker?')) {
      // TODO: clear combat
    }
  }

  function onAddCharacterClick() {
    setState({
      addCharacterDialogOpen: true
    });
  }

  function onAddCharacterDialogBackdropClick() {
    setState({
      addCharacterDialogOpen: false
    });
  }

  return (
    <div className="AdminCombatTracker">
      <header>
        <Button onClick={onAddCharacterClick}>Add Character</Button>
        <Button onClick={onNextClick}>Next</Button>
        <Button onClick={onRestartClick}>Restart Combat</Button>
        <Button onClick={onClearClick} danger>Clear Combat</Button>
      </header>

      <AddCharacterDialog
        open={state.addCharacterDialogOpen}
        onClose={onAddCharacterDialogBackdropClick}
      />

      <div class="split">
        <AdminCharacterListPanel/>
        <CombatTrackerCharacterScreen/>
      </div>
    </div>
  );
}

export default AdminCombatTracker;
