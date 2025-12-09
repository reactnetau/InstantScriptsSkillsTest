import React, { useState } from 'react';

const UserDetails = ({ user }) => {
    const [view, setView] = useState('scoreboard');

    return (
        <div className="user-details">
            <div className="nav-tabs">
                <button 
                    className={view === 'scoreboard' ? 'active' : ''} 
                    onClick={() => setView('scoreboard')}
                >
                    <strong>Scoreboard</strong>
                </button>

                <button 
                    className={view === 'graphs' ? 'active' : ''} 
                    onClick={() => setView('graphs')}
                >
                    <strong>Graphs</strong>
                </button>

                <button 
                    className={view === 'achievements' ? 'active' : ''} 
                    onClick={() => setView('achievements')}
                >
                    <strong>Achievements</strong>
                </button>
            </div>

            <div className="content">
                {view === 'scoreboard' && <div>Scoreboard content...</div>}
                {view === 'graphs' && <div>Graphs content...</div>}
                {view === 'achievements' && <div>Achievements content...</div>}
            </div>
        </div>
    );
};

export default UserDetails;