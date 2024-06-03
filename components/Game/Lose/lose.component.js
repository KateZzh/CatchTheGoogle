import { playAgain } from '../../../data.proxy.js';

export function Lose() {
  const element = document.createElement('div');

  element.append('You lose!');

  const playAgainButton = document.createElement('button');
  playAgainButton.append('Play Again');

  playAgainButton.addEventListener('click', () => {
    playAgain();
  });

  element.append(playAgainButton);

  return element;
}
