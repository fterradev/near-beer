import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import registerServiceWorker from './registerServiceWorker';
import breweries from './reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';

ReactDOM.render(
  <Provider store={createStore(breweries, applyMiddleware(thunk))}>
    <App />
  </Provider>,
  document.getElementById('root')
);
registerServiceWorker();
