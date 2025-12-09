import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Motion, spring } from 'react-motion';
import getBodyHeight from '../../helpers/getBodyHeight';
import PropTypes from 'prop-types';

const PopUp = ({ pageTitle, children }) => {
  const [bodyHeight, setBodyHeight] = useState(0);
  const [closing, setClosing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const history = useHistory();

  useEffect(() => {
    setBodyHeight(getBodyHeight() + 200);
    setMounted(true);
  }, []);

  const closeMe = () => {
    setClosing(true);
    history.push('/');
  };

  if (!mounted) return null;

  const bottom = closing ? -bodyHeight : 0;
  const springValue = [120, 15];

  return (
    <Motion
      defaultStyle={{ bottom: -bodyHeight }}
      style={{ bottom: spring(bottom, springValue) }}
    >
      {(value) => (
        <section id='simple_popup' style={{ bottom: value.bottom }}>
          <div className='container'>
            <a className='close fa fa-close' onClick={closeMe}></a>
            <h3>{pageTitle}</h3>
          </div>
          <div className='content'>
            <div className='container'>{children}</div>
          </div>
        </section>
      )}
    </Motion>
  );
};

PopUp.propTypes = {
  pageTitle: PropTypes.string,
  children: PropTypes.any,
};

export default PopUp;