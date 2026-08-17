import type { Character } from "../entities/Character";
import type { GameStats, Level, Rect } from "../types/game";
import type { ParticleSystem } from "./ParticleSystem";

export class LevelSystem {
  public stats: GameStats = {
    fireGemsCollected: 0,
    fireGemsTotal: 0,
    waterGemsCollected: 0,
    waterGemsTotal: 0,
    elapsedSeconds: 0,
    status: "playing"
  };

  initLevel(level: Level) {
    this.stats.fireGemsCollected = 0;
    this.stats.fireGemsTotal = level.gems.filter(
      (g) => g.type === "fire_gem"
    ).length;
    this.stats.waterGemsCollected = 0;
    this.stats.waterGemsTotal = level.gems.filter(
      (g) => g.type === "water_gem"
    ).length;
    this.stats.elapsedSeconds = 0;
    this.stats.status = "playing";
    delete this.stats.defeatReason;
    this.stats.isEscaping = false;
  }

  update(
    dt: number,
    level: Level,
    fireChar: Character,
    waterChar: Character,
    particleSystem?: ParticleSystem,
    onGemPickup?: () => void,
    onVictory?: () => void
  ) {
    if (this.stats.status !== "playing") return;

    this.stats.elapsedSeconds += dt;

    // 0. Check 5-Minute Time Limit (300 Seconds)
    if (this.stats.elapsedSeconds >= 300) {
      this.stats.status = "defeated";
      this.stats.defeatReason = "TIME UP";
      return;
    }

    // 1. Gem Pickups
    for (const gem of level.gems) {
      if (gem.collected) continue;

      if (
        gem.type === "fire_gem" &&
        fireChar.isAlive &&
        this.checkOverlap(fireChar, gem)
      ) {
        gem.collected = true;
        this.stats.fireGemsCollected++;
        if (particleSystem) {
          particleSystem.spawnSparkles(
            gem.x + gem.width / 2,
            gem.y + gem.height / 2,
            "#f97316"
          );
        }
        if (onGemPickup) onGemPickup();
      } else if (
        gem.type === "water_gem" &&
        waterChar.isAlive &&
        this.checkOverlap(waterChar, gem)
      ) {
        gem.collected = true;
        this.stats.waterGemsCollected++;
        if (particleSystem) {
          particleSystem.spawnSparkles(
            gem.x + gem.width / 2,
            gem.y + gem.height / 2,
            "#38bdf8"
          );
        }
        if (onGemPickup) onGemPickup();
      }
    }

    // 2. Check Exits
    const fireExit = level.exits.fire;
    const waterExit = level.exits.water;

    fireExit.occupied =
      fireChar.isAlive && this.checkExitOverlap(fireChar, fireExit);
    waterExit.occupied =
      waterChar.isAlive && this.checkExitOverlap(waterChar, waterExit);

    // Dual Exit Victory Check (Both characters reach exits!)
    if (
      fireExit.occupied &&
      waterExit.occupied &&
      fireChar.grounded &&
      waterChar.grounded
    ) {
      this.stats.status = "victory";
      if (onVictory) onVictory();
    }

    // Check Defeat (if either character dies)
    if (
      (!fireChar.isAlive && fireChar.deathTimer <= 0) ||
      (!waterChar.isAlive && waterChar.deathTimer <= 0)
    ) {
      this.stats.status = "defeated";
    }
  }

  private checkOverlap(a: Rect, b: Rect): boolean {
    return (
      a.x < b.x + b.width &&
      a.x + a.width > b.x &&
      a.y < b.y + b.height &&
      a.y + a.height > b.y
    );
  }

  private checkExitOverlap(char: Character, exit: Rect): boolean {
    const charCenterX = char.x + char.width / 2;
    const exitCenterX = exit.x + exit.width / 2;
    return (
      Math.abs(charCenterX - exitCenterX) < 22 &&
      char.y + char.height >= exit.y + exit.height - 12 &&
      char.y <= exit.y + exit.height
    );
  }
}
