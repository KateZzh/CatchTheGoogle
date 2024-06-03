import { validatePlayerNumberOrThrow } from '../../../../../data.proxy.js';

export function Player(playerNumber) {
  const element = document.createElement('img');

  validatePlayerNumberOrThrow(playerNumber);

  element.src = `assets/images/player${playerNumber}.svg`;

  element.style = { width: '48px', height: '48px' };

  return element;
}
