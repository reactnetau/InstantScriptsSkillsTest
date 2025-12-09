import React from 'react';
import PopUp from '../layouts/PopUp';
import PropTypes from 'prop-types';

const PopUp_page = ({ params }) => {
  const { pu_page } = params;
  const page_x = app.settings.ws_conf.pgs[pu_page];

  if (!pu_page || !page_x) return null;

  return (
    <PopUp pageTitle={page_x.pg_name}>
      <div dangerouslySetInnerHTML={{ __html: page_x.__cdata }} />
    </PopUp>
  );
};

PopUp_page.propTypes = {
  params: PropTypes.any,
};

export default PopUp_page;
