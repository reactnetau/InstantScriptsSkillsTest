import React from 'react';
import { Link, useParams } from 'react-router-dom';
import X2JS from 'x2js';
import PropTypes from 'prop-types';

const Txt_page = () => {
  const { page } = useParams(); // gets the URL param from React Router v5
  const currentPage = page || 'home';
  const page_x = app.settings.ws_conf.pgs[currentPage];

  if (!page_x) return null;

  return (
    <section id="Txt_page">
      <div id="page-container">
        <h1>{page_x.pg_name}</h1>

        <div dangerouslySetInnerHTML={{ __html: page_x.txt.__cdata }} />

        <div className="btns">
          {new X2JS().asArray(page_x.btns.b).map((b, i) => (
            <Link to={b.u} key={i}>
              <button type="submit" className="button">
                <span>
                  {b.txt} <span className="fa fa-caret-right"></span>
                </span>
              </button>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

Txt_page.propTypes = {
  // useParams handles page now; no props needed
};

export default Txt_page;
