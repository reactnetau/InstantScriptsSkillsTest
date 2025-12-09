import superagent from 'superagent';
import X2JS from 'x2js';

import '../../static/ws_conf.xml';

const MAX_RETRIES = 3; // number of retries
const RETRY_DELAY = 1000; // 1 second delay between retries

const prep_env = function (callback) {
  const call_after = callback;

  set_settings();
  load_conf(MAX_RETRIES);

  // ----------------------------

  async function load_conf(retriesLeft) {
    try {
      const res = await superagent.get(conf_file);

      if (!res.ok) throw new Error('Response not OK');

      const x2js = new X2JS({ attributePrefix: '' });
      const conf_json = x2js.xml2js(res.text);

      app.settings.ws_conf = conf_json.data;
      console.log(
        'Loaded site configuration',
        app.settings.ws_conf.site.vals.year,
      );

      prep_site();
    } catch (err) {
      console.error('Error loading site configuration:', err);

      if (retriesLeft > 0) {
        console.log(`Retrying... (${retriesLeft} attempts left)`);
        setTimeout(() => load_conf(retriesLeft - 1), RETRY_DELAY);
      } else {
        alert("Can't load site configuration after multiple attempts.");
      }
    }
  }

  // ----------------------------

  function set_settings() {
    // Flash detection
    if ('ActiveXObject' in window) {
      try {
        app.settings.hasFlash = !!new ActiveXObject(
          'ShockwaveFlash.ShockwaveFlash',
        );
      } catch (e) {
        app.settings.hasFlash = false;
      }
    } else {
      app.settings.hasFlash =
        !!navigator.mimeTypes['application/x-shockwave-flash'];
    }

    // Mobile detection
    const ua = navigator.userAgent;
    app.settings.is_mobile =
      /Android/i.test(ua) ||
      /iPad|iPhone|iPod/i.test(ua) ||
      /webOS|BlackBerry|Windows Phone|Opera Mini|IEMobile|windows mobile/i.test(
        ua,
      );

    if (app.settings.is_mobile) {
      app.settings.mobile_type = /Android/i.test(ua)
        ? 'Android'
        : /iPad|iPhone|iPod/i.test(ua)
          ? 'iOS'
          : null;
    }

    app.settings.can_app = !!app.settings.mobile_type;
    app.settings.couldHaveFlash = !app.settings.is_mobile;
  }

  // ----------------------------

  function prep_site() {
    call_after();
  }
};

export default prep_env;
