import { EVENTS, getCatchCount, getMissCount, subscribe } from '../../../data.js';

export function ResultPanel() {
  function render() {
    element.innerHTML = '';
    element.append(`PLAYER1: ${getCatchCount().player1}, PLAYER2: ${getCatchCount().player2}, MISS: ${getMissCount()}`);
  }

  subscribe((e) => {
    if (e.name === EVENTS.SCORES_CHANGED) {
      render();
    }
  });

  const element = document.createElement('div');

  render();

  return element;
}
