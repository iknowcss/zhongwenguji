import getConfig from '../getConfig';

export const initStateEnum = {
  UNINITIALIZED: 'UNINITIALIZED',
  INITIALIZED: 'INITIALIZED',
  WONT_INITIALIZE: 'WONT_INITIALIZE'
};

export default {
  state: initStateEnum.UNINITIALIZED,

  gtag() { /* noop */ },

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
      this.gtag = function () { window.dataLayer.push(arguments); };
      this.gtag('js', new Date());
      this.gtag('config', 'UA-131912391-1');
    } else {
      this.state = initStateEnum.WONT_INITIALIZE;
      console.log('GA Disabled');
    }
  },

  sendEvent(eventName, options) {
    if (this.state === initStateEnum.INITIALIZED) {
      this.gtag('event', eventName, options);
    }
  }
}
