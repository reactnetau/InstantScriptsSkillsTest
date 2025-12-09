import React, { useState, useEffect } from 'react';

import SetName from './SetName';
import SetGameType from './SetGameType';
import GameMain from './GameMain';

const Ttt = () => {
  const [gameStep, setGameStep] = useState('set_name');
  const [gameType, setGameType] = useState(null);
  const [, forceUpdate] = useState(0); // optional, to force re-render when app.settings changes

  // Determine the current game step based on app settings
  const determineGameStep = () => {
    if (!app.settings.curr_user || !app.settings.curr_user.name)
      return 'set_name';
    if (!gameType) return 'set_game_type';
    return 'start_game';
  };

  useEffect(() => {
    setGameStep(determineGameStep());
  }, [gameType]);

  const saveUserName = (name) => {
    app.settings.curr_user = { name };
    setGameStep(determineGameStep());
    forceUpdate((n) => n + 1); // force update if needed for app.settings.curr_user change
  };

  const saveGameType = (type) => {
    setGameType(type);
    setGameStep(determineGameStep());
  };

  const gameEnd = () => {
    setGameType(null);
    setGameStep(determineGameStep());
  };

  return (
    <section id="TTT_game">
      <div id="page-container">
        {gameStep === 'set_name' && <SetName onSetName={saveUserName} />}

        {gameStep !== 'set_name' && (
          <div>
            <h2>
              Welcome, {app.settings.curr_user && app.settings.curr_user.name}
            </h2>
          </div>
        )}

        {gameStep === 'set_game_type' && (
          <SetGameType onSetType={saveGameType} />
        )}

        {gameStep === 'start_game' && (
          <GameMain game_type={gameType} onEndGame={gameEnd} />
        )}
      </div>
    </section>
  );
};

export default Ttt;
