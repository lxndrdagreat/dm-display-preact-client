import type { SessionInfo } from './store/slices/session.slice';
import type { SessionUserRole } from './schemas/session-user.schema';
import store, { dispatch } from './store/store';
import type { RootState } from './store/reducer';
import { SocketClient } from './networking/socket-client';
import { SocketMessageType } from './networking/socket-message-type.schema';
import { setSessionId, setSessionPassword } from './store/slices/session.slice';
import { setUserRole } from './store/slices/user-role.slice';

interface StoreInfo extends SessionInfo {
  userRole: SessionUserRole | null;
}

function saveSession(info: StoreInfo): void {
  if (!window.sessionStorage) {
    return;
  }

  sessionStorage.setItem('admin_session', JSON.stringify(info));
}

function loadSession(): StoreInfo | null {
  if (!window.sessionStorage) {
    return null;
  }

  const data = sessionStorage.getItem('admin_session');
  if (!data) {
    return null;
  }
  return JSON.parse(data);
}

export function initStorage(): void {
  const existing = loadSession();

  if (existing) {
    // attempt to connect to socket
    if (existing.id && existing.token && existing.userRole) {
      dispatch(setSessionId(existing.id));
      dispatch(setSessionPassword(existing.password));
      dispatch(setUserRole(existing.userRole));
      SocketClient.instance.send({
        type: SocketMessageType.ConnectToSession,
        payload: {
          password: existing.password,
          sessionId: existing.id,
          role: existing.userRole
        }
      });
    }
  }

  store.subscribe(() => {
    const state = store.getState() as RootState;
    const info = {
      ...state.session,
      userRole: state.userRole
    };
    saveSession(info);
  });
}
