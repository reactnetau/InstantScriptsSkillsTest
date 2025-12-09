import React, { use, useContext, useState } from 'react';
import { ApiContext } from '../../contexts/ApiContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

const UserDetails = () => {
  const [view, setView] = useState('scoreboard');
  const { user, leaderboard } = useContext(ApiContext);

  console.log('UserDetails render', { user, leaderboard });
  return (
    <div className="user-details">
      <div className="nav-tabs">
        <button
          className={view === 'scoreboard' ? 'active' : ''}
          onClick={() => setView('scoreboard')}
        >
          <strong>Statistics</strong>
        </button>

        <button
          className={view === 'achievements' ? 'active' : ''}
          onClick={() => setView('achievements')}
        >
          <strong>Achievements</strong>
        </button>
      </div>

      <div className="content">
        {view === 'scoreboard' && (
  <div className="leaderboard-container">
    <h3>Leaderboard</h3>
    {leaderboard.length > 0 ? (
      leaderboard.map((entry, index) => 
        entry.totalWins > 0 && (
          <div key={entry.id} className="leaderboard-entry">
            <span className="rank">{index + 1}</span>
            <span className="name">{entry.name}</span>
            <span className="score">{entry.totalWins} wins</span>
          </div>
        )
      )
    ) : (
      <div className="no-entries">No leaderboard entries yet.</div>
    )}

    <h3>Your statistics</h3>
    <div className="leaderboard-container">
      <div className="leaderboard-entry">
        <span className="name">Wins</span>
        <span className="score">{user.scores.ttt.win} wins</span>
      </div>
      <div className="leaderboard-entry">
        <span className="name">Draws</span>
        <span className="score">{user.scores.ttt.draw} draws</span>
      </div>
      <div className="leaderboard-entry">
        <span className="name">Losses</span>
        <span className="score">{user.scores.ttt.loss} losses</span>
      </div>
      <div className="leaderboard-entry">
        <span className="name">Win/Loss</span>
        <span className="score">
          {(() => {
            const wins = user.scores.ttt.win;
            const losses = user.scores.ttt.loss;
            const total = wins + losses;
            if (total === 0) return '0%';
            return `${((wins / total) * 100).toFixed(0)}%`;
          })()}
        </span>
      </div>
    </div>
  </div>
)}
        {view === 'achievements' && (
          <div>
            <div className="achievements-container">
              {user.achievements && user.achievements.length > 0 ? (
                user.achievements.map((achv, idx) => (
                  <div key={idx} className="achievement-entry">
                    <span className="achievement-badge">{achv.label}</span>
                  </div>
                ))
              ) : (
                <div className="no-achievements">No achievements yet.</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetails;
