import { addEventListener } from './data.js';
import { Game } from './components/Game/game.component.js';

export function rerender() {
  const rootElement = document.getElementById('root');

  rootElement.innerHTML = '';

  const game = Game();
  rootElement.append(game);
}

rerender();

addEventListener(rerender);
