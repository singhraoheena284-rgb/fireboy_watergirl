import type { Character } from "../entities/Character";
import type { Level, Rect } from "../types/game";

export class HazardSystem {
  update(
    dt: number,
    level: Level,
    fireChar: Character,
    waterChar: Character,
    onCharacterDeath?: (charName: string, hazardType: string) => void
  ) {
    this.checkCharacterHazards(fireChar, level, onCharacterDeath);
    this.checkCharacterHazards(waterChar, level, onCharacterDeath);

    // Update death animation timers
    if (!fireChar.isAlive && fireChar.deathTimer > 0) {
      fireChar.deathTimer = Math.max(0, fireChar.deathTimer - dt);
    }
    if (!waterChar.isAlive && waterChar.deathTimer > 0) {
      waterChar.deathTimer = Math.max(0, waterChar.deathTimer - dt);
    }
  }

  private checkCharacterHazards(
    char: Character,
    level: Level,
    onDeath?: (charName: string, hazardType: string) => void
  ) {
    if (!char.isAlive) return;

    for (const hazard of level.hazards) {
      if (this.checkImmersion(char, hazard)) {
        let isFatal = false;

        if (hazard.type === "toxic") {
          isFatal = true;
        } else if (hazard.type === "water" && char.type === "fire") {
          isFatal = true;
        } else if (hazard.type === "fire" && char.type === "water") {
          isFatal = true;
        }

        if (isFatal) {
          char.die();
          if (onDeath) {
            onDeath(
              char.type === "fire" ? "Fire Character" : "Water Character",
              hazard.type
            );
          }
          break;
        }
      }
    }
  }

  // Immersion check: character feet/torso inside hazard pool
  private checkImmersion(char: Character, hazard: Rect): boolean {
    const feetY = char.y + char.height - 8;
    return (
      char.x + char.width - 6 > hazard.x &&
      char.x + 6 < hazard.x + hazard.width &&
      feetY > hazard.y &&
      char.y < hazard.y + hazard.height
    );
  }
}
