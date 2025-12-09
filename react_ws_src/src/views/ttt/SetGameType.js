import React from 'react';

const SetGameType = ({ onSetType }) => {
  const selTypeLive = () => {
    onSetType('live');
  };

  const selTypeComp = () => {
    onSetType('comp');
  };

  return (
    <div id="SetGameType">
      <h1>Choose game type</h1>
      <button type="submit" onClick={selTypeLive} className="button long">
        <span>
          Live against another player{' '}
          <span className="fa fa-caret-right"></span>
        </span>
      </button>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <button type="submit" onClick={selTypeComp} className="button long">
        <span>
          Against a computer <span className="fa fa-caret-right"></span>
        </span>
      </button>
    </div>
  );
};

export default SetGameType;
