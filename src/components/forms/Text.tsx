import {h, JSX} from 'preact';
import './Text.css';

interface TextProps {
  id: string;
  label: string;
  value?: string;
  onChange?: (value: string) => void;
}

function Text(props: TextProps) {

  function onChange(e: Event) {
    if (props.onChange) {
      props.onChange((e.target as HTMLInputElement).value);
    }
  }

  return (
    <div class="Text">
      <label for={`${props.id}-input`}>{props.label}</label>
      <input type="text"
             id={`${props.id}-input`}
             value={props.value}
             onInput={onChange} />
    </div>
  );
}

export default Text;
