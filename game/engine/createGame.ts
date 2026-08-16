import { GameLoop } from "./GameLoop";
import { getLevel } from "../levels";
import { InputManager } from "../input/InputManager";
import { Renderer } from "./Renderer";
import type { GameStats } from "../types/game";

export function createGame(
  canvas: HTMLCanvasElement,
  levelNumber: number,
  onStatsUpdate?: (stats: GameStats) => void
) {
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Canvas 2D context is unavailable.");
  }

  const input = new InputManager();
  const renderer = new Renderer(ctx, canvas);
  const level = getLevel(levelNumber);

  const loop = new GameLoop({
    canvas,
    ctx,
    input,
    renderer,
    level,
    onStatsUpdate
  });

  return {
    start: () => loop.start(),
    restart: () => loop.restartLevel(),
    destroy: () => loop.destroy()
  };
}
