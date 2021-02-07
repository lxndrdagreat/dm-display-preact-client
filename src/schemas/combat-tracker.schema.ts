import type { CombatCharacterSchema } from './combat-character.schema';

export interface CombatTrackerSchema {
  characters: CombatCharacterSchema[];
  activeCharacterId: string | null;
  round: number;
}
