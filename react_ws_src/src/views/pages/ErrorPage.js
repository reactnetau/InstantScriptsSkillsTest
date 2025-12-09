import React from 'react';
import PopUp from '../layouts/PopUp';

const ErrorPage = () => {
  return (
    <PopUp pageTitle="Page Not Found">
      <h4>Error 404 - Page Not Found</h4>
      <p>Please check the link and try again.</p>
    </PopUp>
  );
};

export default ErrorPage;