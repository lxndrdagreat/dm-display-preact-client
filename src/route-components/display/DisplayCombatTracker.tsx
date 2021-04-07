import { Fragment, h } from 'preact';
import DisplayCombatHeader from './DisplayCombatHeader';
import DisplayInitiativeList from './DisplayInitiativeList';
import DisplayPrimaryCharacters from './DisplayPrimaryCharacters';
import { Container, Grid, makeStyles, Typography } from '@material-ui/core';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  appBarSpacer: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    height: '100vh',
    overflow: 'auto'
  },
  container: {
    paddingTop: theme.spacing(4),
    paddingBottom: theme.spacing(4)
  },
  paper: {
    padding: theme.spacing(2),
    display: 'flex',
    overflow: 'auto',
    flexDirection: 'column'
  },
  fixedHeight: {
    height: 240
  }
}));

interface Props {
  activeCharacter: CombatCharacterSchema | null;
}

function DisplayCombatTracker({ activeCharacter }: Props) {
  const classes = useStyles();

  return (
    <Fragment>
      <DisplayCombatHeader />
      <main className={classes.content}>
        <div className={classes.appBarSpacer} />
        <Container maxWidth="xl" className={classes.container}>
          {!activeCharacter ? (
            <Grid
              container
              alignContent="center"
              alignItems="center"
              justify="space-around"
            >
              <Grid item>
                <Typography variant="h1" component="div">
                  Waiting for combat to start
                </Typography>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={3}>
                <DisplayInitiativeList />
              </Grid>
              <Grid item xs={12} md={9}>
                <DisplayPrimaryCharacters />
              </Grid>
            </Grid>
          )}
        </Container>
      </main>
    </Fragment>
  );
}

// FIXME this logic is duplicated in DisplayPrimaryCharacters
function mapStateToProps(state: RootState): Props {
  if (!state.combatTracker) {
    return {
      activeCharacter: null
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
      activeCharacter: null
    };
  }
  return {
    activeCharacter: state.combatTracker.characters[activeIndex]
  };
}

export default connect(mapStateToProps)(DisplayCombatTracker);
