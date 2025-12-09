import React from 'react';
import { renderToString } from 'react-dom/server';
import App from '../shared/App';

export function render(url: string) {
  // можно использовать url для роутинга на сервере
  return renderToString(<App />);
}
