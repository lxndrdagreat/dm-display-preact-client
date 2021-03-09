import { h, RenderableProps, JSX } from 'preact';
import './Button.css';
import classNames from 'classnames';

interface ButtonProps {
  primary?: boolean;
  danger?: boolean;
  icon?: boolean;
  title?: string;
  onClick?: (event: JSX.TargetedEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Button(props: RenderableProps<ButtonProps>) {
  return (
    <button
      class={classNames({
        Button: true,
        primary: props.primary,
        danger: props.danger,
        icon: props.icon
      })}
      type="button"
      title={props.title}
      onClick={props.onClick}
    >
      {props.children}
    </button>
  );
}

export default Button;
