import { h, RenderableProps } from 'preact';
import './FormRow.css';

function FormRow({children}: RenderableProps<{}>) {
  return (
    <div className='FormRow'>
      {children}
    </div>
  );
}

export default FormRow;
