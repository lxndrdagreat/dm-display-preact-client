import { h, Fragment } from 'preact';
import { Grid, IconButton } from '@material-ui/core';
import { Cancel, CheckCircle } from '@material-ui/icons';

interface Props {
  label?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmOrCancel(props: Props) {
  return (
    <Grid container>
      <Grid item sm={6}>
        <IconButton onClick={props.onCancel}>
          <Cancel />
        </IconButton>
      </Grid>
      <Grid item sm={6}>
        <IconButton onClick={props.onConfirm}>
          <CheckCircle />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default ConfirmOrCancel;
