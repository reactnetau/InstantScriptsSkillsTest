import React from 'react';
import Header from './layouts/Header';
import MainContent from './layouts/MainContent';
import Footer from './layouts/Footer';
import PropTypes from 'prop-types';

const fullHeightStyle = {
  height: '100%',
};

const Main = ({ children }) => {
  // Add semantic HTML & ARIA labels
  return (
    <div className="FullHeight" role="main">
      <Header />

      <MainContent role="article">{children}</MainContent>

      <Footer />
    </div>
  );
};

Main.propTypes = {
  children: PropTypes.node,
};

Main.defaultProps = {
  children: null,
};

export default Main;
