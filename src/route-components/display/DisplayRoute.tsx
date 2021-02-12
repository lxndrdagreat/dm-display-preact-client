import { h } from 'preact';
import { ActiveScreen } from '../../schemas/session.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import DisplayCombatTracker from './DisplayCombatTracker';

interface Props {
  activeScreen: ActiveScreen;
}

function DisplayRoute({ activeScreen }: Props) {
  return (
    <div className="DisplayRoute">
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
