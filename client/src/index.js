import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import 'whatwg-fetch';
import getConfig from './getConfig';
import './index.css';
import App from './App';
import { store } from './store';
import * as serviceWorker from './serviceWorker';

/// - GA -------------------------------------------------------------------------------------------

if (getConfig().enableGA) {
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
  console.info('GA Disabled');
}

/// - /GA ------------------------------------------------------------------------------------------

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
