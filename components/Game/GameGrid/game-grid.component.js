import { getGridSizeSettings } from '../../../data.proxy.js';
import { Cell } from './Cell/cell.component.js';

export async function GameGrid() {
  const gridElement = document.createElement('table');

  const gridSize = await getGridSizeSettings();

  for (let y = 0; y < gridSize.y; y++) {
    const row = document.createElement('tr');

    for (let x = 0; x < gridSize.x; x++) {
      const cell = Cell(x, y);

      row.append(cell);
    }

    gridElement.append(row);
  }

  return gridElement;
}
