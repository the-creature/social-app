import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import App from './app';

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <App />
    </AppContainer>,
    document.getElementById('app')
  );
};

render();

if (process.env.NODE_ENV !== 'production') {
  if (module.hot) {
    module.hot.accept('./app', () => requestAnimationFrame(() => render()));
  }
}
