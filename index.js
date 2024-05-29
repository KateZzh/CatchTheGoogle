import { EVENTS, subscribe } from './data.js';
import { Game } from './components/Game/game.component.js';

export function rerender(e) {
  if (e.name === EVENTS.STATUS_CHANGED) {
    console.log('RERENDER');
    const rootElement = document.getElementById('root');

    rootElement.innerHTML = '';

    const game = Game();

    rootElement.append(game);
  }
}

rerender({ name: EVENTS.STATUS_CHANGED });

subscribe(rerender);

const subscriber = (e) => {
  console.log(e);
};

subscribe(subscriber);
