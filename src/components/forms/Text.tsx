import {h, JSX} from 'preact';
import './Text.css';

interface TextProps {
  id: string;
  label: string;
  value?: string;
  onChange?: (event: JSX.TargetedEvent<HTMLInputElement, Event>) => void;
}

function Text(props: TextProps) {

  return (
    <div class="Text">
      <label for={`${props.id}-input`}>{props.label}</label>
      <input type="text"
             id={`${props.id}-input`}
             value={props.value}
             onInput={props.onChange} />
    </div>
  );
}

export default Text;
