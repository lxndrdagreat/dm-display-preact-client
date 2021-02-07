import {h, Fragment} from 'preact';
import Icon from '../Icon';
import Button from './Button';

interface Props {
  label?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmOrCancel(props: Props) {
  return (
    <Fragment>
      <Button icon
              title={`Discard ${props.label}`}
              onClick={props.onCancel}>
        <Icon name='cancel' />
      </Button>
      <Button icon
              title={`Save ${props.label}`}
              onClick={props.onConfirm}>
        <Icon name='confirm' />
      </Button>
    </Fragment>
  )
}

export default ConfirmOrCancel;
