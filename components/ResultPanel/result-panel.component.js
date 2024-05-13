import { getCatchCount, getMissCount } from "../../data.js";

export function ResultPanel() {
  const element = document.createElement('div');

  element.append(`CATCH: ${getCatchCount()} MISS: ${getMissCount()}`);

  return element;
}