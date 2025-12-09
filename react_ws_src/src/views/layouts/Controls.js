import React, { useState } from 'react';

export default function Controls({ difficulty, setDifficulty }) {
  return (
    <div className="controls">
      <label htmlFor="difficulty">Difficulty:</label>
      <div className="difficulty-options">
        <button
          className={difficulty === 'easy' ? 'active' : ''}
          onClick={() => setDifficulty('easy')}
        >
          Easy
        </button>
        <button
          className={difficulty === 'medium' ? 'active' : ''}
          onClick={() => setDifficulty('medium')}
        >
          Medium
        </button>
        <button
          className={difficulty === 'hard' ? 'active' : ''}
          onClick={() => setDifficulty('hard')}
        >
          Hard
        </button>
      </div>
    </div>
  );
}
