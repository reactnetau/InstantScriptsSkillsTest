import React, { useState, useEffect, useRef } from 'react';
import jquery from 'jquery';

const MessageBar = () => {
  const [msgs, setMsgs] = useState([]);
  const msgBarRef = useRef(null);

  useEffect(() => {
    // Subscribe to app messages on mount
    const handleMessage = (h, m) => {
      setMsgs((prevMsgs) => [...prevMsgs, { h: unescape(h), m: unescape(m) }]);
      if (msgBarRef.current) {
        jquery(msgBarRef.current).slideDown();
      }
    };

    app.on(app.events.show_message, handleMessage);

    // Cleanup subscription on unmount
    return () => {
      app.off(app.events.show_message, handleMessage);
    };
  }, []);

  const closeWindow = () => {
    setMsgs([]);
    if (msgBarRef.current) {
      jquery(msgBarRef.current).slideUp();
    }
  };

  if (msgs.length === 0) return null;

  return (
    <div id='msg_bar' ref={msgBarRef}>
      <div className='container'>
        <div>
          {msgs.map((m, i) => (
            <p className='one_line' key={i}>
              <span className='exclaim'>{m.h.length > 1 ? m.h + ' : ' : ''}</span>
              {m.m}
              <br />
            </p>
          ))}
          <a className='close fa fa-close' onClick={closeWindow}></a>
        </div>
      </div>
    </div>
  );
};

export default MessageBar;