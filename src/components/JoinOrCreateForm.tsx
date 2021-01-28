import { h } from 'preact';
import Text from './forms/Text';
import Button from './buttons/Button';
import './JoinOrCreateForm.css';
import { useState } from 'preact/hooks';
import { SocketClient } from '../networking/socket-client';
import { SocketMessageType } from '../networking/socket-message-type.schema';
import {dispatch} from '../store/store';
import { setSessionPassword, setSessionId } from '../store/slices/session.slice';

interface JoinOrCreateFormProps {
  showJoin: boolean;
  showCreate: boolean;
}

interface JoinFormState {
  sessionId: string;
  password: string;
  joining: boolean;
}

interface CreateFormState {
  password: string;
  creating: boolean;
}

function JoinOrCreateForm({ showJoin, showCreate }: JoinOrCreateFormProps) {

  const [joinForm, setJoinForm] = useState<JoinFormState>({
    sessionId: '',
    password: '',
    joining: false
  });

  const [createForm, setCreateForm] = useState<CreateFormState>({
    password: '',
    creating: false
  });

  function onJoinSessionIdInput(e: Event) {
    setJoinForm({
      ...joinForm,
      sessionId: (e.target as HTMLInputElement).value
    });
  }

  function onJoinPasswordInput(e: Event) {
    setJoinForm({
      ...joinForm,
      password: (e.target as HTMLInputElement).value
    });
  }

  function onJoinClick() {
    if (joinForm.sessionId.length && joinForm.password.length) {
      dispatch(setSessionPassword(joinForm.password));
      dispatch(setSessionId(joinForm.sessionId));
    }
  }

  function onCreatePasswordInput(e: Event) {
    setCreateForm({
      ...createForm,
      password: (e.target as HTMLInputElement).value
    });
  }

  function onCreateClick() {
    if (createForm.password.length) {
      dispatch(setSessionPassword(createForm.password));
      SocketClient.instance.send({
        type: SocketMessageType.CreateNewSession,
        payload: createForm.password
      });
    }
  }

  return (
    <div class='JoinOrCreateForm'>
      <div role='region'
           aria-labelledby='join'
           class='form-block'>
        <h2 id='join'>Join a session...</h2>

        <Text
          id="join-session-id"
          label="Session Id"
          value={joinForm.sessionId}
          onChange={ onJoinSessionIdInput }
        />

        <Text
          id="join-session-password"
          label="Session Password"
          value={joinForm.password}
          onChange={ onJoinPasswordInput }
        />

        <Button onClick={onJoinClick}>
          Join
        </Button>

      </div>

      <div role='region'
           aria-labelledby='create'
           class='form-block'>
        <h2 id='create'>...or create a new one.</h2>

        <Text
          id="create-session-password"
          label="Session Password"
          onChange={ onCreatePasswordInput }
        />

        <Button onClick={onCreateClick}>
          Create
        </Button>

      </div>

    </div>
  );
}

export default JoinOrCreateForm;
