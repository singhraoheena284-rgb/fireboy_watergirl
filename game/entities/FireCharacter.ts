import { Character } from "./Character";
import type { Vec2 } from "../types/game";

export class FireCharacter extends Character {
  constructor(spawnPos: Vec2) {
    super("fire", spawnPos);
  }
}
