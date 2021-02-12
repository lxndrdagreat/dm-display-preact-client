import { h } from 'preact';
import Button from '../../components/buttons/Button';
import './AdminCombatTracker.css';
import AdminCharacterListPanel from './AdminCharacterListPanel';
import CombatTrackerCharacterScreen from './CombatTrackerCharacterScreen';
import AddCharacterDialog from './AddCharacterDialog';
import { useState } from 'preact/hooks';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import HeaderStatus from './HeaderStatus';
import RoundInfo from './RoundInfo';

interface State {
  addCharacterDialogOpen?: boolean;
}

function AdminCombatTracker() {
  const [state, setState] = useState<State>({});

  function onNextClick() {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerNextTurn
    });
  }

  function onRestartClick() {
    if (window.confirm('Are you sure you want to restart this combat?')) {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerRequestRestart
      });
    }
  }

  function onClearClick() {
    if (window.confirm('Are you sure you want to clear the combat tracker?')) {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerRequestClear
      });
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
        <RoundInfo />
        <div className="header-controls">
          <Button onClick={onAddCharacterClick}>Add Character</Button>
          <Button onClick={onNextClick}>Next</Button>
          <Button onClick={onRestartClick}>Restart Combat</Button>
          <Button onClick={onClearClick} danger>
            Clear Combat
          </Button>
        </div>
        <HeaderStatus />
      </header>

      <AddCharacterDialog
        open={state.addCharacterDialogOpen}
        onClose={onAddCharacterDialogBackdropClick}
      />

      <div class="split">
        <AdminCharacterListPanel />
        <CombatTrackerCharacterScreen />
      </div>
    </div>
  );
}

export default AdminCombatTracker;
