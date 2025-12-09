import React from 'react';
import PropTypes from 'prop-types';

const MainContent = ({ children }) => {
  return (
    <section id='main_content'>
      <div className='main_container'>
        {children}
      </div>
    </section>
  );
};

MainContent.propTypes = {
  children: PropTypes.any,
};

export default MainContent;