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
}

function RangeSlider(props: RangeSliderProps) {
  return (
    <div className="RangeSlider">
      <label for={`${props.id}-slider`}>{props.label}</label>
      <input
        id={`${props.id}-slider`}
        type="range"
        min={props.min}
        max={props.max}
        value={props.value}
      />
    </div>
  );
}

export default RangeSlider;
