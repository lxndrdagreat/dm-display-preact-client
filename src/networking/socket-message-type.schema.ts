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
  CombatTrackerCharacterUpdated,
  CombatTrackerNextTurn,
  CombatTrackerPreviousTurn,
  CombatTrackerActiveCharacter,
  CombatTrackerRound
}

export enum SessionConnectionRefusedReason {
  SessionNotFound,
  InvalidPermissions
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
  payload: Omit<CombatCharacterSchema, 'id' | 'conditions'>;
}
| {
  type: SocketMessageType.CombatTrackerCharacterAdded;
  payload: CombatCharacterSchema;
}
| {
  type: SocketMessageType.CombatTrackerUpdateCharacter;
  payload: Partial<CombatCharacterSchema>;
}
| {
  type: SocketMessageType.CombatTrackerCharacterUpdated;
  payload: CombatCharacterSchema;
}
| {
  type: SocketMessageType.CombatTrackerRemoveCharacter;
  payload: string;
}
| {
  type: SocketMessageType.CombatTrackerNextTurn;
  // FIXME: this is dumb
  payload: '';
}
| {
  type: SocketMessageType.CombatTrackerActiveCharacter;
  payload: string;
}
| {
  type: SocketMessageType.CombatTrackerRound;
  payload: number;
}
| {
  type: SocketMessageType.SessionConnectionRefused;
  payload: SessionConnectionRefusedReason;
};
