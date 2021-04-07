import { h } from 'preact';
import type {
  CharacterConditions,
  CombatCharacterSchema
} from '../../../schemas/combat-character.schema';
import { connect } from 'react-redux';
import type { RootState } from '@store/reducer';
import { SocketClient } from '../../../networking/socket-client';
import { SocketMessageType } from '../../../networking/socket-message-type.schema';
import type { CharacterDetailsState } from '@store/slices/character-details.slice';
import CharacterConditionList from './CharacterConditionList';
import CharacterDetailsTop from './CharacterDetailsTop';
import NpcUrl from './NpcUrl';
import CharacterHealth from './CharacterHealth';
import CharacterArmorClass from './CharacterArmorClass';
import CharacterActionsList from './CharacterActionsList';
import {
  Button,
  ButtonGroup,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Typography
} from '@material-ui/core';

interface CharacterScreenProps {
  character?: CombatCharacterSchema;
  details: CharacterDetailsState | null;
}

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(2)
  }
}));

function CombatTrackerCharacterScreen(props: CharacterScreenProps) {
  const { character } = props;

  function onToggleActiveChange() {
    if (!character) {
      return;
    }
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        active: !character.active
      }
    });
  }

  function onDuplicateCharacterClick() {
    if (!character) {
      return;
    }
    const dupe: Partial<CombatCharacterSchema> = {
      ...character
    };
    delete dupe.id;
    delete dupe.conditions;
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerAddCharacter,
      payload: dupe as Omit<CombatCharacterSchema, 'id' | 'conditions'>
    });
  }

  function onAddNPCDetailsClick() {
    if (!character) {
      return;
    }
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerUpdateCharacter,
      payload: {
        id: character.id,
        npc: {
          armorClass: 0,
          health: 10,
          maxHealth: 10,
          url: ''
        }
      }
    });
  }

  function onRemoveNPCDetailsClick() {
    if (!character) {
      return;
    }
    if (
      window.confirm('Are you sure you want to remove this NPC Details block?')
    ) {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerUpdateCharacter,
        payload: {
          id: character.id,
          npc: null
        }
      });
    }
  }

  function onConditionChange(condition: CharacterConditions) {
    if (!character) {
      return;
    }
    const indexOf = character.conditions.indexOf(condition);
    if (indexOf >= 0) {
      const cons = character.conditions.slice();
      cons.splice(indexOf, 1);
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerUpdateCharacter,
        payload: {
          id: character.id,
          conditions: cons
        }
      });
    } else {
      const cons = character.conditions.slice();
      cons.push(condition);
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerUpdateCharacter,
        payload: {
          id: character.id,
          conditions: cons
        }
      });
    }
  }

  function onDeleteCharacterClick() {
    if (!character) {
      return;
    }
    if (
      window.confirm(
        `Are you sure you want to delete "${character.displayName}"?`
      )
    ) {
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerRemoveCharacter,
        payload: character.id
      });
    }
  }

  const classes = useStyles();

  return (
    <Grid container spacing={3}>
      <Grid item sm={12}>
        <Paper className={classes.paper}>
          {!character ? (
            <em>
              Select a character from the list to the left to see detailed
              information.
            </em>
          ) : (
            <Grid container spacing={3}>
              <Grid item sm={12}>
                <CharacterDetailsTop />
              </Grid>

              <Grid item sm={12}>
                <CharacterConditionList
                  conditions={character.conditions}
                  onConditionChange={onConditionChange}
                />
              </Grid>

              <Grid item sm={12}>
                <ButtonGroup variant="outlined" size="small">
                  {character.active ? (
                    <Button onClick={onToggleActiveChange}>Deactivate</Button>
                  ) : (
                    <Button onClick={onToggleActiveChange}>Activate</Button>
                  )}
                  <Button onClick={onDuplicateCharacterClick}>Duplicate</Button>
                  <Button danger onClick={onDeleteCharacterClick}>
                    Delete
                  </Button>
                </ButtonGroup>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Grid>

      {
        /* Character NPC Block */
        character && character.npc ? (
          <Grid item sm={12}>
            <Paper className={classes.paper}>
              <Typography variant="h5" component="h4">
                NPC Details
              </Typography>

              <NpcUrl />

              <CharacterHealth />

              <CharacterArmorClass />

              <CharacterActionsList />

              <Divider />

              <Button onClick={onRemoveNPCDetailsClick} color="secondary">
                Remove NPC Details
              </Button>
            </Paper>
          </Grid>
        ) : character ? (
          <div>
            <Button onClick={onAddNPCDetailsClick} color="secondary">
              Add NPC Details
            </Button>
          </div>
        ) : null
      }
    </Grid>
  );
}

function mapStateToProps(state: RootState): CharacterScreenProps {
  if (state.characterDetails && state.combatTracker) {
    const id = state.characterDetails.characterId;
    return {
      character: state.combatTracker.characters.find((ch) => ch.id === id),
      details: state.characterDetails
    };
  }
  return {
    details: null
  };
}

export default connect(mapStateToProps)(CombatTrackerCharacterScreen);
