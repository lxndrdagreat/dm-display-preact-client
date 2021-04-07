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
import CombatTrackerImportExportControls from './CombatTrackerImportExportControls';

interface State {
  addCharacterDialogOpen?: boolean;
  confirm?: 'restart' | 'clear';
}

function AdminCombatTracker() {
  const [state, setState] = useState<State>({});

  return (
    <div>
      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
          <RoundInfo />
        </Grid>
        <Grid item xs={12} md={10}>
          <CombatTrackerImportExportControls />
        </Grid>
        <Grid item xs={12} md={3}>
          <AdminCharacterListPanel />
        </Grid>
        <Grid item xs={12} md={9}>
          <CombatTrackerCharacterScreen />
        </Grid>
      </Grid>
    </div>
  );
}

export default AdminCombatTracker;
