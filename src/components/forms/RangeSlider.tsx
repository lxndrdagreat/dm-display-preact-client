import {h} from 'preact';
import './RangeSlider.css';

interface RangeSliderProps {
  min: number;
  max: number;
  value?: number;
  id: string;
  label: string;
  labelMinMax?: boolean;
  labelValue?: boolean;
  onChange?: (value: number) => void;
}

function RangeSlider(props: RangeSliderProps) {

  function onChange(event: Event) {
    if (props.onChange) {
      const {value} = (event.target as HTMLInputElement);
      try {
        const v = parseInt(value);
        props.onChange(v);
      } catch (e) {}
    }
  }

  return (
    <div className="RangeSlider">
      <label for={`${props.id}-slider`}>{props.label}</label>
      <div className="RangeSlider-wrap">
        {
          props.labelMinMax ? (
            <div class="RangeSlider-min-label">{ props.min }</div>
          ) : null
        }
        <input
          id={`${props.id}-slider`}
          type="range"
          min={props.min}
          max={props.max}
          value={props.value}
          onChange={onChange}
        />
        {
          props.labelMinMax ? (
            <div class="RangeSlider-max-label">{ props.max }</div>
          ) : null
        }
        {
          props.labelValue ? (
            <div className='RangeSlider-value-label'>{ props.value }</div>
          ) : null
        }
      </div>

    </div>
  );
}

export default RangeSlider;
