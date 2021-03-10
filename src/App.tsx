import { Component, h } from 'preact';
import { connect } from 'react-redux';
import { AppRoute } from '@store/slices/app-route.slice';
import { dispatch } from '@store/store';
import HomeRoute from './route-components/HomeRoute';
import AdminRoute from './route-components/AdminRoute';
import type { RootState } from '@store/reducer';
import { SocketClient } from './networking/socket-client';
import { initStorage } from './storage-service';
import DisplayRoute from './route-components/display/DisplayRoute';
import { setSessionId, setSessionPassword } from '@store/slices/session.slice';
import { setUserRole } from '@store/slices/user-role.slice';
import { SocketMessageType } from './networking/socket-message-type.schema';
import { setServerOffline } from '@store/slices/server-offline.slice';
import ModalWrap from './components/ModalWrap';
import Button from './components/buttons/Button';

interface AppProps {
  appRoute: AppRoute;
  showSocketDisconnectMessage: boolean;
}

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
    }
  }

  onAttemptReconnectClick() {
    // this.attemptConnection();
    window.location.reload();
  }

  // Return the App component.
  render() {
    return (
      <div className="App">
        {this.props.appRoute === AppRoute.Home ? (
          <HomeRoute />
        ) : this.props.appRoute === AppRoute.Admin ? (
          <AdminRoute />
        ) : (
          <DisplayRoute />
        )}

        <ModalWrap active={this.props.showSocketDisconnectMessage}>
          <h3>Offline</h3>
          <p>
            Connection to the server has been lost. Please check your network
            connection.
          </p>
          <p>
            <Button primary onClick={this.onAttemptReconnectClick.bind(this)}>
              Attempt to Reconnect
            </Button>
          </p>
        </ModalWrap>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): AppProps => {
  return {
    appRoute: state.appRoute,
    showSocketDisconnectMessage:
      state.serverOffline && state.appRoute !== AppRoute.Home
  };
};

export default connect(mapStateToProps)(App);
