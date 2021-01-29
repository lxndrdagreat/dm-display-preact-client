import {h} from 'preact';
import type {CombatCharacterSchema} from '../../schemas/combat-character.schema';
import './AdminCombatCharacterItem.css';
import classnames from 'classnames';

interface Props {
  character: CombatCharacterSchema;
  isTurn: boolean;
}

function AdminCombatCharacterItem({character, isTurn}: Props) {
  return (
    <li className={
      classnames({
        'AdminCombatCharacterItem': true,
        'active-turn': isTurn
      })
    }>
      <div className="roll">{character.roll}</div>
      <div className="name">{ character.displayName } { character.adminName ? `(${character.adminName})` : '' }</div>
    </li>
  );
}

export default AdminCombatCharacterItem;
