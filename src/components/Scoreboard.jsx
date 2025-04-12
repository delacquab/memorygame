import React from 'react';

    function Scoreboard({ scores, currentPlayer, numPlayers }) {
      return (
        <div className="scoreboard">
          {Array.from({ length: numPlayers }).map((_, index) => (
            <div
              key={index}
              className={`player-score ${index === currentPlayer ? 'active' : ''}`}
            >
              Player {index + 1}: {scores[index]}
            </div>
          ))}
        </div>
      );
    }

    export default Scoreboard;
