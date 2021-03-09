import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import './AdminCombatCharacterItem.css';
import classnames from 'classnames';
import { dispatch } from '@store/store';
import { setViewingCharacterDetails } from '@store/slices/character-details.slice';
import Icon from '../../components/Icon';

interface Props {
  character: CombatCharacterSchema;
  isTurn: boolean;
}

function AdminCombatCharacterItem({ character, isTurn }: Props) {
  function onClick() {
    dispatch(setViewingCharacterDetails(character.id));
  }

  return (
    <li
      className={classnames({
        AdminCombatCharacterItem: true,
        'active-turn': isTurn
      })}
      onClick={onClick}
    >
      <div className="roll">{character.roll}</div>
      <div className="name">
        {character.displayName}{' '}
        {character.adminName ? `(${character.adminName})` : ''}
      </div>
      <div class="info">
        {character.conditions.length ? <Icon name="knocked-out" /> : null}
        {character.npc &&
        character.npc.maxHealth > 0 &&
        character.npc.health <= Math.floor(character.npc.maxHealth / 2) ? (
          <Icon name="health" />
        ) : null}
      </div>
    </li>
  );
}

export default AdminCombatCharacterItem;
