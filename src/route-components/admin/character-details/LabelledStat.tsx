import { h } from 'preact';
import './LabelledStat.css';
import type { IconName } from '../../../components/Icon';
import Icon from '../../../components/Icon';

interface Props {
  label: string;
  hideLabel?: boolean;
  value: number;
  icon?: IconName;
}

function LabelledStat({ label, value, icon, hideLabel }: Props) {
  return (
    <div className="LabelledStat">
      {icon ? <Icon name={icon} /> : null}
      {hideLabel ? null : <strong>{label}</strong>}
      <span>{value}</span>
    </div>
  );
}

export default LabelledStat;
