import { h, RenderableProps } from 'preact';
import { CharacterConditions } from '../../../schemas/combat-character.schema';
import './CharacterConditionList.css';
import Checkbox from '../../../components/forms/Checkbox';

interface Props {
  conditions: CharacterConditions[];
  onConditionChange: (condition: CharacterConditions) => void;
}

interface Condition {
  label: string;
  condition: CharacterConditions;
}

function CharacterConditionList({
  conditions,
  onConditionChange
}: RenderableProps<Props>) {
  const conditionItems: Condition[] = [
    {
      label: 'Blinded',
      condition: CharacterConditions.Blinded
    },
    {
      label: 'Charmed',
      condition: CharacterConditions.Charmed
    },
    {
      label: 'Deafened',
      condition: CharacterConditions.Deafened
    },
    {
      label: 'Frightened',
      condition: CharacterConditions.Frightened
    },
    {
      label: 'Grappled',
      condition: CharacterConditions.Grappled
    },
    {
      label: 'Incapacitated',
      condition: CharacterConditions.Incapacitated
    },
    {
      label: 'Invisible',
      condition: CharacterConditions.Invisible
    },
    {
      label: 'Paralyzed',
      condition: CharacterConditions.Paralyzed
    },
    {
      label: 'Petrified',
      condition: CharacterConditions.Petrified
    },
    {
      label: 'Poisoned',
      condition: CharacterConditions.Poisoned
    },
    {
      label: 'Prone',
      condition: CharacterConditions.Prone
    },
    {
      label: 'Restrained',
      condition: CharacterConditions.Restrained
    },
    {
      label: 'Stunned',
      condition: CharacterConditions.Stunned
    },
    {
      label: 'Unconcious',
      condition: CharacterConditions.Unconcious
    }
  ];

  return (
    <div className="CharacterConditionList">
      <ul>
        <fieldset>
          <legend>Conditions</legend>

          {conditionItems.map((condition) => (
            <li>
              <Checkbox
                id={`condition-${condition.label.toLowerCase()}`}
                label={condition.label}
                checked={conditions.includes(condition.condition)}
                onChange={() => onConditionChange(condition.condition)}
              />
            </li>
          ))}
        </fieldset>
      </ul>
    </div>
  );
}

export default CharacterConditionList;
