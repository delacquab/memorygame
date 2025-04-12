import React, { useState, useEffect } from 'react';
    import GameSetup from './components/GameSetup';
    import GameBoard from './components/GameBoard';
    import Scoreboard from './components/Scoreboard';
    import cardImages from './cardImages'; // Import card images configuration

    // Function to shuffle array
    const shuffleArray = (array) => {
      let currentIndex = array.length, randomIndex;
      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
          array[randomIndex], array[currentIndex]];
      }
      return array;
    };

    // Function to create the initial deck
    const createDeck = () => {
      const duplicatedImages = [...cardImages, ...cardImages];
      return shuffleArray(duplicatedImages.map((image, index) => ({
        id: index,
        image: image.src,
        alt: image.alt,
        isFlipped: false,
        isMatched: false,
      })));
    };

    // Simple sound effect using Web Audio API
    const playMatchSound = () => {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      if (!audioContext) return; // Web Audio API not supported

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.type = 'sine'; // Type of sound wave
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime); // Frequency in Hz (higher pitch)
      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime); // Volume (0 to 1)

      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.15); // Duration of the sound in seconds
    };


    function App() {
      const [numPlayers, setNumPlayers] = useState(0);
      const [scores, setScores] = useState([]);
      const [currentPlayer, setCurrentPlayer] = useState(0);
      const [cards, setCards] = useState([]);
      const [flippedCards, setFlippedCards] = useState([]);
      const [isChecking, setIsChecking] = useState(false); // To prevent clicking during check
      const [gameStarted, setGameStarted] = useState(false);
      const [gameOver, setGameOver] = useState(false);

      // Initialize game when number of players is set
      const startGame = (players) => {
        setNumPlayers(players);
        setScores(Array(players).fill(0));
        setCurrentPlayer(0);
        setCards(createDeck());
        setFlippedCards([]);
        setIsChecking(false);
        setGameStarted(true);
        setGameOver(false);
      };

      // Handle card click
      const handleCardClick = (clickedCard) => {
        if (isChecking || clickedCard.isFlipped || clickedCard.isMatched || flippedCards.length === 2) {
          return; // Ignore clicks if checking, card already flipped/matched, or 2 cards already flipped
        }

        // Flip the clicked card
        const newCards = cards.map(card =>
          card.id === clickedCard.id ? { ...card, isFlipped: true } : card
        );
        setCards(newCards);

        const newFlippedCards = [...flippedCards, clickedCard];
        setFlippedCards(newFlippedCards);

        // If two cards are flipped, check for a match
        if (newFlippedCards.length === 2) {
          setIsChecking(true); // Prevent further clicks
          setTimeout(() => checkForMatch(newFlippedCards), 1000); // Delay for visual feedback
        }
      };

      // Check if the two flipped cards match
      const checkForMatch = (flippedPair) => {
        const [card1, card2] = flippedPair;

        if (card1.image === card2.image) {
          // Match found
          playMatchSound(); // Play sound effect
          const newCards = cards.map(card =>
            card.image === card1.image ? { ...card, isMatched: true, isFlipped: true } : card
          );
          setCards(newCards);

          // Update score for the current player
          const newScores = [...scores];
          newScores[currentPlayer]++;
          setScores(newScores);

          // Check if game is over
          if (newCards.every(card => card.isMatched)) {
            setGameOver(true);
          }

        } else {
          // No match, flip cards back
          const newCards = cards.map(card =>
            card.id === card1.id || card.id === card2.id ? { ...card, isFlipped: false } : card
          );
          // Use timeout to ensure state update happens after visual flip back
          setTimeout(() => setCards(newCards), 200); // Short delay before state update if needed

          // Switch player
          setCurrentPlayer((currentPlayer + 1) % numPlayers);
        }

        // Reset flipped cards and allow clicking again
        setFlippedCards([]);
        setIsChecking(false);
      };

      // Restart game handler
      const restartGame = () => {
        setGameStarted(false); // Go back to setup screen
        setNumPlayers(0);
        setScores([]);
        setCards([]);
      };

      return (
        <div className="app-container">
          <h1>Memory Game</h1>
          {!gameStarted ? (
            <GameSetup onStartGame={startGame} />
          ) : (
            <>
              <Scoreboard scores={scores} currentPlayer={currentPlayer} numPlayers={numPlayers} />
              {gameOver ? (
                <div>
                  <h2>Game Over!</h2>
                  {/* Optional: Display winner */}
                  <button onClick={restartGame}>Play Again?</button>
                </div>
              ) : (
                <GameBoard cards={cards} onCardClick={handleCardClick} />
              )}
              <div className="game-controls">
                 <button onClick={restartGame}>Restart Game</button>
              </div>
            </>
          )}
        </div>
      );
    }

    export default App;
