import { h } from 'preact';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import './HeaderStatus.css';
import ModalWrap from '../../components/ModalWrap';
import { useState } from 'preact/hooks';
import Button from '../../components/buttons/Button';

interface Props {
  sessionId: string | null;
}

function HeaderStatus(props: Props) {
  const [open, setState] = useState(false);

  function onBackgroundClick() {
    setState(false);
  }

  function onOpenClick() {
    setState(true);
  }

  const displayURL = `/?session=${props.sessionId}`;
  const adminURL = `/?session=${props.sessionId}&role=admin`;

  return (
    <div class="HeaderStatus">
      <div className="session-id">
        <Button onClick={onOpenClick}>{props.sessionId}</Button>
      </div>

      <ModalWrap active={open} onBackgroundClick={onBackgroundClick}>
        <div className="session-info-body">
          <h3>Session Info</h3>
          <p>
            <a href={displayURL} target="_blank">
              Open Display in new window
            </a>
          </p>
          <p>
            <a href={adminURL} target="_blank">
              Open Admin in new window
            </a>
          </p>
        </div>
      </ModalWrap>
    </div>
  );
}

function mapStateToProps(state: RootState): Props {
  return {
    sessionId: state.session.id
  };
}

export default connect(mapStateToProps)(HeaderStatus);
