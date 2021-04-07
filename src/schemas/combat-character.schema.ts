export interface NPCDetails {
  maxHealth: number;
  health: number;
  armorClass: number;
  url?: string;
  actions: { name: string; info: string }[];
}

export enum CharacterConditions {
  Blinded,
  Charmed,
  Deafened,
  Frightened,
  Grappled,
  Incapacitated,
  Invisible,
  Paralyzed,
  Petrified,
  Poisoned,
  Prone,
  Restrained,
  Stunned,
  Unconscious
}

export const characterConditionLabel: Readonly<{ [index: number]: string }> = {
  [CharacterConditions.Blinded]: 'Blinded',
  [CharacterConditions.Charmed]: 'Charmed',
  [CharacterConditions.Deafened]: 'Deafened',
  [CharacterConditions.Frightened]: 'Frightened',
  [CharacterConditions.Grappled]: 'Grappled',
  [CharacterConditions.Incapacitated]: 'Incapacitated',
  [CharacterConditions.Invisible]: 'Invisible',
  [CharacterConditions.Paralyzed]: 'Paralyzed',
  [CharacterConditions.Petrified]: 'Petrified',
  [CharacterConditions.Poisoned]: 'Poisoned',
  [CharacterConditions.Prone]: 'Prone',
  [CharacterConditions.Restrained]: 'Restrained',
  [CharacterConditions.Stunned]: 'Stunned',
  [CharacterConditions.Unconscious]: 'Unconscious'
};

export interface CombatCharacterSchema {
  id: string;
  displayName: string;
  adminName: string;
  nameVisible: boolean;
  active: boolean;
  roll: number;
  conditions: CharacterConditions[];
  npc: NPCDetails | null;
}
