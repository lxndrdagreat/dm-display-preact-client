import { h } from 'preact';
import { useState } from 'preact/hooks';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import RoundInfo from './RoundInfo';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid
} from '@material-ui/core';
import AdminCharacterListPanel from './AdminCharacterListPanel';
import CombatTrackerCharacterScreen from './character-details/CombatTrackerCharacterScreen';
import AddCharacterForm from './AddCharacterForm';

interface State {
  addCharacterDialogOpen?: boolean;
  confirm?: 'restart' | 'clear';
}

function AdminCombatTracker() {
  const [state, setState] = useState<State>({});

  function onRestartClick() {
    setState({
      confirm: 'restart'
    });
  }

  function onClearClick() {
    setState({
      confirm: 'clear'
    });
  }

  function handleConfirm() {
    if (state.confirm === 'restart') {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerRequestRestart
      });
    } else if (state.confirm === 'clear') {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerRequestClear
      });
    }

    setState({});
  }

  function handleConfirmClose() {
    setState({});
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
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
          <RoundInfo />
        </Grid>
        <Grid item xs={12} md={10}>
          <Grid container spacing={1}>
            <Grid item>
              <Button
                variant="outlined"
                color="primary"
                onClick={onAddCharacterClick}
              >
                Add Character
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onRestartClick}
              >
                Restart Combat
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                color="secondary"
                onClick={onClearClick}
              >
                Clear Combat
              </Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <AdminCharacterListPanel />
        </Grid>
        <Grid item xs={12} md={9}>
          <CombatTrackerCharacterScreen />
        </Grid>
      </Grid>

      <Dialog
        open={!!state.addCharacterDialogOpen}
        onClose={onAddCharacterDialogBackdropClick}
        aria-labelledby="add-character-dialog-title"
      >
        <DialogTitle id="add-character-dialog-title">Add Character</DialogTitle>
        <DialogContent>
          <AddCharacterForm />
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!state.confirm}
        onClose={handleConfirmClose}
        aria-labelledby="confirm-dialog-title"
      >
        <DialogTitle id="confirm-dialog-title">
          {state.confirm === 'clear'
            ? 'Clear Combat Tracker?'
            : 'Restart Combat?'}
        </DialogTitle>
        <DialogContent>
          {state.confirm === 'clear' ? (
            <DialogContentText>
              This will completely reset the combat tracker.
            </DialogContentText>
          ) : (
            <DialogContentText>
              This will restart the current combat from the first round.
            </DialogContentText>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirm} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AdminCombatTracker;
