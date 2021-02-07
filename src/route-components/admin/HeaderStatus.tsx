import { h } from 'preact';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './HeaderStatus.css';

interface Props {
  sessionId: string | null;
}

function HeaderStatus(props: Props) {
  return (
    <div class="HeaderStatus">
      <div className="session-id">{props.sessionId}</div>
    </div>
  );
}

function mapStateToProps(state: RootState): Props {
  return {
    sessionId: state.session.id,
  };
}

export default connect(mapStateToProps)(HeaderStatus);
