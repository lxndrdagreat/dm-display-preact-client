import { h } from 'preact';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import clsx from 'clsx';
import { AppBar, makeStyles, Toolbar, Typography } from '@material-ui/core';

interface Props {
  round: number;
}

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  title: {
    flexGrow: 1
  }
}));

function DisplayCombatHeader({ round }: Props) {
  const classes = useStyles();

  return (
    <AppBar position="absolute" className={clsx(classes.appBar)}>
      <Toolbar className={classes.toolbar}>
        <Typography
          component="h1"
          variant="h4"
          color="inherit"
          noWrap
          className={classes.title}
        >
          Round {round}
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

function mapStateToProps(state: RootState): Props {
  if (!state.combatTracker) {
    return {
      round: 0
    };
  }
  return {
    round: state.combatTracker.round
  };
}

export default connect(mapStateToProps)(DisplayCombatHeader);
