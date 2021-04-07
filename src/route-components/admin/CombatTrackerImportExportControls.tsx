import { h } from 'preact';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  makeStyles,
  Menu,
  MenuItem
} from '@material-ui/core';
import { downloadDataAsFile, readFile } from '../../utils/file-access';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import store from '@store/store';
import { useState } from 'preact/hooks';
import type { RootState } from '@store/reducer';
import type { CombatTrackerSchema } from '../../schemas/combat-tracker.schema';
import { MoreVert } from '@material-ui/icons';
import AddCharacterForm from './AddCharacterForm';

interface State {
  importOpen?: boolean;
  file?: File | null;
  anchorEl?: HTMLElement | null;
  addCharacterDialogOpen?: boolean;
  confirm?: 'restart' | 'clear';
}

const useStyles = makeStyles((theme) => ({
  importInput: {
    display: 'none'
  }
}));

export default function CombatTrackerImportExportControls() {
  const [state, setState] = useState<State>({});

  const classes = useStyles();

  function onImportClick() {
    setState({
      file: null,
      importOpen: true
    });
  }

  function handleMenuClick(event: MouseEvent) {
    setState({
      anchorEl: event.currentTarget as HTMLElement
    });
  }

  function handleMenuClose() {
    setState({
      anchorEl: null
    });
  }

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

  async function onImportFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files || !files.length) {
      return;
    }

    const [file] = files;

    try {
      const data = await readFile(file);
      const parsed = JSON.parse(data) as CombatTrackerSchema;
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerState,
        payload: parsed
      });
      setState({
        importOpen: false,
        file: null,
        anchorEl: null
      });
    } catch (e) {
      console.error(e);
    }
  }

  function onImportDialogClose() {
    setState({
      importOpen: false,
      file: null,
      anchorEl: null
    });
  }

  function onExportClick() {
    const { combatTracker } = store.getState() as RootState;
    if (!combatTracker) {
      return;
    }

    const asString = JSON.stringify(combatTracker);
    downloadDataAsFile(asString, 'combat-tracker-export.json');
    setState({
      ...state,
      anchorEl: null
    });
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
    <Grid container spacing={1} justify="flex-end">
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
        <IconButton onClick={handleMenuClick}>
          <MoreVert />
        </IconButton>
        <Menu
          id="combat-tracker-controls-menu"
          open={Boolean(state.anchorEl)}
          anchorEl={state.anchorEl}
          onClose={handleMenuClose}
          keepMounted
        >
          <MenuItem onClick={onRestartClick}>Restart Combat</MenuItem>
          <MenuItem onClick={onClearClick}>Clear Combat</MenuItem>
          <Divider />
          <MenuItem onClick={onImportClick}>Load</MenuItem>
          <MenuItem onClick={onExportClick}>Save</MenuItem>
        </Menu>
      </Grid>

      {/* Add Character Dialog */}
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

      {/* Import Dialog */}
      <Dialog
        open={!!state.importOpen}
        onClose={onImportDialogClose}
        aria-labelledby="import-dialog-title"
      >
        <DialogTitle id="import-dialog-title">Import JSON</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Import Combat Tracker state by selecting a JSON file.{' '}
            <em>Warning: this will overwrite the current Combat Tracker.</em>
          </DialogContentText>

          <input
            type="file"
            onChange={onImportFileChange}
            accept=".json"
            id="import-json-file"
            className={classes.importInput}
          />
          <label htmlFor="import-json-file">
            <Button variant="contained" color="primary" component="span">
              Upload
            </Button>
          </label>
        </DialogContent>
      </Dialog>

      {/* Confirm Dialog */}
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
    </Grid>
  );
}
