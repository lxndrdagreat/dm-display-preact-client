import {h} from 'preact';
import Text from './forms/Text';
import Button from './buttons/Button';
import './JoinOrCreateForm.css';
import {useState} from 'preact/hooks';
import {SocketClient} from '../networking/socket-client';
import {SocketMessageType} from '../networking/socket-message-type.schema';
import {dispatch} from '../store/store';
import {setSessionId, setSessionPassword} from '../store/slices/session.slice';
import {setUserRole} from '../store/slices/user-role.slice';
import {SessionUserRole} from '../schemas/session-user.schema';

interface State {
  active: 'join' | 'create';
  role: 'display' | 'admin';
  sessionId: string;
  password: string;
}

function JoinOrCreateForm() {

  const [state, setState] = useState<State>({
    active: 'join',
    role: 'display',
    password: '',
    sessionId: ''
  });

  function onSessionIdInput(e: Event) {
    setState({
      ...state,
      sessionId: (e.target as HTMLInputElement).value
    });
  }

  function onPasswordInput(e: Event) {
    setState({
      ...state,
      password: (e.target as HTMLInputElement).value
    });
  }

  function onClick() {
    const role = state.role === 'admin' ? SessionUserRole.Admin : SessionUserRole.Display;
    if (state.active === 'join') {
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
        dispatch(setUserRole(role));
        SocketClient.instance.send({
          type: SocketMessageType.CreateNewSession,
          payload: state.password
        })
          .nextOfType(SocketMessageType.NewSessionCreated, (message) => {
            const sessionId = message.payload as string;
            SocketClient.instance.send({
              type: SocketMessageType.ConnectToSession,
              payload: {
                role: role,
                sessionId: sessionId,
                password: state.password
              }
            });
          });
      }
    }
  }

  function onTabChange(event: Event) {
    setState({
      ...state,
      active: (event.target as HTMLInputElement).value as 'join' | 'create'
    });
  }

  function onRoleChange(event: Event) {
    setState({
      ...state,
      role: (event.target as HTMLInputElement).value as 'display' | 'admin'
    });
  }

  return (
    <div class='JoinOrCreateForm'>
      <div className="controls">
        <input type="radio"
               id="join-or-create-tab-join"
               value="join"
               name="join-or-create-tab"
               onChange={onTabChange}
               checked={state.active === 'join'}
        />
        <label for="join-or-create-tab-join">Join</label>

        <input type="radio"
               id="join-or-create-tab-create"
               value="create"
               name="join-or-create-tab"
               onChange={onTabChange}
               checked={state.active === 'create'}
        />
        <label htmlFor="join-or-create-tab-create">Create</label>

      </div>

      <div class='form-body'>

        {
          state.active === 'join'
            ? (
              <Text
                id="join-session-id"
                label="Session Id"
                value={state.sessionId}
                onChange={onSessionIdInput}
              />
            ) : null
        }

        <Text
          id="join-session-password"
          label="Session Password"
          value={state.password}
          onChange={onPasswordInput}
        />

        <div className="toggle-role">
          <div className="toggle-item">
            <input type="radio"
                   id="join-or-create-role-display"
                   value="display"
                   name="join-or-create-role"
                   onChange={onRoleChange}
                   checked={state.role === 'display'}
            />
            <label htmlFor="join-or-create-role-display">Display</label>
          </div>


          <div className="toggle-item">
            <input type="radio"
                   id="join-or-create-role-admin"
                   value="admin"
                   name="join-or-create-role"
                   onChange={onRoleChange}
                   checked={state.role === 'admin'}
            />
            <label htmlFor="join-or-create-role-admin">Admin</label>
          </div>

        </div>

        <Button onClick={onClick}>
          {state.active === 'join' ? 'Join' : 'Create'}
        </Button>

      </div>

    </div>
  );
}

export default JoinOrCreateForm;
