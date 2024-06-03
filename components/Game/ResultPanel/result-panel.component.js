import { EVENTS, getCatchCount, getMissCount, subscribe } from '../../../data.proxy.js';

export function ResultPanel() {
  async function render() {
    const catchCount = await getCatchCount();
    const missCount = await getMissCount();

    element.innerHTML = '';
    element.append(`PLAYER1: ${catchCount.player1}, PLAYER2: ${catchCount.player2}, MISS: ${missCount}`);
  }

  subscribe((e) => {
    if (e.name === EVENTS.SCORES_CHANGED) {
      render();
    }
  });

  const element = document.createElement('div');

  render();

  return { element, cleanup: () => {} };
}
