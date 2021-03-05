import { h } from 'preact';
import './Text.css';
import classNames from 'classnames';

interface TextProps {
  id: string;
  label: string;
  long?: boolean;
  value?: string;
  noLabel?: boolean;
  onChange?: (value: string) => void;
}

function Text(props: TextProps) {
  function onChange(e: Event) {
    if (props.onChange) {
      props.onChange((e.target as HTMLInputElement).value);
    }
  }

  return (
    <div
      class={classNames({
        Text: true,
        'no-label': props.noLabel
      })}
    >
      <label for={`${props.id}-input`}>{props.label}</label>
      {!props.long ? (
        <input
          type="text"
          id={`${props.id}-input`}
          value={props.value}
          onInput={onChange}
        />
      ) : (
        <textarea
          id={`${props.id}-input`}
          value={props.value}
          onInput={onChange}
        />
      )}
    </div>
  );
}

export default Text;
