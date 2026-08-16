import type { Character } from "../entities/Character";
import type { Door } from "../entities/Door";
import type { Level, Rect } from "../types/game";

export class PuzzleSystem {
  private switchCooldowns = new Map<string, number>();

  update(
    dt: number,
    level: Level,
    fireChar: Character,
    waterChar: Character,
    doors: Door[]
  ) {
    // 0. Update Switches & Lever Toggles
    for (const s of level.switches) {
      let cd = this.switchCooldowns.get(s.id) || 0;
      if (cd > 0) {
        this.switchCooldowns.set(s.id, cd - dt);
      } else {
        const isOverlapFire = fireChar.isAlive && this.checkOverlap(fireChar, s);
        const isOverlapWater = waterChar.isAlive && this.checkOverlap(waterChar, s);
        if (isOverlapFire || isOverlapWater) {
          s.active = !s.active;
          this.switchCooldowns.set(s.id, 0.4); // 400ms toggle cooldown
        }
      }
    }

    // 1. Update Pressure Plates
    for (const plate of level.pressurePlates) {
      const isPressedByFire =
        fireChar.isAlive && this.checkOverlap(fireChar, plate);
      const isPressedByWater =
        waterChar.isAlive && this.checkOverlap(waterChar, plate);
      const isPressedByBlock = level.pushableBlocks.some((b) =>
        this.checkOverlap(b, plate)
      );

      plate.pressed = isPressedByFire || isPressedByWater || isPressedByBlock;
    }

    // 2. Update Door Open States based on target IDs
    for (const door of doors) {
      const linkedPlates = level.pressurePlates.filter(
        (p) => p.targetId === door.id
      );
      const linkedSwitches = level.switches.filter(
        (s) => s.targetId === door.id
      );

      const platesActive =
        linkedPlates.length > 0 && linkedPlates.every((p) => p.pressed);
      const switchesActive =
        linkedSwitches.length > 0 && linkedSwitches.every((s) => s.active);

      door.open = platesActive || switchesActive;
      door.update(dt);
    }

    // 3. Update Moving Platforms along waypoints
    for (const plat of level.movingPlatforms) {
      if (plat.waypoints.length < 2) continue;

      let shouldMove = true;
      if (plat.requiresTrigger) {
        const triggers = [
          ...level.pressurePlates.filter((p) => p.targetId === plat.id),
          ...level.switches.filter((s) => s.targetId === plat.id)
        ];
        shouldMove =
          triggers.length > 0 &&
          triggers.every((t) => ("pressed" in t ? t.pressed : t.active));
      }

      if (!shouldMove) {
        plat.vx = 0;
        plat.vy = 0;
        continue;
      }

      const targetPos = plat.waypoints[plat.currentTargetIdx];
      const dx = targetPos.x - plat.x;
      const dy = targetPos.y - plat.y;
      const dist = Math.hypot(dx, dy);

      if (dist < 4) {
        plat.x = targetPos.x;
        plat.y = targetPos.y;
        plat.currentTargetIdx =
          (plat.currentTargetIdx + 1) % plat.waypoints.length;
        plat.vx = 0;
        plat.vy = 0;
      } else {
        const speed = plat.speed || 100;
        plat.vx = (dx / dist) * speed;
        plat.vy = (dy / dist) * speed;
        plat.x += plat.vx * dt;
        plat.y += plat.vy * dt;
      }
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
}
