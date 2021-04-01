import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import { characterConditionLabel } from '../../schemas/combat-character.schema';
import { dispatch } from '@store/store';
import { setViewingCharacterDetails } from '@store/slices/character-details.slice';
import Icon from '../../components/Icon';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Tooltip
} from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import FavoriteIcon from '@material-ui/icons/Favorite';
import { useState } from 'preact/hooks';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';
import { Block } from '@material-ui/icons';

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

  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  function onClick() {
    dispatch(setViewingCharacterDetails(character.id));
  }

  function onContextClick(event: MouseEvent) {
    event.preventDefault();
    setAnchorEl(event.currentTarget as Element);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  function onActivateClick() {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        active: true
      }
    });
    handleClose();
  }

  function onDeactivateClick() {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        active: false
      }
    });
    handleClose();
  }

  function onDuplicateClick() {
    handleClose();
  }

  function onDeleteClick() {
    handleClose();
  }

  const showHealthMarker =
    character.npc &&
    character.npc.maxHealth > 0 &&
    character.npc.health <= Math.floor(character.npc.maxHealth / 2);

  return (
    <ListItem
      button
      selected={isTurn}
      onClick={onClick}
      onContextMenu={onContextClick}
    >
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
        {!character.active ? <Block /> : null}
      </ListItemIcon>
      <Menu
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        keepMounted
        onClose={handleClose}
      >
        {character.active ? (
          <MenuItem onClick={onDeactivateClick}>Deactivate</MenuItem>
        ) : (
          <MenuItem onClick={onActivateClick}>Activate</MenuItem>
        )}
        <MenuItem onClick={onDuplicateClick}>Duplicate</MenuItem>
        <MenuItem onClick={onDeleteClick}>Delete</MenuItem>
      </Menu>
    </ListItem>
  );
}

export default AdminCombatCharacterItem;
