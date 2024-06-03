import { EVENTS, subscribe } from './data.proxy.js';
import { Game } from './components/Game/game.component.js';

export async function rerender(e) {
  if (e.name === EVENTS.STATUS_CHANGED) {
    console.log('RERENDER');
    const rootElement = document.getElementById('root');

    rootElement.innerHTML = '';

    const gameWrapper = await Game();

    rootElement.append(gameWrapper.element);
  }
}

rerender({ name: EVENTS.STATUS_CHANGED });

subscribe(rerender);

const subscriber = (e) => {
  console.log(e);
};

subscribe(subscriber);
