import { h, render } from 'preact';
import 'preact/devtools';
import App from './App.js';
import './index.css';
import { Provider } from 'react-redux';
import store from './store/store';
import { bindSocketMessagesToStore } from './networking/socket-message-to-store';

const root = document.getElementById('root');

bindSocketMessagesToStore();

if (root) {
  render(
    <Provider store={store}>
      <App />
    </Provider>,
    root,
  );
}
