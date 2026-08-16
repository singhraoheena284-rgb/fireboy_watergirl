import { Character } from "./Character";
import type { Vec2 } from "../types/game";

export class WaterCharacter extends Character {
  constructor(spawnPos: Vec2) {
    super("water", spawnPos);
  }
}
