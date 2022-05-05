import React from 'react';
import './App.css';
import './mobile.css';
import { testFunction } from './App.js';

export default function Timeline() {
  return (
    <div id="team" className='timeline'>
          <span className="timelineText">MEET THE TEAM</span>
          {/*<div className="timeDesc"><p>Naughty Icons are the degenerate generative art masterpieces that have come to celebrate the immortal reign of the Naughty community. Naughty Icons holders are reserved exclusive rights to merchandise as well as inclusion in an ongoing illustrated lore series that will reward +100 social credit (airdrops) to the randomly selected featured holders each week!</p></div>*/}
          <div className='teamGrid'>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div>Thing 1</div>
            <div>Thing 2</div>
            <div>Thing 3</div>
            <div>Thing 4</div>
            <div>Thing 5</div>
            <div>Thing 6</div>
            <div>Role</div>
            <div>Role</div>
            <div>Role</div>
            <div>Role</div>
            <div>Role</div>
            <div>Role</div>
          </div>
        </div>
  )
}
