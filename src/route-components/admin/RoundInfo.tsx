import {h} from 'preact';
import { connect } from 'react-redux';
import type { RootState } from '../../store/reducer';
import './RoundInfo.css';

interface Props {
  round: number;
}

function RoundInfo({round}: Props) {
  return (
    <div className='RoundInfo'>
      { round }
    </div>
  );
}

function mapStateToProps(state: RootState): Props {
  return {
    round: state.combatTracker ? state.combatTracker.round : 1
  }
}

export default connect(mapStateToProps)(RoundInfo);
