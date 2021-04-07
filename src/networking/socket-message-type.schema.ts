import type { SessionUserRole } from '../schemas/session-user.schema';
import type { ActiveScreen } from '../schemas/session.schema';
import type { CombatTrackerSchema } from '../schemas/combat-tracker.schema';
import type {
  CombatCharacterSchema,
  NPCDetails
} from '../schemas/combat-character.schema';

export enum SocketMessageType {
  CreateNewSession,
  NewSessionCreated,

  ConnectToSession,
  SessionConnected,
  SessionConnectionRefused,
  Reconnect,

  Heartbeat,

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
  CombatTrackerRound,
  CombatTrackerRequestRestart,
  CombatTrackerRequestClear,
  CombatTrackerUpdateCharacterNPC
}

export enum SessionConnectionRefusedReason {
  SessionNotFound,
  InvalidPermissions
}

// https://developer.mozilla.org/en-US/docs/Web/API/CloseEvent#status_codes
// 4000-4999 are reserved for application use
export enum SocketCloseStatusCode {
  SessionNotFound = 4000,
  InvalidRolePermissions = 4001
}

export interface SocketMessage {
  type: SocketMessageType;
  payload?: unknown;
}

export interface ServerCommandNewSessionCreated extends SocketMessage {
  type: SocketMessageType.NewSessionCreated;
  payload: string;
}

export interface ClientConnectToSession extends SocketMessage {
  type: SocketMessageType.ConnectToSession;
  payload: {
    sessionId: string;
    password: string;
    role: SessionUserRole;
  };
}

export interface ClientConnectToSessionWithQuickJoin extends SocketMessage {
  type: SocketMessageType.ConnectToSession;
  payload: {
    quick: string;
  };
}

export interface ServerCommandSessionConnected extends SocketMessage {
  type: SocketMessageType.SessionConnected;
  payload: {
    token: string;
    role: SessionUserRole;
    session: string;
  };
}

export interface ServerCommandFullState extends SocketMessage {
  type: SocketMessageType.FullState;
  payload: {
    id: string;
    activeScreen: ActiveScreen;
    combatTracker: CombatTrackerSchema;
    quickJoin: {
      admin: string;
      display: string;
    };
  };
}

export interface ClientAddCharacter extends SocketMessage {
  type: SocketMessageType.CombatTrackerAddCharacter;
  payload: Omit<CombatCharacterSchema, 'id' | 'conditions'>;
}

export interface ServerCommandCharacterAdded extends SocketMessage {
  type: SocketMessageType.CombatTrackerCharacterAdded;
  payload: CombatCharacterSchema;
}

export interface ClientUpdateCharacter extends SocketMessage {
  type: SocketMessageType.CombatTrackerUpdateCharacter;
  payload: Partial<CombatCharacterSchema>;
}

export interface ServerCommandCharacterUpdated extends SocketMessage {
  type: SocketMessageType.CombatTrackerCharacterUpdated;
  payload: CombatCharacterSchema;
}

export interface ClientRemoveCharacter extends SocketMessage {
  type: SocketMessageType.CombatTrackerRemoveCharacter;
  payload: string;
}

export interface ServerCommandCharacterRemoved extends SocketMessage {
  type: SocketMessageType.CombatTrackerCharacterRemoved;
  payload: string;
}

export interface ClientNextTurn extends SocketMessage {
  type: SocketMessageType.CombatTrackerNextTurn;
}

export interface ServerCommandActiveCharacter extends SocketMessage {
  type: SocketMessageType.CombatTrackerActiveCharacter;
  payload: string;
}

export interface ServerCommandCombatRound extends SocketMessage {
  type: SocketMessageType.CombatTrackerRound;
  payload: number;
}

export interface ServerCommandConnectionRefused extends SocketMessage {
  type: SocketMessageType.SessionConnectionRefused;
  payload: SessionConnectionRefusedReason;
}

export interface ClientClearCombat extends SocketMessage {
  type: SocketMessageType.CombatTrackerRequestClear;
}

export interface ClientRestartCombat extends SocketMessage {
  type: SocketMessageType.CombatTrackerRequestRestart;
}

export interface ClientUpdateCharacterNPC extends SocketMessage {
  type: SocketMessageType.CombatTrackerUpdateCharacterNPC;
  payload: {
    id: string;
    npc: Partial<NPCDetails>;
  };
}

export interface CombatTrackerState extends SocketMessage {
  type: SocketMessageType.CombatTrackerState;
  payload: CombatTrackerSchema;
}

export interface Reconnect extends SocketMessage {
  type: SocketMessageType.Reconnect;
  payload: string;
}
