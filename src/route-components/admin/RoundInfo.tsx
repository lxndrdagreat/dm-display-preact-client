import { h } from 'preact';
import { connect } from 'react-redux';
import type { RootState } from '@store/reducer';
import './RoundInfo.css';
import { Typography } from '@material-ui/core';

interface Props {
  round: number;
}

function RoundInfo({ round }: Props) {
  return (
    <Typography variant="h6" component="p">
      Round {round}
    </Typography>
  );
}

function mapStateToProps(state: RootState): Props {
  return {
    round: state.combatTracker ? state.combatTracker.round : 1
  };
}

export default connect(mapStateToProps)(RoundInfo);
