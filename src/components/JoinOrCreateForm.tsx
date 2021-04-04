import { h, RenderableProps } from 'preact';
import { useState } from 'preact/hooks';
import { SocketClient } from '../networking/socket-client';
import { SocketMessageType } from '../networking/socket-message-type.schema';
import { dispatch } from '@store/store';
import { setSessionId, setSessionPassword } from '@store/slices/session.slice';
import { setUserRole } from '@store/slices/user-role.slice';
import { SessionUserRole } from '../schemas/session-user.schema';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Grid,
  Paper,
  PropTypes,
  Tab,
  Tabs,
  TextField,
  Typography
} from '@material-ui/core';

interface State {
  active: 'join' | 'create';
  role: 'display' | 'admin';
  sessionId: string;
  password: string;
  errors: {
    session: boolean;
    password: boolean;
  };
}

interface TabPanelProps {
  index: number;
  value: number;
}

function TabPanel(props: RenderableProps<TabPanelProps>) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tabpanel-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
}

function initState(): State {
  let sessionId = '';
  let role: 'display' | 'admin' = 'display';

  // check if session key is in query string
  if (window.location.search && window.location.search.length > 1) {
    const parts = window.location.search.substr(1).split('&');
    const sessionPart = parts.find((part) =>
      part.toLowerCase().startsWith('session=')
    );
    if (sessionPart) {
      const [, key] = sessionPart.split('=');
      sessionId = key;
    }
    // check if user role
    const rolePart = parts.find((part) =>
      part.toLowerCase().startsWith('role=')
    );
    if (rolePart) {
      const [, roleValue] = rolePart.split('=');
      if (roleValue.toLowerCase() === 'admin') {
        role = 'admin';
      }
    }
  }

  return {
    active: 'join',
    role,
    password: '',
    sessionId,
    errors: {
      session: false,
      password: false
    }
  };
}

function JoinOrCreateForm() {
  const [state, setState] = useState<State>(initState());

  function onSessionIdInput(event: InputEvent) {
    const { value } = event.target as HTMLInputElement;
    setState({
      ...state,
      sessionId: value
    });
  }

  function onPasswordInput(event: InputEvent) {
    const { value } = event.target as HTMLInputElement;
    setState({
      ...state,
      password: value
    });
  }

  function handleJoinAsDisplayClick() {
    setState({
      ...state,
      role: 'display'
    });
    attemptConnect();
  }

  function handleJoinAsAdminClick() {
    setState({
      ...state,
      role: 'admin'
    });
    attemptConnect();
  }

  function handleCreateClick() {
    attemptConnect();
  }

  async function attemptConnect() {
    // verify fields
    if (state.active === 'join' && (!state.password || !state.sessionId)) {
      setState({
        ...state,
        errors: {
          session: !state.sessionId,
          password: !state.password
        }
      });
      return;
    } else if (state.active === 'create' && !state.password) {
      setState({
        ...state,
        errors: {
          password: true,
          session: false
        }
      });
      return;
    }

    // wait for socket connection
    if (!SocketClient.instance.connected) {
      await SocketClient.instance.connect();
    }

    if (state.active === 'join') {
      const role =
        state.role === 'admin'
          ? SessionUserRole.Admin
          : SessionUserRole.Display;
      if (state.sessionId.length && state.password.length) {
        dispatch(setSessionPassword(state.password));
        dispatch(setSessionId(state.sessionId));
        dispatch(setUserRole(role));
        SocketClient.instance.send({
          type: SocketMessageType.ConnectToSession,
          payload: {
            role: role,
            sessionId: state.sessionId,
            password: state.password
          }
        });
      }
    } else {
      if (state.password.length) {
        dispatch(setSessionPassword(state.password));
        dispatch(setUserRole(SessionUserRole.Admin));
        SocketClient.instance
          .send({
            type: SocketMessageType.CreateNewSession,
            payload: state.password
          })
          .nextOfType(SocketMessageType.NewSessionCreated, (message) => {
            const sessionId = message.payload as string;
            SocketClient.instance.send({
              type: SocketMessageType.ConnectToSession,
              payload: {
                role: SessionUserRole.Admin,
                sessionId: sessionId,
                password: state.password
              }
            });
          });
      }
    }
  }

  function handleTabChange(event: MouseEvent, newValue: number) {
    setState({
      ...state,
      active: newValue === 1 ? 'create' : 'join',
      sessionId: '',
      password: '',
      errors: {
        password: false,
        session: false
      }
    });
  }

  const activeTab = state.active === 'create' ? 1 : 0;

  return (
    <Paper>
      <AppBar position="static">
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          aria-label="Join or create"
        >
          <Tab label="Join" />
          <Tab label="Create" />
        </Tabs>
      </AppBar>

      <TabPanel value={activeTab} index={0}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              Join an existing session by entering the Session Id and password.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="join-session-id"
              label="Session Id"
              value={state.sessionId}
              onChange={onSessionIdInput}
              error={state.errors.session}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="join-session-password"
              label="Session Password"
              value={state.password}
              onChange={onPasswordInput}
              error={state.errors.password}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <ButtonGroup color="primary" variant="contained">
              <Button onClick={handleJoinAsDisplayClick}>
                Join as Display
              </Button>
              <Button onClick={handleJoinAsAdminClick}>Join as Admin</Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </TabPanel>
      <TabPanel index={1} value={activeTab}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="body1">
              Start a new session by providing a password. Don't forget the
              password - you'll need to share it with others in order for them
              to join the session.
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <TextField
              id="create-session-password"
              label="Session Password"
              value={state.password}
              onChange={onPasswordInput}
              fullWidth
              error={state.errors.password}
            />
          </Grid>
          <Grid item xs={12}>
            <Button
              onClick={handleCreateClick}
              color="primary"
              variant="contained"
            >
              Create
            </Button>
          </Grid>
        </Grid>
      </TabPanel>
    </Paper>
  );
}

export default JoinOrCreateForm;
