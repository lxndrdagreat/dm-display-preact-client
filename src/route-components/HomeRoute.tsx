import { h } from 'preact';
import { connect } from 'react-redux';
import type { RootState } from '@store/reducer';
import Button from '../components/buttons/Button';
import JoinOrCreateForm from '../components/JoinOrCreateForm';
import store, { dispatch } from '../store/store';
import { setUserRole } from '@store/slices/user-role.slice';
import { SessionUserRole } from '../schemas/session-user.schema';
import { SocketClient } from '../networking/socket-client';
import { SocketMessageType } from '../networking/socket-message-type.schema';

enum HomeRouteState {
  JoinOrCreate,
  AdminOrDisplay
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

  function onDisplayClick() {
    connectWithRole(SessionUserRole.Display);
  }

  function onAdminClick() {
    connectWithRole(SessionUserRole.Admin);
  }

  return (
    <div className="HomeRoute">
      <h1>Welcome to DM Display!</h1>

      {props.state === HomeRouteState.JoinOrCreate ? (
        <JoinOrCreateForm />
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

function mapStateToProps(state: RootState): HomeRouteProps {
  if (state.session.id && state.session.password) {
    return {
      state: HomeRouteState.AdminOrDisplay
    };
  } else {
    return {
      state: HomeRouteState.JoinOrCreate
    };
  }
}

export default connect(mapStateToProps)(HomeRoute);
