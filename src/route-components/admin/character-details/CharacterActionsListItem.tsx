import { h } from 'preact';
import './CharacterActionsListItem.css';
import Button from '../../../components/buttons/Button';
import Icon from '../../../components/Icon';

interface Props {
  name: string;
  info: string;
  onEditClick: () => void;
}

export default function ({ name, info, onEditClick }: Props) {
  return (
    <li className="CharacterActionsListItem">
      <div className="info">
        <strong>{name}</strong>&nbsp;{info}
      </div>
      <div className="edit">
        <Button icon onClick={onEditClick}>
          <Icon name="pencil" />
        </Button>
      </div>
    </li>
  );
}
