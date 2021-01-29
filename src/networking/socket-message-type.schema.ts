import type {SessionUserRole} from '../schemas/session-user.schema';
import type {ActiveScreen} from '../schemas/session.schema';
import type {CombatTrackerSchema} from '../schemas/combat-tracker.schema';
import type {CombatCharacterSchema} from '../schemas/combat-character.schema';

export enum SocketMessageType {
  CreateNewSession,
  NewSessionCreated,

  ConnectToSession,
  SessionConnected,
  SessionConnectionRefused,

  FullState,

  /* Combat Tracker Messages */
  CombatTrackerState,
  CombatTrackerAddCharacter,
  CombatTrackerCharacterAdded,
  CombatTrackerRemoveCharacter,
  CombatTrackerCharacterRemoved,
  CombatTrackerUpdateCharacter,
  CombatTrackerCharacterUpdated
}

export type SocketMessage = {
  type: SocketMessageType.CreateNewSession;
  payload: string;
}
| {
  type: SocketMessageType.NewSessionCreated;
  payload: string;
}
| {
  type: SocketMessageType.ConnectToSession;
  payload: {
    sessionId: string;
    password: string;
    role: SessionUserRole;
  };
}
| {
  type: SocketMessageType.SessionConnected;
  payload: string;
}
| {
  type: SocketMessageType.FullState;
  payload: {
    id: string;
    activeScreen: ActiveScreen;
    combatTracker: CombatTrackerSchema;
  };
}
| {
  type: SocketMessageType.CombatTrackerAddCharacter;
  payload: Omit<CombatCharacterSchema, 'id'>;
}
| {
  type: SocketMessageType.CombatTrackerCharacterAdded;
  payload: CombatCharacterSchema;
}
