export const EVENTS = {
  GOOGLE_JUMPED: 'GOOGLE_JUMPED',
  PLAYER1_MOVED: 'PLAYER1_MOVED',
  PLAYER2_MOVED: 'PLAYER2_MOVED',
  STATUS_CHANGED: 'STATUS_CHANGED',
  SCORES_CHANGED: 'SCORES_CHANGED',
};

export const GAME_STATES = {
  SETTINGS: 'settings',
  IN_PROGRESS: 'in_progress',
  WIN: 'win',
  LOSE: 'lose',
};

export const MOVING_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
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
    googleJumpInterval: 4000,
  },
  catch: {
    player1: 0,
    player2: 0,
  },
  miss: 0,
  time: new Date(),
  heroes: {
    google: { x: 0, y: 0 },
    player1: { x: 1, y: 1 },
    player2: { x: 2, y: 2 },
  },
};

let _subscribers = [];

function _notify(eventName) {
  _subscribers.forEach((s) => {
    try {
      const event = { name: eventName };
      s(event);
    } catch (error) {
      console.error(error);
    }
  });
}

function _changeGoogleCoords() {
  let newX;
  let newY;

  do {
    newX = _getRandomInt(_data.settings.gridSize.x - 1);
    newY = _getRandomInt(_data.settings.gridSize.y - 1);
  } while (
    (newX === _data.heroes.player1.x && newY === _data.heroes.player1.y) ||
    (newX === _data.heroes.player2.x && newY === _data.heroes.player2.y) ||
    (_data.heroes.google.x === newX && _data.heroes.google.y === newY)
  );

  _data.heroes.google.x = newX;
  _data.heroes.google.y = newY;
}

/**
 *
 * @param max любое целое положительное число (которое будет генерировать значение от 0(включая) до этого числа)
 * @returns
 */
function _getRandomInt(max) {
  return Math.floor(Math.random() * (max + 1));
}

let _jumpIntervalId;

function _stopGoogleJump() {
  clearInterval(_jumpIntervalId);
}

function _runGoogleJump() {
  _jumpIntervalId = setInterval(() => {
    _changeGoogleCoords();
    _notify(EVENTS.GOOGLE_JUMPED);

    _data.miss++;
    _notify(EVENTS.SCORES_CHANGED);

    if (_data.miss === _data.settings.pointsToLose) {
      _stopGoogleJump();
      _data.gameState = GAME_STATES.LOSE;
      _notify(EVENTS.STATUS_CHANGED);

      _changeGoogleCoords();
      _notify(EVENTS.GOOGLE_JUMPED);
    }
  }, _data.settings.googleJumpInterval);
}

function _catchGoogle(playNumber) {
  _stopGoogleJump();

  _data.catch[`player${playNumber}`]++;
  _notify(EVENTS.SCORES_CHANGED);

  if (_data.catch[`player${playNumber}`] === _data.settings.pointsToWin) {
    _data.gameState = GAME_STATES.WIN;
    _changeGoogleCoords();
    _notify(EVENTS.STATUS_CHANGED);
  } else {
    _changeGoogleCoords();
    _notify(EVENTS.GOOGLE_JUMPED);
    _runGoogleJump();
  }
}

function _checkIsCoordInValidRange(coords) {
  const xIsCorrect = coords.x >= 0 && coords.x < _data.settings.gridSize.x;
  const yIsCorrect = coords.y >= 0 && coords.y < _data.settings.gridSize.y;

  return xIsCorrect && yIsCorrect;
}

function _coordsMatchWithAnotherPlayer(coords) {
  const player1IsInThisCell = coords.x === _data.heroes.player1.x && coords.y === _data.heroes.player1.y;
  const player2IsInThisCell = coords.x === _data.heroes.player2.x && coords.y === _data.heroes.player2.y;

  return player1IsInThisCell || player2IsInThisCell;
}

function _coordsMatchWithGoogle(coords) {
  const googleIsInThisCell = coords.x === _data.heroes.google.x && coords.y === _data.heroes.google.y;

  return googleIsInThisCell;
}

// setter / mutation / command

export function subscribe(subscriber) {
  _subscribers.push(subscriber);
}

export function unsubscribe(subscriber) {
  _subscribers = _subscribers.filter((s) => s !== subscriber);
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
  _notify(EVENTS.STATUS_CHANGED);
  _runGoogleJump();
}

export function playAgain() {
  _data.miss = 0;
  _data.catch.player1 = 0;
  _data.catch.player2 = 0;
  _notify(EVENTS.SCORES_CHANGED);

  _data.gameState = GAME_STATES.SETTINGS;
  _notify(EVENTS.STATUS_CHANGED);
}

// getter / selector / query / adapter

export function movePlayer(playerNumber, direction) {
  validatePlayerNumberOrThrow(playerNumber);

  if (_data.gameState !== GAME_STATES.IN_PROGRESS) {
    return;
  }

  const newCoords = { ..._data.heroes[`player${playerNumber}`] };

  switch (direction) {
    case MOVING_DIRECTION.LEFT: {
      newCoords.x--;
      break;
    }
    case MOVING_DIRECTION.RIGHT: {
      newCoords.x++;
      break;
    }
    case MOVING_DIRECTION.UP: {
      newCoords.y--;
      break;
    }
    case MOVING_DIRECTION.DOWN: {
      newCoords.y++;
      break;
    }
  }

  const isValid = _checkIsCoordInValidRange(newCoords);
  if (!isValid) return;

  const isMatchWithAnotherPlayer = _coordsMatchWithAnotherPlayer(newCoords);
  if (isMatchWithAnotherPlayer) return;

  const isMatchWithGoogle = _coordsMatchWithGoogle(newCoords);
  if (isMatchWithGoogle) {
    _catchGoogle(playerNumber);
  }

  _data.heroes[`player${playerNumber}`] = newCoords;

  _notify(EVENTS[`PLAYER${playerNumber}_MOVED`]);
}

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

export function getPlayer1Coords() {
  return { ..._data.heroes.player1 };
}

export function getPlayer2Coords() {
  return { ..._data.heroes.player2 };
}

export function getGridSizeSettings() {
  return { ..._data.settings.gridSize };
}

export function getGameState() {
  return _data.gameState;
}

export function validatePlayerNumberOrThrow(playerNumber) {
  if (![1, 2].some((number) => number === playerNumber)) {
    throw new Error('Incorrect player number');
  }
}
