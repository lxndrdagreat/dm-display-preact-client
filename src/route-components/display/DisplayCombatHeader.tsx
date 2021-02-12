import { h } from 'preact';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './DisplayCombatHeader.css';

interface Props {
  round: number;
}

function DisplayCombatHeader({ round }: Props) {
  return <div className="DisplayCombatHeader">Round {round}</div>;
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
