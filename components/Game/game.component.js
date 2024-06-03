import { GAME_STATES, MOVING_DIRECTION, getGameState, movePlayer } from '../../data.proxy.js';
import { Win } from './Win/win.component.js';
import { Lose } from './Lose/lose.component.js';
import { ResultPanel } from './ResultPanel/result-panel.component.js';
import { Settings } from './Settings/settings.component.js';
import { GameGrid } from './GameGrid/game-grid.component.js';

document.addEventListener('keyup', (event) => {
  switch (event.code) {
    case 'ArrowLeft': {
      movePlayer(1, MOVING_DIRECTION.LEFT);
      break;
    }
    case 'ArrowRight': {
      movePlayer(1, MOVING_DIRECTION.RIGHT);
      break;
    }
    case 'ArrowUp': {
      movePlayer(1, MOVING_DIRECTION.UP);
      break;
    }
    case 'ArrowDown': {
      movePlayer(1, MOVING_DIRECTION.DOWN);
      break;
    }
    case 'KeyA': {
      movePlayer(2, MOVING_DIRECTION.LEFT);
      break;
    }
    case 'KeyD': {
      movePlayer(2, MOVING_DIRECTION.RIGHT);
      break;
    }
    case 'KeyW': {
      movePlayer(2, MOVING_DIRECTION.UP);
      break;
    }
    case 'KeyS': {
      movePlayer(2, MOVING_DIRECTION.DOWN);
      break;
    }
  }
});

// const recognition = new webkitSpeechRecognition();
// recognition.lang = 'en-US';
// recognition.continuous = true;
// recognition.onstart = () => {
//   console.log('Speech recognition started');
// };
// recognition.onresult = (event) => {
//   const word = event.results[event.results.length - 1][0].transcript;
//   console.log(word);

//   switch (word.trim()) {
//     case 'left': {
//       movePlayer(2, MOVING_DIRECTION.LEFT);
//       break;
//     }
//     case 'right': {
//       movePlayer(2, MOVING_DIRECTION.RIGHT);
//       break;
//     }
//     case 'up': {
//       movePlayer(2, MOVING_DIRECTION.UP);
//       break;
//     }
//     case 'down': {
//       movePlayer(2, MOVING_DIRECTION.DOWN);
//       break;
//     }
//   }
// };
// recognition.onend = () => {
//   console.log('Speech recognition ended');
// };

export async function Game() {
  const element = document.createElement('div');

  const gameState = await getGameState();

  switch (gameState) {
    case GAME_STATES.IN_PROGRESS:
      const resultPanelWrapper = ResultPanel();
      const gameGrid = await GameGrid();

      element.append(resultPanelWrapper.element, gameGrid);
      break;
    case GAME_STATES.SETTINGS:
      element.append(Settings());
      break;
    case GAME_STATES.WIN:
      element.append(Win());
      break;
    case GAME_STATES.LOSE:
      element.append(Lose());
      break;
    default: {
      throw new Error('Not supported state');
    }
  }

  return { element, cleanup: () => {} };
}
