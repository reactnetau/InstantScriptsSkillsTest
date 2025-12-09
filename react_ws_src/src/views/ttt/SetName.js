import React, { useContext, useRef } from 'react';
import { ApiContext } from '../../contexts/ApiContext';

const SetName = ({ onSetName }) => {
  const nameRef = useRef();
  const { createUser } = useContext(ApiContext);

  const saveName = () => {
    if (nameRef.current) {
      onSetName(nameRef.current.value.trim());
      createUser(nameRef.current.value.trim());
    }
  };

  return (
    <div id="SetName">
      <h1>Set Name</h1>

      <div className="input_holder left">
        <label>Name </label>
        <input
          ref={nameRef}
          type="text"
          className="input name"
          placeholder="Name"
        />
      </div>

      <button type="submit" onClick={saveName} className="button">
        <span>
          SAVE <span className="fa fa-caret-right"></span>
        </span>
      </button>
    </div>
  );
};

export default SetName;
