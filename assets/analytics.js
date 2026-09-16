/*
 * ARELO-357 — shared, privacy-conscious analytics helper for myarelo.com and the static Gemma
 * demo. Approved Product Office decision (Jira ARELO-357, comment 15055): a cookieless,
 * script-tag analytics platform in the Plausible/Fathom family — no Google Tag Manager unless
 * unavoidable, no personal data, no raw free text ever leaves the browser as an event property.
 *
 * BLOCKED ON AN EXTERNAL DEPENDENCY (Jira ARELO-357, comment 15057):
 * loading the real provider script requires a site registered under Shani's own analytics
 * account, and this file must not invent a placeholder domain/site id. Until
 * ARELO_ANALYTICS_DOMAIN below is set to that real value, every track() call in this codebase
 * is a safe no-op — the instrumentation is fully wired and ready to go live the moment the site
 * identifier is supplied; nothing needs to change at any call site.
 *
 * Loaded on every public page (index.html, /demo, coming-soon.html, feedback.html) before any
 * other inline script that calls window.AreloAnalytics.
 */
(function (window, document) {
  'use strict';

  // TODO(Shani): set this to the registered Plausible site domain (e.g. 'myarelo.com') once that
  // account/site exists, then this file will start loading the real tracking script. Do not fill
  // this in with a guessed or placeholder value — see Jira ARELO-357 comment 15057.
  var ARELO_ANALYTICS_DOMAIN = null;

  var providerLoaded = false;
  function ensureProviderLoaded() {
    if (providerLoaded || !ARELO_ANALYTICS_DOMAIN) return;
    providerLoaded = true;
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', ARELO_ANALYTICS_DOMAIN);
    s.src = 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
  }
  ensureProviderLoaded();

  // Dedupe for "destination viewed" — switching persona always re-selects the Focus tab even
  // when Focus was already showing, and this stops that from ever double-firing the same
  // destination_viewed event back to back (Jira ARELO-357, comment 15055).
  var _lastDestination = null;

  // Defence in depth: track() is the only path event data can reach the analytics provider
  // through, so this strips anything that isn't a plain string/number/boolean even if a call
  // site accidentally passed something richer (e.g. an Orb pending-interpretation object).
  // Free text and item arrays must never reach this function in the first place — call sites
  // are written to only ever pass safe scenario ids/labels — but this is a second line of
  // defence, not the only one.
  function safeProps(props) {
    if (!props) return undefined;
    var out = {};
    Object.keys(props).forEach(function (k) {
      var v = props[k];
      if (typeof v === 'string' || typeof v === 'number' || typeof v === 'boolean') {
        out[k] = v;
      }
    });
    return out;
  }

  function track(name, props) {
    var clean = safeProps(props);
    if (!ARELO_ANALYTICS_DOMAIN || typeof window.plausible !== 'function') {
      if (window.__ARELO_ANALYTICS_DEBUG) {
        // eslint-disable-next-line no-console
        console.info('[analytics:noop]', name, clean || {});
      }
      return;
    }
    window.plausible(name, clean ? { props: clean } : undefined);
  }

  // Convenience wrapper for the "destination viewed" funnel event with built-in dedupe.
  function trackDestination(tab, extra) {
    if (tab === _lastDestination) return;
    _lastDestination = tab;
    var props = Object.assign({ tab: tab }, extra || {});
    track('Destination viewed', props);
  }

  window.AreloAnalytics = {
    track: track,
    trackDestination: trackDestination
  };
})(window, document);
