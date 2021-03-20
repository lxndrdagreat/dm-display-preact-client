import type {
  ServerCommandFullState,
  SocketMessage
} from './socket-message-type.schema';
import {
  SocketCloseStatusCode,
  SocketMessageType
} from './socket-message-type.schema';
import { SocketClient } from './socket-client';
import {
  clearSession,
  setSessionId,
  setSessionToken
} from '@store/slices/session.slice';
import { AppRoute, setRoute } from '@store/slices/app-route.slice';
import store, { dispatch } from '../store/store';
import type { RootState } from '@store/reducer';
import { SessionUserRole } from '../schemas/session-user.schema';
import {
  addCombatCharacter,
  removeCombatCharacter,
  setCombatTracker,
  setCombatTrackerActiveCharacterId,
  setCombatTrackerRound,
  updateCombatCharacter
} from '@store/slices/combat-tracker.slice';
import { setConnected, setHadSession } from '@store/slices/connection.slice';
import { whenDocumentBecomesVisible } from '../utils/document-hidden-check';

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
      const { userRole } = state;
      if (userRole === SessionUserRole.Display) {
        dispatch(setRoute(AppRoute.Display));
      } else if (userRole === SessionUserRole.Admin) {
        dispatch(setRoute(AppRoute.Admin));
      }
      dispatch(setHadSession(true));
      break;
    case SocketMessageType.FullState:
      const { combatTracker } = (message as ServerCommandFullState).payload;
      dispatch(setCombatTracker(combatTracker));
      break;
    case SocketMessageType.CombatTrackerState:
      dispatch(setCombatTracker(message.payload));
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
    case SocketMessageType.CombatTrackerCharacterRemoved:
      dispatch(removeCombatCharacter(message.payload));
      break;
    case SocketMessageType.SessionConnectionRefused:
      dispatch(clearSession());
      break;
    case SocketMessageType.Heartbeat:
      // don't actually need to do anything
      break;
    default:
      console.log('message unhandled', message);
      break;
  }
}

export function bindSocketMessagesToStore() {
  SocketClient.instance.subscribe(handleMessage);

  SocketClient.instance.onClose(async (event) => {
    dispatch(setConnected(false));

    if (
      !event.wasClean &&
      event.code !== SocketCloseStatusCode.SessionNotFound &&
      event.code !== SocketCloseStatusCode.InvalidRolePermissions
    ) {
      // confirm tab hasn't lost focus
      await whenDocumentBecomesVisible();
      // attempt reconnect
      const { session, connection } = store.getState() as RootState;
      if (connection.hadSession && session.token) {
        await SocketClient.instance.connect();
        SocketClient.instance.send({
          type: SocketMessageType.Reconnect,
          payload: session.token
        });
      }
    } else if (
      event.code === SocketCloseStatusCode.SessionNotFound ||
      event.code === SocketCloseStatusCode.InvalidRolePermissions
    ) {
      dispatch(clearSession());
      dispatch(setHadSession(false));
    }
  });

  SocketClient.instance.onOpen(() => {
    dispatch(setConnected(true));
  });
}
