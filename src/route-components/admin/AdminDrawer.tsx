import { h } from 'preact';
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  Switch
} from '@material-ui/core';
import { Dashboard, SaveAlt, Publish, OpenInNew } from '@material-ui/icons';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import {
  getDarkModePreference,
  setDarkModePreference
} from '../../utils/detect-dark-mode';

interface Props {
  sessionId: string | null;
  quickJoinAdmin: string;
  quickJoinDisplay: string;
}

function AdminDrawer({ sessionId, quickJoinAdmin, quickJoinDisplay }: Props) {
  const colorScheme = getDarkModePreference();

  const displayURL = `/?join=${quickJoinDisplay}`;
  const adminURL = `/?join=${quickJoinAdmin}`;

  function onDarkModeChange() {
    setDarkModePreference(colorScheme === 'light' ? 'dark' : 'light');
    // TODO: accomplish this without refresh
    window.location.reload();
  }

  return (
    <List>
      <ListItem button>
        <ListItemIcon>
          <Dashboard />
        </ListItemIcon>
        <ListItemText primary="Combat" />
      </ListItem>
      <Divider />

      <ListItem>
        <ListItemText primary={sessionId} />
      </ListItem>
      <ListItem button component="a" href={displayURL} target="_blank" dense>
        <ListItemIcon>
          <OpenInNew />
        </ListItemIcon>
        <ListItemText secondary="Display" />
      </ListItem>
      <ListItem button component="a" href={adminURL} target="_blank" dense>
        <ListItemIcon>
          <OpenInNew />
        </ListItemIcon>
        <ListItemText secondary="Admin" />
      </ListItem>

      <Divider />

      <ListItem>
        <ListItemIcon />
        <ListItemText id="dark-mode-switch" secondary="Dark Mode" />
        <ListItemSecondaryAction>
          <Switch
            name="Dark Mode"
            checked={colorScheme === 'dark'}
            onChange={onDarkModeChange}
            edge="end"
            inputProps={{ 'aria-labelledby': 'dark-mode-switch' }}
          />
        </ListItemSecondaryAction>
      </ListItem>
    </List>
  );
}

function mapStateToProps(state: RootState): Props {
  return {
    sessionId: state.session.id,
    quickJoinDisplay: state.session.quickJoin.display,
    quickJoinAdmin: state.session.quickJoin.admin
  };
}

export default connect(mapStateToProps)(AdminDrawer);
