import express from 'express';
import cors from 'cors';
import {
  getGoogleCoords,
  start,
  getGameState,
  getGridSizeSettings,
  getPlayer1Coords,
  getPlayer2Coords,
  getCatchCount,
  getMissCount,
  movePlayer,
  setGridSize,
  subscribe,
  playAgain,
  unsubscribe,
} from './data.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/events', (req, res) => {
  res.header('Content-Type', 'text/event-stream');
  res.header('Cache-Control', 'no-cache');
  res.header('Connection', 'keep-alive');

  // res.write(`data: ${JSON.stringify({
  //     name: 'PLAYER_NUMBER_DETECTED',
  //     payload: 1,
  //   })}\n\n`);

  const handler = (event) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  subscribe(handler);

  req.on('close', () => {
    unsubscribe(handler);
    res.end();
  });
});

app.put('/setGridSize', (req, res) => {
  setGridSize(req.body.x, req.body.y);
  res.send(200);
});

app.put('/movePlayer', (req, res) => {
  movePlayer(req.body.playerNumber, req.body.direction);
  res.send(200);
});

app.put('/start', (req, res) => {
  start();
  res.send(200);
});

app.put('/playAgain', (req, res) => {
  playAgain();
  res.send(200);
});

app.get('/getCatchCount', (req, res) => {
  res.send(getCatchCount());
});

app.get('/getMissCount', (req, res) => {
  res.send({ value: getMissCount() });
});

app.get('/getGoogleCoords', (req, res) => {
  res.send(getGoogleCoords());
});

app.get('/getPlayer1Coords', (req, res) => {
  res.send(getPlayer1Coords());
});

app.get('/getPlayer2Coords', (req, res) => {
  res.send(getPlayer2Coords());
});

app.get('/getGridSizeSettings', (req, res) => {
  res.send(getGridSizeSettings());
});

app.get('/getGameState', (req, res) => {
  res.send({ value: getGameState() });
});

app.listen(3000, () => {
  console.log('server is running on port 3000');
});
