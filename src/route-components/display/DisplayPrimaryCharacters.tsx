import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import { Grid, makeStyles, Paper, Typography } from '@material-ui/core';

interface Props {
  activeCharacter: CombatCharacterSchema | null;
  onDeckCharacter: CombatCharacterSchema | null;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2)
  }
}));

export default function DisplayPrimaryCharacters({
  activeCharacter,
  onDeckCharacter
}: Props) {
  const classes = useStyles();

  if (!activeCharacter) {
    return (
      <Grid container alignContent="center" alignItems="center">
        <Grid item>
          <Typography variant="h1" component="div">
            Waiting for combat to start
          </Typography>
        </Grid>
      </Grid>
    );
  }

  return (
    <Grid container spacing={3} direction="column">
      <Grid item>
        <Paper className={classes.paper}>
          <Typography variant="subtitle1">Current Turn</Typography>
          <Typography variant="h2" component="div">
            {activeCharacter.displayName}
          </Typography>
        </Paper>
      </Grid>

      {onDeckCharacter ? (
        <Grid item>
          <Paper className={classes.paper}>
            <Typography variant="subtitle2">Up Next</Typography>
            <Typography variant="h3" component="div">
              {onDeckCharacter.displayName}
            </Typography>
          </Paper>
        </Grid>
      ) : null}
    </Grid>
  );
}
