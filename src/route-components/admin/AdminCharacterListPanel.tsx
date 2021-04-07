import { h } from 'preact';
import type { CombatCharacterSchema } from '../../schemas/combat-character.schema';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import AdminCombatCharacterItem from './AdminCombatCharacterItem';
import { Button, ButtonGroup, Grid, List } from '@material-ui/core';
import { SocketClient } from '../../networking/socket-client';
import { SocketMessageType } from '../../networking/socket-message-type.schema';

interface AdminCharacterListPanelProps {
  characters: CombatCharacterSchema[];
  activeCharacterId: string | null;
  editingCharacterId: string | null;
}

function AdminCharacterListPanel({
  characters,
  activeCharacterId,
  editingCharacterId
}: AdminCharacterListPanelProps) {
  function onNextClick() {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerNextTurn
    });
  }

  function onPreviousClick() {
    SocketClient.instance.send({
      type: SocketMessageType.CombatTrackerPreviousTurn
    });
  }

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <ButtonGroup variant="outlined" color="primary">
          <Button onClick={onPreviousClick}>Previous</Button>
          <Button onClick={onNextClick}>Next</Button>
        </ButtonGroup>
      </Grid>
      <Grid item xs={12}>
        <List component="nav" aria-label="character list">
          {characters.map((character) => {
            return (
              <AdminCombatCharacterItem
                character={character}
                isTurn={activeCharacterId === character.id}
                isEditing={editingCharacterId === character.id}
              />
            );
          })}
        </List>
      </Grid>
    </Grid>
  );
}

function mapStateToProps(state: RootState): AdminCharacterListPanelProps {
  if (!state.combatTracker) {
    return {
      characters: [],
      activeCharacterId: null,
      editingCharacterId: null
    };
  }

  return {
    characters: state.combatTracker.characters
      .slice()
      .sort((a, b) => b.roll - a.roll),
    activeCharacterId: state.combatTracker.activeCharacterId,
    editingCharacterId: state.characterDetails
      ? state.characterDetails.characterId
      : null
  };
}

export default connect(mapStateToProps)(AdminCharacterListPanel);
