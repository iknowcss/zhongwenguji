import getConfig from '../getConfig';

export const initStateEnum = {
  UNINITIALIZED: 'UNINITIALIZED',
  INITIALIZED: 'INITIALIZED',
  WONT_INITIALIZE: 'WONT_INITIALIZE'
};

export default {
  state: initStateEnum.UNINITIALIZED,

  init() {
    if (this.state !== initStateEnum.UNINITIALIZED) {
      return;
    }
    if (getConfig().enableGA) {
      this.state = initStateEnum.INITIALIZED;
      console.log('GA Enabled');
      const gaScript = document.createElement('script');
      gaScript.setAttribute('async', 'true');
      gaScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=UA-131912391-1');
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      const gtag = function () { window.dataLayer.push(arguments); };
      gtag('js', new Date());
      gtag('config', 'UA-131912391-1');
    } else {
      this.state = initStateEnum.WONT_INITIALIZE;
      console.log('GA Disabled');
    }
  },

  sendEvent(options) {
    if (this.state === initStateEnum.INITIALIZED) {
      window.ga('send', 'event', options);
    }
  }
}
