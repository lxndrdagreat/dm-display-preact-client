import { h, RenderableProps } from 'preact';
import './ModalWrap.css';

interface Props {
  active: boolean;
  onBackgroundClick?: () => void;
}

export default function ModalWrap({
  active,
  onBackgroundClick,
  children
}: RenderableProps<Props>) {
  function onBackdropClick() {
    if (onBackgroundClick) {
      onBackgroundClick();
    }
  }

  return (
    <div className="ModalWrap">
      {active ? (
        <div className="backdrop" onClickCapture={onBackdropClick}></div>
      ) : null}
      {active ? <div className="dialog">{children}</div> : null}
    </div>
  );
}
