import React, { useState } from 'react';

    function GameSetup({ onStartGame }) {
      const [players, setPlayers] = useState(1);

      const handleStart = () => {
        if (players > 0 && players <= 4) { // Example limit: 1-4 players
          onStartGame(players);
        } else {
          alert("Please enter a number of players between 1 and 4.");
        }
      };

      return (
        <div className="game-setup">
          <label htmlFor="numPlayers">Number of Players (1-4): </label>
          <input
            type="number"
            id="numPlayers"
            value={players}
            onChange={(e) => setPlayers(parseInt(e.target.value, 10) || 1)}
            min="1"
            max="4" // Set max players
          />
          <button onClick={handleStart}>Start Game</button>
        </div>
      );
    }

    export default GameSetup;
