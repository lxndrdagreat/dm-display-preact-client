import { h } from 'preact';
import CharacterActionsListItem from './CharacterActionsListItem';
import type { RootState } from '@store/reducer';
import { connect } from 'react-redux';
import { useState } from 'preact/hooks';
import { SocketClient } from '../../../networking/socket-client';
import { SocketMessageType } from '../../../networking/socket-message-type.schema';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  List,
  TextField,
  Typography
} from '@material-ui/core';
import { ExpandMore } from '@material-ui/icons';

interface Props {
  characterId: string;
  actions: { name: string; info: string }[];
}

interface FormState {
  editing: boolean;
  index: number;
  nameField: string;
  infoField: string;
}

function CharacterActionsList({ actions, characterId }: Props) {
  const [state, setState] = useState<FormState>({
    editing: false,
    index: -1,
    nameField: '',
    infoField: ''
  });

  function onAddActionClick() {
    setState({
      editing: true,
      index: -1,
      nameField: '',
      infoField: ''
    });
  }

  function onSaveActionClick() {
    if (state.nameField.trim() && state.infoField.trim()) {
      const updatedActions = actions.slice();
      if (state.index === -1) {
        updatedActions.push({
          name: state.nameField,
          info: state.infoField
        });
      } else if (state.index < actions.length) {
        const updatedActions = actions.slice();
        updatedActions[state.index] = {
          name: state.nameField,
          info: state.infoField
        };
      }
      SocketClient.instance.send({
        type: SocketMessageType.CombatTrackerUpdateCharacterNPC,
        payload: {
          id: characterId,
          npc: {
            actions: updatedActions
          }
        }
      });
    }

    setState({
      editing: false,
      index: -1,
      nameField: '',
      infoField: ''
    });
  }

  function onEditModalBackdropClick() {
    setState({
      editing: false,
      index: -1,
      nameField: '',
      infoField: ''
    });
  }

  function onActionNameChange(event: InputEvent) {
    setState({
      ...state,
      nameField: (event.target as HTMLInputElement).value
    });
  }

  function onActionInfoChange(event: InputEvent) {
    setState({
      ...state,
      infoField: (event.target as HTMLInputElement).value
    });
  }

  function onEditActionClick(index: number) {
    setState({
      index: index,
      nameField: actions[index].name,
      infoField: actions[index].info,
      editing: true
    });
  }

  return (
    <Accordion>
      <AccordionSummary
        expandIcon={<ExpandMore />}
        aria-controls="actions-accordion"
        id="actions-accordion-header"
      >
        <Typography>Actions</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Grid container alignContent="center" alignItems="center">
          <Grid item xs={12}>
            <Button onClick={onAddActionClick} variant="outlined">
              Add
            </Button>
          </Grid>

          <Grid item xs={12}>
            <List>
              {actions.map((action, index) => (
                <CharacterActionsListItem
                  info={action.info}
                  name={action.name}
                  onEditClick={() => {
                    onEditActionClick(index);
                  }}
                />
              ))}
            </List>
          </Grid>
        </Grid>

        <Dialog
          open={state.editing}
          aria-labelledby="edit-character-action-dialog"
          onClose={onEditModalBackdropClick}
        >
          <DialogTitle id="edit-character-action-dialog">Action</DialogTitle>
          <DialogContent>
            <Grid container spacing={1}>
              <Grid item xs={12}>
                <TextField
                  label="Name"
                  fullWidth
                  value={state.nameField}
                  onChange={onActionNameChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Text"
                  fullWidth
                  multiline
                  rows={5}
                  value={state.infoField}
                  onChange={onActionInfoChange}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  color="primary"
                  variant="contained"
                  onClick={onSaveActionClick}
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
        </Dialog>
      </AccordionDetails>
    </Accordion>
  );
}

function mapStateToProps(state: RootState): Props {
  if (!state.characterDetails) {
    throw new Error('No character details are being viewed.');
  }
  const character = state.combatTracker!.characters.find(
    (ch) => ch.id === state.characterDetails!.characterId
  );
  if (!character) {
    throw new Error('Character not found.');
  }
  return {
    characterId: character.id,
    actions: character.npc ? character.npc.actions ?? [] : []
  };
}

export default connect(mapStateToProps)(CharacterActionsList);
