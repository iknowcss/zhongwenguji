import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import analyticsService from './analytics/analyticsService';
import 'whatwg-fetch';
import './index.css';
import App from './App';
import { store } from './store';
import * as serviceWorker from './serviceWorker';

analyticsService.init();

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
