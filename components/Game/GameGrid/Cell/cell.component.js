import { EVENTS, getGoogleCoords, getPlayer1Coords, getPlayer2Coords, subscribe } from '../../../../data.proxy.js';
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

  async function render() {
    const googleCoords = await getGoogleCoords();
    const player1Coords = await getPlayer1Coords();
    const player2Coords = await getPlayer2Coords();
    // Promise.all
    
    cell.innerHTML = '';
    console.log(x, y);

    if (x === googleCoords.x && y === googleCoords.y) {
      cell.append(Google());
      state.prevStatus = CELL_STATUS.GOOGLE;
    } else if (x === player1Coords.x && y === player1Coords.y) {
      cell.append(Player(1));
      state.prevStatus = CELL_STATUS.PLAYER1;
    } else if (x === player2Coords.x && y === player2Coords.y) {
      cell.append(Player(2));
      state.prevStatus = CELL_STATUS.PLAYER2;
    } else {
      state.prevStatus = CELL_STATUS.EMPTY;
    }
  }

  subscribe(async (e) => {
    const googleCoords = await getGoogleCoords();
    const player1Coords = await getPlayer1Coords();
    const player2Coords = await getPlayer2Coords();
    
    const transition = {
      [EVENTS.GOOGLE_JUMPED]: {
        [CELL_STATUS.GOOGLE]: render,
        [CELL_STATUS.EMPTY]: () => {
          if (x === googleCoords.x && y === googleCoords.y) {
            render();
          }
        },
      },
      [EVENTS.PLAYER1_MOVED]: {
        [CELL_STATUS.PLAYER1]: render,
        [CELL_STATUS.GOOGLE]: () => {
          if (x === player1Coords.x && y === player1Coords.y) {
            render();
          }
        },
        [CELL_STATUS.EMPTY]: () => {
          if (x === player1Coords.x && y === player1Coords.y) {
            render();
          }
        },
      },
      [EVENTS.PLAYER2_MOVED]: {
        [CELL_STATUS.PLAYER2]: render,
        [CELL_STATUS.GOOGLE]: () => {
          if (x === player2Coords.x && y === player2Coords.y) {
            render();
          }
        },
        [CELL_STATUS.EMPTY]: () => {
          if (x === player2Coords.x && y === player2Coords.y) {
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
