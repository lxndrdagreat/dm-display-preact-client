import { Fragment, h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';

interface Props {
  characters: CombatCharacterSchema[];
  activeCharacter: CombatCharacterSchema | null;
}

const maxShowing = 10;

export default function DisplayInitiativeList({
  characters,
  activeCharacter
}: Props) {
  let initiativeList: (CombatCharacterSchema | null)[] = characters.slice();
  initiativeList.push(null);
  const activeCharacterIndex = !activeCharacter
    ? -1
    : characters.findIndex((ch) => ch && ch.id === activeCharacter.id);
  initiativeList = initiativeList
    .rotate(activeCharacterIndex >= 0 ? activeCharacterIndex : 0)
    .slice(0, maxShowing);

  const total = initiativeList.length;

  return (
    <List>
      {initiativeList.map((character) => {
        return character ? (
          <ListItem>
            <ListItemText
              primary={character.displayName}
              primaryTypographyProps={{ variant: 'h4', component: 'div' }}
            />
          </ListItem>
        ) : (
          <Fragment>
            <Divider />
            <ListItem>
              <ListItemText
                secondary="Next Round"
                secondaryTypographyProps={{ variant: 'h6', component: 'div' }}
              />
            </ListItem>
            <Divider />
          </Fragment>
        );
      })}

      {total > maxShowing ? (
        <Fragment>
          <Divider />
          <ListItem>
            <ListItemText secondary={`+${total - maxShowing} more`} />
          </ListItem>
        </Fragment>
      ) : null}
    </List>
  );
}
