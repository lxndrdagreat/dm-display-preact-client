import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import { dispatch } from '@store/store';
import { setViewingCharacterDetails } from '@store/slices/character-details.slice';
import Icon from '../../components/Icon';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Tooltip
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { characterConditionLabel } from '../../schemas/combat-character.schema';

interface Props {
  character: CombatCharacterSchema;
  isTurn: boolean;
  isEditing: boolean;
}

const useStyles = makeStyles((theme) => ({
  margin: {
    marginBottom: theme.spacing(1)
  }
}));

function AdminCombatCharacterItem({ character, isTurn, isEditing }: Props) {
  const classes = useStyles();

  function onClick() {
    dispatch(setViewingCharacterDetails(character.id));
  }

  const showHealthMarker =
    character.npc &&
    character.npc.maxHealth > 0 &&
    character.npc.health <= Math.floor(character.npc.maxHealth / 2);

  return (
    <ListItem button selected={isTurn} onClick={onClick}>
      {isEditing ? (
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
      ) : null}
      <ListItemText
        primary={character.displayName}
        secondary={character.adminName}
      />
      <ListItemIcon>
        {showHealthMarker ? (
          <Tooltip title="Health is below 50%">
            <FavoriteIcon />
          </Tooltip>
        ) : null}
        {character.conditions.length ? (
          <Tooltip
            title={character.conditions
              .map((condition) => characterConditionLabel[condition])
              .join(', ')}
          >
            <Icon name="knocked-out" />
          </Tooltip>
        ) : null}
      </ListItemIcon>
    </ListItem>
  );
}

export default AdminCombatCharacterItem;
