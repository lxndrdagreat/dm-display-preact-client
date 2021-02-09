import {h} from 'preact';
import DisplayCombatHeader from './DisplayCombatHeader';
import './DisplayCombatTracker.css';
import DisplayInitiativeList from './DisplayInitiativeList';
import DisplayPrimaryCharacters from './DisplayPrimaryCharacters';

function DisplayCombatTracker() {
  return (
    <div className='DisplayCombatTracker'>
      <DisplayCombatHeader/>
      <div className='display-body'>
        <DisplayInitiativeList/>
        <DisplayPrimaryCharacters/>
      </div>
    </div>
  );
}

export default DisplayCombatTracker;
