import {h} from 'preact';
import './NumberInput.css';

interface NumberProps {
  id: string;
  label: string;
  value?: number;
  max?: number;
  min?: number;
  onChange?: (value: number, event?: Event) => void;
}

function NumberInput(props: NumberProps) {

  function onChange(event: Event) {
    if (props.onChange) {
      try {
        const value = parseInt((event.target as HTMLInputElement).value);
        props.onChange(value, event);
      } catch (e) {}
    }
  }

  return (
    <div class="NumberInput">
      <label for={`${props.id}-input`}>{props.label}</label>
      <input type="number"
             id={`${props.id}-input`}
             value={props.value}
             min={props.min}
             max={props.max}
             onInput={onChange} />
    </div>
  );
}

export default NumberInput;
