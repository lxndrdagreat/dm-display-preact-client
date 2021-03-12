import { h } from 'preact';
import { connect } from 'react-redux';
import type { RootState } from '@store/reducer';
import JoinOrCreateForm from '../components/JoinOrCreateForm';
import store, { dispatch } from '../store/store';
import { setUserRole } from '@store/slices/user-role.slice';
import type { SessionUserRole } from '../schemas/session-user.schema';
import { SocketClient } from '../networking/socket-client';
import { SocketMessageType } from '../networking/socket-message-type.schema';
import './HomeRoute.css';
import { appVersion } from '../app.globals';
import Button from '../components/buttons/Button';

enum HomeRouteState {
  Loading,
  ServerOffline,
  JoinOrCreate
}

interface HomeRouteProps {
  state: HomeRouteState;
}

function HomeRoute(props: HomeRouteProps) {
  function connectWithRole(userRole: SessionUserRole) {
    const { session } = store.getState();
    dispatch(setUserRole(userRole));
    SocketClient.instance.send({
      type: SocketMessageType.ConnectToSession,
      payload: {
        role: userRole,
        sessionId: session.id as string,
        password: session.password
      }
    });
  }

  function onRefreshClick() {
    window.location.reload();
  }

  return (
    <div className="HomeRoute">
      <h1>Welcome to DM Display!</h1>

      <p>
        This is an in-development tool to assist tabletop role playing groups by
        allowing dungeon masters track combat initiative order and turns,
        displaying real-time information on a second screen for the players.
      </p>

      {props.state === HomeRouteState.JoinOrCreate ? (
        <div>
          <h2>Get started by joining or creating a session</h2>

          <JoinOrCreateForm />

          <div className="terms">
            <h3>Terms of Use</h3>
            <p>
              This site is very much a <strong>work in progress</strong> and
              could become{' '}
              <strong>unavailable or cease working at any time</strong>. It is
              subject to unannounced alterations and feature additions and
              removals. It also probably has bugs.
            </p>
            <p>
              Currently,{' '}
              <strong>session data is stored entirely in memory</strong>; when
              the server goes down for updates (or because of a crash), all
              sessions are lost. You can <em>prepare</em> for this issue in the
              combat tracker by{' '}
              <strong>using the import/export JSON feature.</strong>
            </p>
            <p>
              <strong>The software is provided “as is”</strong>, without
              warranty of any kind, express or implied, including but not
              limited to the warranties of merchantability, fitness for a
              particular purpose and noninfringement. In no event shall the
              authors or copyright holders be liable for any claim, damages or
              other liability, whether in an action of contract, tort or
              otherwise, arising from, out of or in connection with the software
              or the use or other dealings in the software.
            </p>
          </div>
        </div>
      ) : props.state === HomeRouteState.Loading ? (
        <div>Loading...</div>
      ) : (
        <div>
          <p>
            Client is down because the server is unreachable. Please try again
            later.
          </p>
          <p>
            <Button primary onClick={onRefreshClick}>
              Try again
            </Button>
          </p>
        </div>
      )}

      <footer>
        DM Display v.{appVersion}{' '}
        <a
          href="https://github.com/lxndrdagreat/dm-display-preact-client"
          target="_blank"
        >
          Github
        </a>
      </footer>
    </div>
  );
}

function mapStateToProps(state: RootState): HomeRouteProps {
  if (state.serverOffline) {
    return {
      state: HomeRouteState.ServerOffline
    };
  } else if (!state.session.id || !state.session.password) {
    return {
      state: HomeRouteState.JoinOrCreate
    };
  }
  return {
    state: HomeRouteState.Loading
  };
}

export default connect(mapStateToProps)(HomeRoute);
