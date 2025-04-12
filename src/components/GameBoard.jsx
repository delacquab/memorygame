import React from 'react';
    import Card from './Card';

    function GameBoard({ cards, onCardClick }) {
      return (
        <div className="game-board">
          {cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onClick={() => onCardClick(card)}
            />
          ))}
        </div>
      );
    }

    export default GameBoard;
