import {h} from 'preact';
import {
  Button,
  Dialog, DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  ListItem,
  ListItemIcon,
  ListItemText, makeStyles
} from '@material-ui/core';
import {Dashboard, SaveAlt, Publish, OpenInNew} from '@material-ui/icons';
import type {RootState} from '@store/reducer';
import {connect} from 'react-redux';
import {downloadDataAsFile, readFile} from '../../utils/file-access';
import type {CombatCharacterSchema} from '../../schemas/combat-character.schema';
import {SocketClient} from '../../networking/socket-client';
import {SocketMessageType} from '../../networking/socket-message-type.schema';
import store from '@store/store';
import {useState} from 'preact/hooks';

interface Props {
  sessionId: string | null;
}

interface State {
  importOpen: boolean;
  file: File | null;
}

const useStyles = makeStyles((theme) => ({
  importInput: {
    display: 'none'
  }
}));

function AdminDrawer({sessionId}: Props) {

  const classes = useStyles();

  const [state, setState] = useState<State>({
    importOpen: false,
    file: null
  });

  const displayURL = `/?session=${sessionId}`;
  const adminURL = `/?session=${sessionId}&role=admin`;

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
      const parsed = JSON.parse(data) as CombatCharacterSchema;
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
    <div>
      <ListItem button>
        <ListItemIcon>
          <Dashboard/>
        </ListItemIcon>
        <ListItemText primary="Combat"/>
      </ListItem>
      <Divider/>

      <ListItem>
        <ListItemText primary={sessionId}/>
      </ListItem>
      <ListItem button component="a" href={displayURL} target="_blank" dense>
        <ListItemIcon>
          <OpenInNew/>
        </ListItemIcon>
        <ListItemText secondary="Display" />
      </ListItem>
      <ListItem button component="a" href={adminURL} target="_blank" dense>
        <ListItemIcon>
          <OpenInNew/>
        </ListItemIcon>
        <ListItemText secondary="Admin" />
      </ListItem>

      <Divider/>
      <ListItem button onClick={onExportClick}>
        <ListItemIcon>
          <SaveAlt/>
        </ListItemIcon>
        <ListItemText secondary="Save"/>
      </ListItem>
      <ListItem button onClick={onImportClick}>
        <ListItemIcon>
          <Publish/>
        </ListItemIcon>
        <ListItemText secondary="Load"/>
      </ListItem>

      <Dialog open={state.importOpen} onClose={onImportDialogClose} aria-labelledby="import-dialog-title">
        <DialogTitle id="import-dialog-title">Import JSON</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Import Combat Tracker state by selecting a JSON file. <em>Warning: this will overwrite the current Combat Tracker.</em>
          </DialogContentText>

          <input type="file" onChange={onImportFileChange} accept=".json" id="import-json-file" className={classes.importInput}/>
          <label htmlFor="import-json-file">
            <Button variant="contained" color="primary" component="span">
              Upload
            </Button>
          </label>

        </DialogContent>
      </Dialog>

    </div>
  );
}

function mapStateToProps(state: RootState): Props {
  return {
    sessionId: state.session.id
  };
}

export default connect(mapStateToProps)(AdminDrawer);
