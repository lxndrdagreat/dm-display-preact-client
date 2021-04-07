import { h } from 'preact';
import { ActiveScreen } from '../../schemas/session.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import DisplayCombatTracker from './DisplayCombatTracker';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex'
  },
  toolbar: {
    paddingRight: 24 // keep right padding when drawer closed
  },
  toolbarIcon: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: '0 8px',
    ...theme.mixins.toolbar
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  menuButton: {
    marginRight: 36
  },
  menuButtonHidden: {
    display: 'none'
  },
  title: {
    flexGrow: 1
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
  activeScreen: ActiveScreen;
}

function DisplayRoute({ activeScreen }: Props) {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {activeScreen === ActiveScreen.CombatTracker ? (
        <DisplayCombatTracker />
      ) : null}
    </div>
  );
}

function mapStateToProps(state: RootState): Props {
  return {
    activeScreen: ActiveScreen.CombatTracker
  };
}

export default connect(mapStateToProps)(DisplayRoute);
