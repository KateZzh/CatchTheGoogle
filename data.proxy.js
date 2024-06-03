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

const evtSource = new EventSource('http://localhost:3000/events');

evtSource.addEventListener('message', (event) => {
  const data = JSON.parse(event.data);
  _notify(data.name);
  console.log(event.data);
});

// setter / mutation / command

export function subscribe(subscriber) {
  _subscribers.push(subscriber);
}

export function unsubscribe(subscriber) {
  _subscribers = _subscribers.filter((s) => s !== subscriber);
}

export function setGridSize(x, y) {
  fetch('http://localhost:3000/setGridSize', {
    method: 'put',
    body: JSON.stringify({ x, y }),
    headers: {
      'content-type': 'application/json',
    },
  });
}

export function start() {
  fetch('http://localhost:3000/start', { method: 'put' });
}

export function playAgain() {
  fetch('http://localhost:3000/playAgain', { method: 'put' });
}

// getter / selector / query / adapter

export function movePlayer(playerNumber, direction) {
  fetch('http://localhost:3000/movePlayer', {
    method: 'put',
    body: JSON.stringify({ playerNumber, direction }),
    headers: {
      'content-type': 'application/json',
    },
  });
}

/**
 *
 * @returns количество баллов, заработанных пользователем
 */
export async function getCatchCount() {
  const response = await fetch('http://localhost:3000/getCatchCount');
  const data = await response.json();
  return data;
}

export async function getMissCount() {
  const response = await fetch('http://localhost:3000/getMissCount');
  const data = await response.json();
  return data.value;
}

export async function getGoogleCoords() {
  const response = await fetch('http://localhost:3000/getGoogleCoords');
  const data = await response.json();
  return data;
}

export async function getPlayer1Coords() {
  const response = await fetch('http://localhost:3000/getPlayer1Coords');
  const data = await response.json();
  return data;
}

export async function getPlayer2Coords() {
  const response = await fetch('http://localhost:3000/getPlayer2Coords');
  const data = await response.json();
  return data;
}

export async function getGridSizeSettings() {
  const response = await fetch('http://localhost:3000/getGridSizeSettings');
  const data = await response.json();
  return data;
}

export async function getGameState() {
  const response = await fetch('http://localhost:3000/getGameState');
  const data = await response.json();
  return data.value;
}

export function validatePlayerNumberOrThrow(playerNumber) {
  if (![1, 2].some((number) => number === playerNumber)) {
    throw new Error('Incorrect player number');
  }
}
