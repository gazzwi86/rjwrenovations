import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './containers/app/app';
import * as serviceWorker from './serviceWorker';
import './styles.css';

const root = document.getElementById('root');

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
, root);

// ReactDOM.createRoot(root).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
