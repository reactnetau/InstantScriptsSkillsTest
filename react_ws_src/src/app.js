
import React from 'react';
import ReactDOM from 'react-dom';

import ga from 'react-ga';

import './sass/main.scss';


import Main from './views/Main';
import Ttt from './views/ttt/Ttt';

import Txt_page from './views/pages/Txt_page';
import PopUp_page from './views/pages/PopUp_page';
import Contact from './views/pages/Contact';
import ErrorPage from './views/pages/ErrorPage';

import prep_env from './models/prep_env';
import app from 'ampersand-app';
import { Switch } from 'react-router';
import { BrowserRouter, Route } from 'react-router-dom/cjs/react-router-dom';
// ----------------------------------------------------------------------
// This section is used to configure the global app
// ----------------------------------------------------------------------

window.app = app
let renderSite = function () {
  return ReactDOM.render(
	  <BrowserRouter basename={base_dir}>
      <Main>
        <Switch>
          <Route exact path='/' render={() => <Txt_page />} />

          <Route path='/pg/:page?' render={() => <Txt_page />} />

          <Route path='/ttt' render={() => <Ttt />} />

          <Route path='/pupg/:pu_page?' render={() => <PopUp_page />} />

          <Route path='/contact-us' render={() => <Contact />} />

          <Route path='/error/404' render={() => <ErrorPage />} />

          <Route render={() => <ErrorPage />} />
        </Switch>
      </Main>
    </BrowserRouter>,
    document.getElementById('root')
  );
};
app.extend({

	settings: {
		is_mobile: false,
		mobile_type: null,
		can_app: false,

		ws_conf: null,

		curr_user: null,

		user_ready: false,
		user_types: [],
		basket_type: null,
		basket_total: 0,

	},


	init () {

		prep_env(this.start.bind(this))

	},

	start_ga() {
  // Initialize Google Analytics
  ga.initialize(app.settings.ws_conf.conf.ga_acc.an, { debug: true });

  // Record initial pageview
  ga.pageview(window.location.pathname + window.location.search);

  // Optional: track future page changes (if you switch pages programmatically)
  // You can add this later with a proper history object
},

	start () {
		this.start_ga();
		renderSite();
	},

	show_page (u) {
		switch(u) {
			case 'home':
				browserHistory.push('/')
				break

			default:
				console.log('show_page event with:', u) 
				browserHistory.push(u)
				break
		}
	},

	events: {
		show_message: 'show_message',
		show_page: 'show_page'
	},
})

app.init()

app.on(app.events.show_page, app.show_page)
