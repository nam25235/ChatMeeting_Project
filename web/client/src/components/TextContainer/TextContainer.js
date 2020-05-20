import React from 'react';

import currentIcon from '../../icons/currentIcon.svg';
import onlineIcon from '../../icons/people.svg';
import './TextContainer.css';

const TextContainer = ({ users }) => (
  <div className="textContainer">
    
    {
      users
        ? (
          <div>
            <div className="card">
            <img className="people" src={onlineIcon} alt="online icon" />
            <h3>People online</h3>
            <div className="activeContainer mt-20">
              <div>
                {users.map(({name}) => (
                  <div key={name} className="activeItem">
                     <img className="currentIcon"alt="Current Icon" src={currentIcon} />
                      {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        )
        : null
    }
  </div>
);

export default TextContainer;