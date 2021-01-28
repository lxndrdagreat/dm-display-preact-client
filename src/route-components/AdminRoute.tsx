import { h } from 'preact';
import type { RootState } from '../store/reducer';
import { connect } from 'react-redux';
import './AdminRoute.css';

enum AdminRouteView {
  CreateOrJoin,
  Session
}

interface AdminRouteProps {
  view: AdminRouteView
}

function AdminRoute(props: AdminRouteProps) {

  return (
    <div className='AdminRoute'>
      {
        props.view === AdminRouteView.CreateOrJoin
          ? (
            <h1>Admin</h1>
          ) : null
      }
    </div>
  );
}

function mapStateToProps(state: RootState): AdminRouteProps {
  return {
    view: AdminRouteView.CreateOrJoin,
  };
}

export default connect(mapStateToProps)(AdminRoute);
