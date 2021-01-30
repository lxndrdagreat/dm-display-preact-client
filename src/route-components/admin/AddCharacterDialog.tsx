import type { RenderableProps } from 'preact';
import {h} from 'preact';
import AddCharacterForm from './AddCharacterForm';
import './AddCharacterDialog.css';
import { useEffect } from 'preact/hooks';

interface Props {
  open?: boolean;
  onClose: () => void;
}

function AddCharacterDialog({open, onClose}: RenderableProps<Props>) {

  function onClickBackdrop() {
    onClose();
  }

  if (!open) {
    return null;
  }

  return (
    <div className="AddCharacterDialog">
      <div className='backdrop' onClickCapture={onClickBackdrop}></div>
      <div className='dialog'>
        <AddCharacterForm/>
      </div>
    </div>
  );
}

export default AddCharacterDialog;
