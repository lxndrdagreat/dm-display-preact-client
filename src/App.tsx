import { Component, h } from 'preact';
import { connect } from 'react-redux';
import './App.css';
import { AppRoute, setRoute } from '@store/slices/app-route.slice';
import { dispatch } from '@store/store';
import HomeRoute from './route-components/HomeRoute';
import AdminRoute from './route-components/AdminRoute';
import type { RootState } from '@store/reducer';
import { SocketClient } from './networking/socket-client';
import { initStorage } from './storage-service';
import DisplayRoute from './route-components/display/DisplayRoute';

interface AppProps {
  appRoute: AppRoute;
}

class App extends Component<AppProps> {
  constructor(props?: AppProps) {
    super(props);
  }

  componentDidMount() {
    SocketClient.instance.connect().then(() => {
      initStorage();
    });
  }

  onClick() {
    dispatch(setRoute(AppRoute.Admin));
  }

  // Return the App component.
  render() {
    return (
      <div className="App">
        {this.props.appRoute === AppRoute.Home ? (
          <HomeRoute />
        ) : this.props.appRoute === AppRoute.Admin ? (
          <AdminRoute />
        ) : (
          <DisplayRoute />
        )}
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
