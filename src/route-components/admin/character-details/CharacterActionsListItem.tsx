import { h } from 'preact';
import {
  IconButton,
  ListItem,
  ListItemSecondaryAction,
  ListItemText
} from '@material-ui/core';
import { Edit } from '@material-ui/icons';

interface Props {
  name: string;
  info: string;
  onEditClick: () => void;
}

export default function ({ name, info, onEditClick }: Props) {
  return (
    <ListItem>
      <ListItemText>
        <strong>{name}</strong>&nbsp;{info}
      </ListItemText>
      <ListItemSecondaryAction>
        <IconButton onClick={onEditClick} edge="end">
          <Edit />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
