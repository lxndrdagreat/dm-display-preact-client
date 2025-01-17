import { Component, h } from 'preact';
import { connect } from 'react-redux';
import { AppRoute } from '@store/slices/app-route.slice';
import { dispatch } from '@store/store';
import HomeRoute from './route-components/HomeRoute';
import AdminRoute from './route-components/admin/AdminRoute';
import type { RootState } from '@store/reducer';
import { SocketClient } from './networking/socket-client';
import { initStorage } from './storage-service';
import DisplayRoute from './route-components/display/DisplayRoute';
import { setSessionId, setSessionPassword } from '@store/slices/session.slice';
import { setUserRole } from '@store/slices/user-role.slice';
import { SocketMessageType } from './networking/socket-message-type.schema';
import { setServerOffline } from '@store/slices/server-offline.slice';
import { createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import blueGrey from '@material-ui/core/colors/blueGrey';
import brown from '@material-ui/core/colors/brown';
import {
  Button,
  CssBaseline,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@material-ui/core';
import { getDarkModePreference } from './utils/detect-dark-mode';

interface AppProps {
  appRoute: AppRoute;
  showSocketDisconnectMessage: boolean;
}

const theme = createMuiTheme({
  palette: {
    type: getDarkModePreference(),
    primary: blueGrey,
    secondary: brown
  }
});

class App extends Component<AppProps> {
  constructor(props?: AppProps) {
    super(props);
  }

  componentDidMount() {
    this.attemptConnection();

    // test server existence
    SocketClient.testServerExists().then((exists) => {
      dispatch(setServerOffline(!exists));
    });
  }

  attemptConnection() {
    const storedSession = initStorage();
    // attempt to reconnect to socket
    if (
      storedSession?.id &&
      storedSession.token &&
      storedSession.userRole !== null
    ) {
      dispatch(setSessionId(storedSession.id));
      dispatch(setSessionPassword(storedSession.password));
      dispatch(setUserRole(storedSession.userRole));
      let wait = Promise.resolve();
      if (!SocketClient.instance.connected) {
        wait = SocketClient.instance.connect();
      }
      wait.then(() => {
        SocketClient.instance.send({
          type: SocketMessageType.ConnectToSession,
          payload: {
            password: storedSession.password,
            sessionId: storedSession.id,
            role: storedSession.userRole
          }
        });
      });
    } else if (window.location.search && window.location.search.length > 1) {
      // check for quick link
      const parts = window.location.search.substr(1).split('&');
      const quickJoinPart = parts.find((part) =>
        part.toLowerCase().startsWith('join=')
      );
      if (quickJoinPart) {
        const [, quickJoin] = quickJoinPart.split('=');
        let wait = Promise.resolve();
        if (!SocketClient.instance.connected) {
          wait = SocketClient.instance.connect();
        }
        wait.then(() => {
          SocketClient.instance.send({
            type: SocketMessageType.ConnectToSession,
            payload: {
              quick: quickJoin
            }
          });
        });
      }
    }
  }

  onAttemptReconnectClick() {
    // this.attemptConnection();
    window.location.reload();
  }

  // Return the App component.
  render() {
    return (
      <div>
        <ThemeProvider theme={theme}>
          <CssBaseline />

          {this.props.appRoute === AppRoute.Home ? (
            <HomeRoute />
          ) : this.props.appRoute === AppRoute.Admin ? (
            <AdminRoute />
          ) : (
            <DisplayRoute />
          )}

          <Dialog open={this.props.showSocketDisconnectMessage}>
            <DialogTitle>Offline</DialogTitle>
            <DialogContent>
              <DialogContentText>
                Connection to the server has been lost. Please check your
                network connection.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                color="primary"
                variant="contained"
                onClick={this.onAttemptReconnectClick.bind(this)}
              >
                Attempt to Reconnect
              </Button>
            </DialogActions>
          </Dialog>
        </ThemeProvider>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): AppProps => {
  return {
    appRoute: state.appRoute,
    showSocketDisconnectMessage:
      state.appRoute !== AppRoute.Home &&
      !state.connection.connected &&
      state.connection.hadSession
  };
};

export default connect(mapStateToProps)(App);
