import getConfig from '../getConfig';

const initState = {
  UNINITIALIZED: 'UNINITIALIZED',
  INITIALIZED: 'INITIALIZED',
  WONT_INITIALIZE: 'WONT_INITIALIZE'
};

export default {
  state: initState.UNINITIALIZED,

  init() {
    if (this.state !== initState.UNINITIALIZED) {
      return;
    }
    if (getConfig().enableGA) {
      this.state = initState.INITIALIZED;
      console.info('GA Enabled');
      const gaScript = document.createElement('script');
      gaScript.setAttribute('async', 'true');
      gaScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=UA-131912391-1');
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      const gtag = function () { window.dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', 'UA-131912391-1');
    } else {
      this.state = initState.WONT_INITIALIZE;
      console.info('GA Disabled');
    }
  },

  sendEvent(options) {
    if (this.state === initState.INITIALIZED) {
      window.ga('send', 'event', options);
    }
  }
}
