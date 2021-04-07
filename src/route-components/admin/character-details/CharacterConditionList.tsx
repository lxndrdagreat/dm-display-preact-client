import { h, RenderableProps } from 'preact';
import { CharacterConditions } from '../../../schemas/combat-character.schema';
import { FormControlLabel, Grid, Switch } from '@material-ui/core';

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
      condition: CharacterConditions.Unconscious
    }
  ];

  return (
    <Grid container>
      {conditionItems.map((condition) => (
        <Grid item sm={2} md={4}>
          <FormControlLabel
            control={
              <Switch
                checked={conditions.includes(condition.condition)}
                name={condition.label}
                onChange={() => onConditionChange(condition.condition)}
                size="small"
              />
            }
            label={condition.label}
          />
        </Grid>
      ))}
    </Grid>
  );
}

export default CharacterConditionList;
