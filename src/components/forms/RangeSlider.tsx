import { h } from 'preact';
import './RangeSlider.css';
import { useState } from 'preact/hooks';

interface RangeSliderProps {
  min: number;
  max: number;
  value?: number;
  id: string;
  label: string;
  labelMinMax?: boolean;
  labelValue?: boolean;
  trackChanges?: boolean;
  onChange?: (value: number) => void;
}

interface State {
  active: boolean;
  startingValue: number;
  value: number;
  lastId: string;
}

function RangeSlider(props: RangeSliderProps) {
  const [state, setState] = useState<State>({
    active: false,
    startingValue: props.value ?? props.min,
    value: props.value ?? props.min,
    lastId: props.id
  });

  if (props.id !== state.lastId) {
    // force input update
    setState({
      active: false,
      startingValue: props.value ?? props.min,
      value: props.value ?? props.min,
      lastId: props.id
    });
  }

  function parseInputValue(input: HTMLInputElement): number {
    try {
      return parseInt(input.value);
    } catch (e) {
      return 0;
    }
  }

  function onChange(event: Event) {
    if (state.active) {
      const v = parseInputValue(event.target as HTMLInputElement);
      setState({
        ...state,
        value: v
      });
    }
  }

  function onMouseDown(event: MouseEvent) {
    const v = parseInputValue(event.target as HTMLInputElement);
    setState({
      active: true,
      startingValue: v,
      value: v,
      lastId: state.lastId
    });
  }

  function onMouseUp(event: MouseEvent) {
    setState({
      active: false,
      startingValue: state.value,
      value: state.value,
      lastId: state.lastId
    });
    if (props.onChange) {
      props.onChange(state.value);
    }
  }

  return (
    <div className="RangeSlider">
      <label for={`${props.id}-slider`}>{props.label}</label>
      <div className="RangeSlider-wrap">
        {props.labelMinMax ? (
          <div class="RangeSlider-min-label">{props.min}</div>
        ) : null}
        <input
          id={`${props.id}-slider`}
          type="range"
          min={props.min}
          max={props.max}
          value={state.value}
          onMouseDown={onMouseDown}
          onMouseUp={onMouseUp}
          onChange={onChange}
        />
        {props.labelMinMax ? (
          <div class="RangeSlider-max-label">{props.max}</div>
        ) : null}
        {props.labelValue ? (
          <div className="RangeSlider-value-label">{state.value}</div>
        ) : null}
        {
          /* Delta Change Indicator */
          props.trackChanges && state.active ? (
            <div className="RangeSlider-delta-tracker">
              {state.value - state.startingValue}
            </div>
          ) : null
        }
      </div>
    </div>
  );
}

export default RangeSlider;
