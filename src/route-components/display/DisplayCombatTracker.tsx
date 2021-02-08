import {h} from 'preact';
import DisplayCombatHeader from './DisplayCombatHeader';
import './DisplayCombatTracker.css';
import DisplayInitiativeList from './DisplayInitiativeList';

function DisplayCombatTracker() {
  return (
    <div className='DisplayCombatTracker'>
      <DisplayCombatHeader/>
      <div className='display-body'>
        <DisplayInitiativeList/>
      </div>
    </div>
  );
}

export default DisplayCombatTracker;
