import React, { useState } from 'react';
import './App.css';

const baseImages = [
  '/images/nahida.png',
  '/images/trbbie beast.png',
];

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

const generateShuffledImages = () =>
  shuffle([
    ...Array(18).fill(baseImages[0]),
    ...Array(18).fill(baseImages[1]),
  ]);

export default function BoxGrid() {
  const [shuffledImages, setShuffledImages] = useState(generateShuffledImages());
  const [flipped, setFlipped] = useState(Array(36).fill(false));
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [playerChoices, setPlayerChoices] = useState([]);
  const [winner, setWinner] = useState(null);
  const [gameOver, setGameOver] = useState(false);

  const handlePlayerSelect = (player) => {
    setCurrentPlayer(player);
    setPlayerChoices([]);
    setFlipped(Array(36).fill(false));
    setWinner(null);
    setGameOver(false);
  };

  const handleCardClick = (index) => {
    if (gameOver || flipped[index] || currentPlayer === null) return;

    const expectedSymbol = currentPlayer === 'nahida' ? baseImages[0] : baseImages[1];
    const actualSymbol = shuffledImages[index];

    const newFlipped = [...flipped];
    newFlipped[index] = true;
    setFlipped(newFlipped);

    const newChoices = [...playerChoices, { index, correct: actualSymbol === expectedSymbol }];
    setPlayerChoices(newChoices);

    const totalExpected = shuffledImages.filter(img => img === expectedSymbol).length;
    const correctCount = newChoices.filter(choice => choice.correct).length;
    const wrongChoice = newChoices.find(choice => !choice.correct);

    if (wrongChoice) {
      setWinner(currentPlayer === 'nahida' ? 'tribbie' : 'nahida');
      setGameOver(true);
    } else if (correctCount === totalExpected) {
      setWinner(currentPlayer);
      setGameOver(true);
    }
  };

  const restartGame = () => {
    setShuffledImages(generateShuffledImages());
    setFlipped(Array(36).fill(false));
    setCurrentPlayer(null);
    setPlayerChoices([]);
    setWinner(null);
    setGameOver(false);
  };

  return (
    <div className="game-container">
      <h2>Nahida vs Tribbie</h2>

      {!currentPlayer && (
        <div className="player-select">
          <button onClick={() => handlePlayerSelect('nahida')}> Nahida Player</button>
          <button onClick={() => handlePlayerSelect('tribbie')}> Tribbie Player</button>
        </div>
      )}

      {currentPlayer && (
        <p>Current Player: <strong>{currentPlayer.toUpperCase()}</strong></p>
      )}

      <div className="grid-container-6x6">
        {shuffledImages.map((img, i) => (
          <div
            key={i}
            className={`card ${flipped[i] ? 'flipped' : ''}`}
            onClick={() => handleCardClick(i)}
          >
            <div className="card-inner">
              <div className="card-front">{i + 1}</div>
              <div className="card-back">
                <img src={img} alt="card" className="card-img" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {gameOver && (
        <div className="result-box">
          <h3>🎉 {winner?.toUpperCase()} WINS!</h3>
          <button onClick={restartGame}>Restart Game</button>
        </div>
      )}
    </div>
  );
}
