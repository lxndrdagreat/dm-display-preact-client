import {h} from 'preact';

interface CheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (e: Event) => void;
}

function Checkbox(props: CheckboxProps) {
  return (
    <div className="Checkbox">
      <input id={`${props.id}-checkbox`}
             type="checkbox"
             checked={props.checked}
             onChange={props.onChange}/>
      <label for={`${props.id}-checkbox`}>
        {props.label}
      </label>
    </div>
  );
}

export default Checkbox;
