import { h } from 'preact';
import './AdminCombatTracker.css';
import { useState } from 'preact/hooks';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import RoundInfo from './RoundInfo';
import {Button, ButtonGroup, Dialog, DialogContent, DialogTitle, Grid, makeStyles, Paper} from '@material-ui/core';
import clsx from 'clsx';
import AdminCharacterListPanel from './AdminCharacterListPanel';
import CombatTrackerCharacterScreen from './character-details/CombatTrackerCharacterScreen';
import AddCharacterForm from './AddCharacterForm';

interface State {
  addCharacterDialogOpen?: boolean;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column',
  },
  fixedHeight: {
    height: 240
  }
}));

function AdminCombatTracker() {
  const [state, setState] = useState<State>({});

  const classes = useStyles();
  const fixedHeightPaper = clsx(classes.paper, classes.fixedHeight);

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
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
          <RoundInfo/>
        </Grid>
        <Grid item xs={12} md={10}>
          <Grid container spacing={1}>
            <Grid item>
              <Button variant="outlined" color="primary" onClick={onAddCharacterClick}>Add Character</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={onRestartClick}>Restart Combat</Button>
            </Grid>
            <Grid item>
              <Button variant="outlined" color="secondary" onClick={onClearClick}>Clear Combat</Button>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={3}>
          <AdminCharacterListPanel/>
        </Grid>
        <Grid item xs={12} md={9}>
          <CombatTrackerCharacterScreen/>
        </Grid>
      </Grid>

      <Dialog open={!!state.addCharacterDialogOpen} onClose={onAddCharacterDialogBackdropClick} aria-labelledby="add-character-dialog-title">
        <DialogTitle id="add-character-dialog-title">Add Character</DialogTitle>
        <DialogContent>
          <AddCharacterForm/>
        </DialogContent>
      </Dialog>
    </div>

  );
}

export default AdminCombatTracker;
