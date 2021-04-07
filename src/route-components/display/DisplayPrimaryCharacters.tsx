import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
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

function DisplayPrimaryCharacters({ activeCharacter, onDeckCharacter }: Props) {
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

function mapStateToProps(state: RootState): Props {
  if (!state.combatTracker) {
    return {
      activeCharacter: null,
      onDeckCharacter: null
    };
  }
  const characters = state.combatTracker.characters
    .slice()
    .sort((a, b) => b.roll - a.roll);
  const activeIndex = characters.findIndex(
    (ch) => ch.id === state.combatTracker!.activeCharacterId
  );
  if (activeIndex < 0) {
    return {
      activeCharacter: null,
      onDeckCharacter: null
    };
  }
  const nextUpIndex =
    activeIndex + 1 >= characters.length ? 0 : activeIndex + 1;
  return {
    activeCharacter: state.combatTracker.characters[activeIndex],
    onDeckCharacter: state.combatTracker.characters[nextUpIndex]
  };
}

export default connect(mapStateToProps)(DisplayPrimaryCharacters);
