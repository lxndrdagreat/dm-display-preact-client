import { Fragment, h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import { Divider, List, ListItem, ListItemText } from '@material-ui/core';

interface Props {
  characters: (CombatCharacterSchema | null)[];
  total: number;
}

const maxShowing = 10;

function DisplayInitiativeList({ characters, total }: Props) {
  return (
    <List>
      {characters.map((character) => {
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

function mapStateToProps(state: RootState): Props {
  if (!state.combatTracker) {
    return {
      characters: [],
      total: 0
    };
  }

  let characters: (CombatCharacterSchema | null)[] = state.combatTracker.characters
    .slice()
    .sort((a, b) => b.roll - a.roll);
  characters.push(null);
  const activeCharacterIndex = characters.findIndex(
    (ch) => ch && ch.id === state.combatTracker!.activeCharacterId
  );
  characters = characters
    .rotate(activeCharacterIndex >= 0 ? activeCharacterIndex : 0)
    .slice(0, maxShowing);
  return {
    characters: characters,
    total: state.combatTracker.characters.length
  };
}

export default connect(mapStateToProps)(DisplayInitiativeList);
