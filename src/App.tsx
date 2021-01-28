import { Component, h } from 'preact';
import { connect } from 'react-redux';
import './App.css';
import { AppRoute, setRoute } from './store/slices/app-route.slice';
import { dispatch } from './store/store';
import HomeRoute from './route-components/HomeRoute';
import AdminRoute from './route-components/AdminRoute';
import type { RootState } from './store/reducer';
import { SocketClient } from './networking/socket-client';

interface AppProps {
  appRoute: AppRoute;
}

class App extends Component<AppProps> {

  private unsubscribe: (() => void) | null = null;

  constructor(props?: AppProps) {
    super(props);
  }

  componentDidMount() {
    SocketClient.instance.connect();
  }

  onClick() {
    dispatch(setRoute(AppRoute.Admin));
  }

  // Return the App component.
  render() {
    return (
      <div className="App">
        {
          this.props.appRoute === AppRoute.Home
          ? (
            <HomeRoute/>
            ) : this.props.appRoute === AppRoute.Admin
          ? (
            <AdminRoute/>
            ) : null
        }
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): AppProps => {
  return {
    appRoute: state.appRoute
  };
};

export default connect(mapStateToProps)(App);
