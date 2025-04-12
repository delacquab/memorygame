import React from 'react';

    function Card({ card, onClick }) {
      const handleClick = () => {
        // Allow clicking only if the card is not already flipped or matched
        if (!card.isFlipped && !card.isMatched) {
          onClick();
        }
      };

      // Add 'matched' class if the card is matched for animation
      const cardContainerClasses = `
        card-container
        ${card.isFlipped || card.isMatched ? 'flipped' : ''}
        ${card.isMatched ? 'matched' : ''}
      `;

      return (
        <div
          className={cardContainerClasses.trim()} // Trim potential leading/trailing spaces
          onClick={handleClick}
        >
          <div className="card-inner">
            <div className="card-face card-front">
              ? {/* Content for the back of the card */}
            </div>
            <div className="card-face card-back">
              <img src={card.image} alt={card.alt || 'Card image'} />
            </div>
          </div>
        </div>
      );
    }

    export default Card;
