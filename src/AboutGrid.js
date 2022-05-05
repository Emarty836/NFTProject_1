import React from 'react';
import './App.css';
import './mobile.css';

export default function AboutGrid() {
  return (
    <div id="about">
    <div className='about'><span>ABOUT</span></div>
    <div className="aboutGrid">
          
          <div className='A1'><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div className='A2'><img className='portraits' alt={"about1"} src={"/config/images/45RT.gif"} /></div>
         
          
        </div>
        </div>
  )
}
