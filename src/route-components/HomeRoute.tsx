import { Fragment, h } from 'preact';
import { connect } from 'react-redux';
import type { RootState } from '@store/reducer';
import JoinOrCreateForm from '../components/JoinOrCreateForm';
import store, { dispatch } from '../store/store';
import { setUserRole } from '@store/slices/user-role.slice';
import type { SessionUserRole } from '../schemas/session-user.schema';
import { SocketClient } from '../networking/socket-client';
import { SocketMessageType } from '../networking/socket-message-type.schema';
import { appVersion } from '../app.globals';
import {
  Button,
  CircularProgress,
  Container,
  CssBaseline,
  Grid,
  Link,
  makeStyles,
  Typography
} from '@material-ui/core';
import { GitHub, Tv } from '@material-ui/icons';

enum HomeRouteState {
  Loading,
  ServerOffline,
  JoinOrCreate
}

interface HomeRouteProps {
  state: HomeRouteState;
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh'
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
    backgroundColor:
      theme.palette.type === 'light'
        ? theme.palette.grey[200]
        : theme.palette.grey[800]
  },
  footerIcon: {
    margin: theme.spacing(0, 1),
    verticalAlign: 'middle'
  }
}));

function HomeRoute(props: HomeRouteProps) {
  const classes = useStyles();

  function connectWithRole(userRole: SessionUserRole) {
    const { session } = store.getState();
    dispatch(setUserRole(userRole));
    SocketClient.instance.send({
      type: SocketMessageType.ConnectToSession,
      payload: {
        role: userRole,
        sessionId: session.id as string,
        password: session.password
      }
    });
  }

  function onRefreshClick() {
    window.location.reload();
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h2" component="h1">
              <Tv fontSize="large" />
              DM Display
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="body1">
              This is an in-development tool to assist tabletop role playing
              groups by allowing dungeon masters track combat initiative order
              and turns, displaying real-time information on a second screen for
              the players.
            </Typography>
          </Grid>

          {props.state === HomeRouteState.JoinOrCreate ? (
            <Fragment>
              <Grid item xs={12}>
                <Typography variant="h4" component="h2">
                  Get started by joining or creating a session
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <JoinOrCreateForm />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h4" component="h2">
                  Terms of Use
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  This site is very much a <strong>work in progress</strong> and
                  could become{' '}
                  <strong>unavailable or cease working at any time</strong>. It
                  is subject to unannounced alterations and feature additions
                  and removals. It also probably has bugs.
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  Currently,{' '}
                  <strong>session data is stored entirely in memory</strong>;
                  when the server goes down for updates (or because of a crash),
                  all sessions are lost. You can <em>prepare</em> for this issue
                  in the combat tracker by{' '}
                  <strong>using the import/export JSON feature.</strong>
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="body2">
                  <strong>The software is provided “as is”</strong>, without
                  warranty of any kind, express or implied, including but not
                  limited to the warranties of merchantability, fitness for a
                  particular purpose and noninfringement. In no event shall the
                  authors or copyright holders be liable for any claim, damages
                  or other liability, whether in an action of contract, tort or
                  otherwise, arising from, out of or in connection with the
                  software or the use or other dealings in the software.
                </Typography>
              </Grid>
            </Fragment>
          ) : props.state === HomeRouteState.Loading ? (
            <Grid item xs={12}>
              <CircularProgress color="primary" />
            </Grid>
          ) : (
            <Grid item xs={12}>
              <Typography variant="body1">
                Client is down because the server is unreachable. Please try
                again later.
              </Typography>
              <Button color="primary" onClick={onRefreshClick}>
                Try Again
              </Button>
            </Grid>
          )}
        </Grid>
      </Container>
      <footer className={classes.footer}>
        <Container>
          <Typography>
            DM Display v.{appVersion}{' '}
            <Link
              className={classes.footerIcon}
              href="https://github.com/lxndrdagreat/dm-display-preact-client"
              target="_blank"
              rel="noreferrer"
              title="view source on github"
            >
              <GitHub fontSize="small" />
            </Link>
          </Typography>
        </Container>
      </footer>
    </div>
  );
}

function mapStateToProps(state: RootState): HomeRouteProps {
  if (state.serverOffline) {
    return {
      state: HomeRouteState.ServerOffline
    };
  } else if (!state.session.id || !state.session.password) {
    return {
      state: HomeRouteState.JoinOrCreate
    };
  }
  return {
    state: HomeRouteState.Loading
  };
}

export default connect(mapStateToProps)(HomeRoute);
