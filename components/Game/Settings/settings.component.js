import { start } from '../../../data.proxy.js';

export function Settings() {
  const element = document.createElement('div');

  const startButton = document.createElement('button');
  startButton.append('Start');

  startButton.addEventListener('click', () => {
    start();
  });

  element.append(startButton);

  return element;
}
