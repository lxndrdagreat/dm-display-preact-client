import { h, Fragment } from 'preact';
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  makeStyles
} from '@material-ui/core';
import { downloadDataAsFile, readFile } from '../../utils/file-access';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import store from '@store/store';
import { useState } from 'preact/hooks';
import type { RootState } from '@store/reducer';
import type { CombatTrackerSchema } from '../../schemas/combat-tracker.schema';

interface State {
  importOpen: boolean;
  file: File | null;
}

const useStyles = makeStyles((theme) => ({
  importInput: {
    display: 'none'
  }
}));

export default function CombatTrackerImportExportControls() {
  const [state, setState] = useState<State>({
    importOpen: false,
    file: null
  });

  const classes = useStyles();

  function onImportClick() {
    setState({
      file: null,
      importOpen: true
    });
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
        file: null
      });
    } catch (e) {
      console.error(e);
    }
  }

  function onImportDialogClose() {
    setState({
      importOpen: false,
      file: null
    });
  }

  function onExportClick() {
    const { combatTracker } = store.getState() as RootState;
    if (!combatTracker) {
      return;
    }

    const asString = JSON.stringify(combatTracker);
    downloadDataAsFile(asString, 'combat-tracker-export.json');
  }

  return (
    <Fragment>
      <Grid item>
        <Button variant="outlined" onClick={onImportClick}>
          Load
        </Button>
      </Grid>
      <Grid item>
        <Button variant="outlined" onClick={onExportClick}>
          Save
        </Button>
      </Grid>
      <Dialog
        open={state.importOpen}
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
    </Fragment>
  );
}
