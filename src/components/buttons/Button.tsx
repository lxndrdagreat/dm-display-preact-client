import { h, RenderableProps, JSX } from 'preact';
import './Button.css';

interface ButtonProps {
  onClick?: (event: JSX.TargetedEvent<HTMLButtonElement, MouseEvent>) => void;
}

function Button({ children, onClick }: RenderableProps<ButtonProps>) {
  return (
    <button
      class='Button'
      type='button'
      onClick={ onClick }
    >
      {children}
    </button>
  );
}

export default Button;
