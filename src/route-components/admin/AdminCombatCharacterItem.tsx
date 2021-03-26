import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import { dispatch } from '@store/store';
import { setViewingCharacterDetails } from '@store/slices/character-details.slice';
import Icon from '../../components/Icon';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent, makeStyles,
  Typography
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';

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
  const showInfo = character.conditions.length || showHealthMarker || isEditing;

  return (
    <Card variant={isTurn ? 'outlined' : null} className={classes.margin}>
      <CardActionArea onClick={onClick}>
        <CardContent>
          <Typography gutterBottom>{character.displayName}</Typography>
          {character.adminName ? (
            <Typography variant="body2" color="textSecondary" component="p">
              {character.adminName}
            </Typography>
          ) : null}
        </CardContent>
      </CardActionArea>
      {showInfo ? (
        <CardActions>
          {isEditing ? <EditIcon /> : null}
          {showHealthMarker ? <FavoriteIcon /> : null}
          {character.conditions.length ? <Icon name="knocked-out" /> : null}
        </CardActions>
      ) : null}
    </Card>
  );
}

export default AdminCombatCharacterItem;
