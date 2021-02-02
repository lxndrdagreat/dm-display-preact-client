import type { SocketMessage } from './socket-message-type.schema';
import { SocketMessageType } from './socket-message-type.schema';
import { SocketClient } from './socket-client';
import { setSessionId, setSessionToken, clearSession } from '../store/slices/session.slice';
import { AppRoute, setRoute } from '../store/slices/app-route.slice';
import store, { dispatch } from '../store/store';
import type { RootState } from '../store/reducer';
import { SessionUserRole } from '../schemas/session-user.schema';
import {
  addCombatCharacter,
  setCombatTracker,
  setCombatTrackerActiveCharacterId,
  updateCombatCharacter,
  setCombatTrackerRound
} from '../store/slices/combat-tracker.slice';

function handleMessage(message: SocketMessage): void {
  const state = store.getState() as RootState;

  switch (message.type) {
    case SocketMessageType.NewSessionCreated:
      const sessionId = message.payload;
      dispatch(setSessionId(sessionId));
      break;
    case SocketMessageType.SessionConnected:
      const token = message.payload;
      dispatch(setSessionToken(token));
      const {userRole} = state;
      if (userRole === SessionUserRole.Display) {
        dispatch(setRoute(AppRoute.Display));
      } else if (userRole === SessionUserRole.Admin) {
        dispatch(setRoute(AppRoute.Admin));
      }
      break;
    case SocketMessageType.FullState:
      const {combatTracker} = message.payload;
      dispatch(setCombatTracker(combatTracker));
      break;
    case SocketMessageType.CombatTrackerCharacterAdded:
      dispatch(addCombatCharacter(message.payload));
      break;
    case SocketMessageType.CombatTrackerCharacterUpdated:
      dispatch(updateCombatCharacter(message.payload));
      break;
    case SocketMessageType.CombatTrackerActiveCharacter:
      dispatch(setCombatTrackerActiveCharacterId(message.payload));
      break;
    case SocketMessageType.CombatTrackerRound:
      dispatch(setCombatTrackerRound(message.payload));
      break;
    case SocketMessageType.SessionConnectionRefused:
      dispatch(clearSession());
      break;
    default:
      console.log('message unhandled', message);
      break;
  }
}

export function bindSocketMessagesToStore() {
  SocketClient.instance.subscribe(handleMessage);
}
