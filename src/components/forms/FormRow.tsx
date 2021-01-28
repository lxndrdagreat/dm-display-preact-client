import { h, RenderableProps } from 'preact';
import './FormRow.css';

function FormRow({children}: RenderableProps<never>) {
  return (
    <div className='FormRow'>
      {children}
    </div>
  );
}
