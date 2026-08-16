import { createLevel1 } from "./level1";
import { createLevel2 } from "./level2";
import { createLevel3 } from "./level3";
import type { Level } from "../types/game";

export function getLevel(levelNumber: number): Level {
  switch (levelNumber) {
    case 1:
      return createLevel1();
    case 2:
      return createLevel2();
    case 3:
      return createLevel3();
    default:
      return createLevel1();
  }
}
