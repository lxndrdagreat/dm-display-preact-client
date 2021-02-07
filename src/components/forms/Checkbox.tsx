import { h } from 'preact';

interface CheckboxProps {
  id: string;
  label: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
}

function Checkbox(props: CheckboxProps) {
  function onChange(e: Event) {
    if (props.onChange) {
      props.onChange((e.target as HTMLInputElement).checked);
    }
  }

  return (
    <div className="Checkbox">
      <input
        id={`${props.id}-checkbox`}
        type="checkbox"
        checked={props.checked}
        onChange={onChange}
      />
      <label for={`${props.id}-checkbox`}>{props.label}</label>
    </div>
  );
}

export default Checkbox;
