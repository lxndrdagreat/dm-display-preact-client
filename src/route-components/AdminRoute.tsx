import { h } from 'preact';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './AdminRoute.css';
import { ActiveScreen } from '../schemas/session.schema';
import AdminCombatTracker from './admin/AdminCombatTracker';

interface AdminRouteProps {
  activeScreen: ActiveScreen;
}

function AdminRoute({ activeScreen }: AdminRouteProps) {
  return (
    <div className="AdminRoute">
      {activeScreen === ActiveScreen.CombatTracker ? (
        <AdminCombatTracker />
      ) : null}
    </div>
  );
}

function mapStateToProps(state: RootState): AdminRouteProps {
  return {
    activeScreen: ActiveScreen.CombatTracker,
  };
}

export default connect(mapStateToProps)(AdminRoute);
