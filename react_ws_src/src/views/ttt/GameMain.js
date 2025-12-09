import React, { useState, useRef, useEffect } from 'react';
import TweenMax from 'gsap';
import rand_to_fro from '../../helpers/rand_to_fro';

const TicTacToe = ({ game_type, onEndGame }) => {
  const win_sets = [
    ['c1', 'c2', 'c3'],
    ['c4', 'c5', 'c6'],
    ['c7', 'c8', 'c9'],
    ['c1', 'c4', 'c7'],
    ['c2', 'c5', 'c8'],
    ['c3', 'c6', 'c9'],
    ['c1', 'c5', 'c9'],
    ['c3', 'c5', 'c7'],
  ];

  const [cell_vals, setCellVals] = useState({});
  const [next_turn_ply, setNextTurnPly] = useState(true);
  const [game_play, setGamePlay] = useState(true);
  const [game_stat, setGameStat] = useState('Start game');

  const refs = useRef({});

  useEffect(() => {
    TweenMax.from('#game_stat', 1, { opacity: 0, scaleX: 0, scaleY: 0, ease: Power4.easeIn });
    TweenMax.from('#game_board', 1, { opacity: 0, x: -200, y: -200, scaleX: 0, scaleY: 0, ease: Power4.easeIn });
  }, []);

  const cell_cont = (c) => (
    <div>
      {cell_vals[c] === 'x' && <i className="fa fa-times fa-5x"></i>}
      {cell_vals[c] === 'o' && <i className="fa fa-circle-o fa-5x"></i>}
    </div>
  );

  const click_cell = (e) => {
    if (!next_turn_ply || !game_play) return;
    const cell_id = e.currentTarget.id.substr(11);
    if (cell_vals[cell_id]) return;

    turn_ply_comp(cell_id);
  };

  const turn_ply_comp = (cell_id) => {
    setCellVals((prevVals) => {
      const new_vals = { ...prevVals, [cell_id]: 'x' };
      TweenMax.from(refs.current[cell_id], 0.7, { opacity: 0, scaleX: 0, scaleY: 0, ease: Power4.easeOut });

      const winner = checkWinner(new_vals);
      if (winner) {
        handleGameOver(winner);
      } else {
        setNextTurnPly(false);
        setTimeout(() => turn_comp(new_vals), rand_to_fro(300, 800));
      }

      return new_vals;
    });
  };

  const turn_comp = (vals_snapshot) => {
    const move = bestMoveMinimax(vals_snapshot);
    if (!move) return;

    setCellVals((prevVals) => {
      const new_vals = { ...prevVals, [move]: 'o' };
      TweenMax.from(refs.current[move], 0.7, { opacity: 0, scaleX: 0, scaleY: 0, ease: Power4.easeOut });

      const winner = checkWinner(new_vals);
      if (winner) handleGameOver(winner);

      setNextTurnPly(true);
      return new_vals;
    });
  };

  // ------------------------ AI with Minimax ------------------------
  const bestMoveMinimax = (vals) => {
    let bestScore = -Infinity;
    let move = null;
    for (let i = 1; i <= 9; i++) {
      const key = 'c' + i;
      if (!vals[key]) {
        const newVals = { ...vals, [key]: 'o' };
        const score = minimax(newVals, false);
        if (score > bestScore) {
          bestScore = score;
          move = key;
        }
      }
    }
    return move;
  };

  const minimax = (vals, isMaximizing) => {
    const winner = checkWinner(vals);
    if (winner) {
      if (winner === 'o') return 1;
      if (winner === 'x') return -1;
      if (winner === 'draw') return 0;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 1; i <= 9; i++) {
        const key = 'c' + i;
        if (!vals[key]) {
          const newVals = { ...vals, [key]: 'o' };
          const score = minimax(newVals, false);
          bestScore = Math.max(score, bestScore);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 1; i <= 9; i++) {
        const key = 'c' + i;
        if (!vals[key]) {
          const newVals = { ...vals, [key]: 'x' };
          const score = minimax(newVals, true);
          bestScore = Math.min(score, bestScore);
        }
      }
      return bestScore;
    }
  };

  const checkWinner = (vals) => {
    for (let set of win_sets) {
      if (vals[set[0]] && vals[set[0]] === vals[set[1]] && vals[set[0]] === vals[set[2]]) {
        return vals[set[0]];
      }
    }
    for (let i = 1; i <= 9; i++) if (!vals['c' + i]) return null;
    return 'draw';
  };

  const handleGameOver = (winner) => {
    let msg = '';
    if (winner === 'draw') msg = 'Draw!';
    else msg = winner === 'x' ? 'You win!' : 'Computer wins!';
    setGameStat(msg);
    setGamePlay(false);
  };

  const end_game = () => onEndGame();

  const restart_game = () => {
    setCellVals({});
    setNextTurnPly(true);
    setGamePlay(true);
    setGameStat('Start game');
  };

  return (
    <div id="GameMain">
      <h1>Play {game_type}</h1>

      <div id="game_stat">
        <div id="game_stat_msg">{game_stat}</div>
        {game_play && <div id="game_turn_msg">{next_turn_ply ? 'Your turn' : 'Computer turn'}</div>}
      </div>

      <div id="game_board">
        <table>
          <tbody>
            {['c1','c2','c3','c4','c5','c6','c7','c8','c9'].reduce((rows, cell, i) => {
              if (i % 3 === 0) rows.push([]);
              rows[rows.length - 1].push(cell);
              return rows;
            }, []).map((row, i) => (
              <tr key={i}>
                {row.map((cell) => (
                  <td
                    key={cell}
                    id={`game_board-${cell}`}
                    ref={(el) => (refs.current[cell] = el)}
                    onClick={click_cell}
                  >
                    {cell_cont(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ width: '65%', display: 'flex', justifyContent:'space-between'}}>
        <button type="submit" onClick={end_game} className="button">
          <span>End Game <span className="fa fa-caret-right"></span></span>
        </button>
        {!game_play && (
          <button type="submit" onClick={restart_game} className="button">
            <span>Restart <span className="fa fa-caret-right"></span></span>
          </button>
        )}
      </div>
    </div>
  );
};

export default TicTacToe;