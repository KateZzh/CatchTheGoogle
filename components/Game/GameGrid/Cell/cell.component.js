import { EVENTS, getGoogleCoords, getPlayer1Coords, getPlayer2Coords, subscribe } from '../../../../data.js';
import { Google } from './Google/google.component.js';
import { Player } from './Player/player.component.js';

const CELL_STATUS = {
  EMPTY: 1,
  GOOGLE: 2,
  PLAYER1: 3,
  PLAYER2: 4,
};

export function Cell(x, y) {
  const state = {
    prevStatus: CELL_STATUS.EMPTY,
  };

  function render() {
    console.log(x, y);

    cell.innerHTML = '';

    if (x === getGoogleCoords().x && y === getGoogleCoords().y) {
      cell.append(Google());
      state.prevStatus = CELL_STATUS.GOOGLE;
    } else if (x === getPlayer1Coords().x && y === getPlayer1Coords().y) {
      cell.append(Player(1));
      state.prevStatus = CELL_STATUS.PLAYER1;
    } else if (x === getPlayer2Coords().x && y === getPlayer2Coords().y) {
      cell.append(Player(2));
      state.prevStatus = CELL_STATUS.PLAYER2;
    } else {
      state.prevStatus = CELL_STATUS.EMPTY;
    }
  }

  subscribe((e) => {
    const transition = {
      [EVENTS.GOOGLE_JUMPED]: {
        [CELL_STATUS.GOOGLE]: render,
        [CELL_STATUS.EMPTY]: () => {
          if (x === getGoogleCoords().x && y === getGoogleCoords().y) {
            render();
          }
        },
      },
      [EVENTS.PLAYER1_MOVED]: {
        [CELL_STATUS.PLAYER1]: render,
        [CELL_STATUS.GOOGLE]: () => {
          if (x === getPlayer1Coords().x && y === getPlayer1Coords().y) {
            render();
          }
        },
        [CELL_STATUS.EMPTY]: () => {
          if (x === getPlayer1Coords().x && y === getPlayer1Coords().y) {
            render();
          }
        },
      },
      [EVENTS.PLAYER2_MOVED]: {
        [CELL_STATUS.PLAYER2]: render,
        [CELL_STATUS.GOOGLE]: () => {
          if (x === getPlayer2Coords().x && y === getPlayer2Coords().y) {
            render();
          }
        },
        [CELL_STATUS.EMPTY]: () => {
          if (x === getPlayer2Coords().x && y === getPlayer2Coords().y) {
            render();
          }
        },
      },
    };

    transition[e.name]?.[state.prevStatus]?.();
  });

  const cell = document.createElement('td');

  render();

  return cell;
}
