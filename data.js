export const GAME_STATES = {
  SETTINGS: 'settings',
  IN_PROGRESS: 'in_progress',
  WIN: 'win',
  LOSE: 'lose',
};

const _data = {
  gameState: GAME_STATES.SETTINGS,
  settings: {
    gridSize: {
      x: 4,
      y: 4,
    },
    pointsToWin: 5,
    pointsToLose: 5,
  },
  catch: 0,
  miss: 0,
  time: new Date(),
  heroes: {
    google: {
      x: 0,
      y: 0,
    },
    player1: { x: 1, y: 1 },
    player2: { x: 2, y: 2 },
  },
};

let observer = () => {};

function changeGoogleCoords() {
  _data.heroes.google.x = getRandomInt(_data.settings.gridSize.x - 1);
  _data.heroes.google.y = getRandomInt(_data.settings.gridSize.y - 1);
}

/**
 *
 * @param max любое целое положительное число (которое будет генерировать значение от 0(включая) до этого числа)
 * @returns
 */
function getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

let jumpIntervalId;

function stopGoogleJump() {
  clearInterval(jumpIntervalId);
}

function runGoogleJump() {
  jumpIntervalId = setInterval(() => {
    changeGoogleCoords();
    _data.miss++;

    if (_data.miss === _data.settings.pointsToLose) {
      stopGoogleJump();
      _data.gameState = GAME_STATES.LOSE;
    }

    observer();
  }, 3000);
}

// setter / mutation / command
export function addEventListener(subscriber) {
  observer = subscriber;
}

export function setGridSize(x, y) {
  if (x < 1) throw new Error('Incorrect x grid size settings');
  if (y < 1) throw new Error('Incorrect y grid size settings');

  _data.settings.gridSize.x = x;
  _data.settings.gridSize.y = y;
}

export function start() {
  if (_data.gameState !== GAME_STATES.SETTINGS) {
    throw new Error('Game can not be started from state' + _data.gameState);
  }

  _data.gameState = GAME_STATES.IN_PROGRESS;
  runGoogleJump();
  observer();
}

export function playAgain() {
  _data.miss = 0;
  _data.catch = 0;

  _data.gameState = GAME_STATES.SETTINGS;
  observer();
}

export function catchGoogle() {
  stopGoogleJump();

  if (_data.catch === _data.settings.pointsToWin) {
    return;
  }

  _data.catch++;

  if (_data.catch === _data.settings.pointsToWin) {
    _data.gameState = GAME_STATES.WIN;
  } else {
    changeGoogleCoords();
    runGoogleJump();
  }

  observer();
}

// getter / selector / query / adapter

/**
 *
 * @returns количество баллов, заработанных пользователем
 */
export function getCatchCount() {
  return _data.catch;
}

export function getMissCount() {
  return _data.miss;
}

export function getGoogleCoords() {
  return { ..._data.heroes.google };
}

export function getGridSizeSettings() {
  return { ..._data.settings.gridSize };
}

export function getGameState() {
  return _data.gameState;
}
