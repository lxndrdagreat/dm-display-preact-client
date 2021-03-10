import {h} from 'preact';
import type { RootState } from "@store/reducer";
import { connect } from "react-redux";
import "./HeaderStatus.css";
import ModalWrap from "../../components/ModalWrap";
import { useState } from "preact/hooks";
import Button from "../../components/buttons/Button";
import { downloadDataAsFile, readFile } from "../../utils/file-access";
import store from "@store/store";
import type { CombatCharacterSchema } from "../../schemas/combat-character.schema";
import { SocketClient } from "../../networking/socket-client";
import { SocketMessageType } from "../../networking/socket-message-type.schema";

interface Props {
  sessionId: string | null;
}

interface State {
  open: boolean;
  file: File | null;
}

function HeaderStatus(props: Props) {
  const [state, setState] = useState<State>({
    open: false,
    file: null
  });

  function onBackgroundClick() {
    setState({
      ...state,
      open: false
    });
  }

  function onOpenClick() {
    setState({
      ...state,
      open: true
    });
  }

  async function onImportClick() {
    if (!state.file) {
      return;
    }
    try {
      const data = await readFile(state.file);
      const parsed = JSON.parse(data) as CombatCharacterSchema;
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerState,
        payload: parsed
      });
    } catch (e) {
      console.error(e);
    }
  }

  function onImportFileChange(e: Event) {
    const files = (e.target as HTMLInputElement).files;
    if (!files || !files.length) {
      return;
    }
    setState({
      ...state,
      file: files[0]
    });
  }

  function onExportClick() {

    const {combatTracker} = store.getState() as RootState;
    if (!combatTracker) {
      return;
    }

    const asString = JSON.stringify(combatTracker);
    downloadDataAsFile(asString, 'combat-tracker-export.json');
  }

  const displayURL = `/?session=${props.sessionId}`;
  const adminURL = `/?session=${props.sessionId}&role=admin`;

  return (
    <div class="HeaderStatus">
      <div className="session-id">
        <Button onClick={onOpenClick}>{props.sessionId}</Button>
      </div>

      <ModalWrap active={state.open} onBackgroundClick={onBackgroundClick}>
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
          <div>
            <h4>Import JSON</h4>
            <p>
              <em>Warning: this will overwrite the current CombatTracker state.</em>
            </p>
            <input type="file" onChange={onImportFileChange} accept=".json"/>
            <Button onClick={onImportClick}>Import</Button>
          </div>
          <div>
            <h4>Export JSON</h4>
            <Button onClick={onExportClick}>Export</Button>
          </div>
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
