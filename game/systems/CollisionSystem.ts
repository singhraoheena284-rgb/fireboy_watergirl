import type { Character } from "../entities/Character";
import type { Door } from "../entities/Door";
import type { Level, MovingPlatform, Platform, PushableBlock, Rect } from "../types/game";

export class CollisionSystem {
  update(
    dt: number,
    level: Level,
    fireChar: Character,
    waterChar: Character,
    doors: Door[]
  ) {
    this.processCharacterCollisions(fireChar, dt, level, doors);
    this.processCharacterCollisions(waterChar, dt, level, doors);
    this.processBlockCollisions(level.pushableBlocks, dt, level, doors);
  }

  private processCharacterCollisions(
    char: Character,
    dt: number,
    level: Level,
    doors: Door[]
  ) {
    if (!char.isAlive) return;

    char.wasGrounded = char.grounded;
    char.grounded = false;

    // Collect static flat solids vs slope platforms
    const flatPlatforms = level.platforms.filter((p) => !p.slope);
    const slopePlatforms = level.platforms.filter((p) => !!p.slope);

    const solids: Rect[] = [
      ...flatPlatforms,
      ...doors.filter((d) => Math.abs(d.y - d.targetY) > 2 || !d.open),
      ...level.pushableBlocks.map((b) => ({
        x: b.x,
        y: b.y,
        width: b.width,
        height: b.height
      }))
    ];

    // 1. Move X & Resolve X Collisions
    char.x += char.vx * dt;

    // Boundary X clamp
    if (char.x < 0) {
      char.x = 0;
      char.vx = 0;
    } else if (char.x + char.width > level.width) {
      char.x = level.width - char.width;
      char.vx = 0;
    }

    for (const solid of solids) {
      if (this.checkOverlap(char, solid)) {
        if (char.vx > 0) {
          char.x = solid.x - char.width;
        } else if (char.vx < 0) {
          char.x = solid.x + solid.width;
        }
        char.vx = 0;
      }
    }

    // Character pushing crates horizontally
    for (const block of level.pushableBlocks) {
      if (this.checkOverlap(char, block)) {
        const pushForce = char.vx * 0.7;
        block.vx = pushForce;
      }
    }

    // 2. Move Y & Resolve Y Collisions
    char.y += char.vy * dt;

    // Boundary Y floor check
    if (char.y + char.height > level.height) {
      char.y = level.height - char.height;
      char.vy = 0;
      char.grounded = true;
    }

    for (const solid of solids) {
      if (this.checkOverlap(char, solid)) {
        if (char.vy > 0) {
          // Landing on top of solid
          char.y = solid.y - char.height;
          char.vy = 0;
          char.grounded = true;
        } else if (char.vy < 0) {
          // Hitting ceiling
          char.y = solid.y + solid.height;
          char.vy = 0;
        }
      }
    }

    // 3. Slope Ramps Handling
    const charCenterX = char.x + char.width / 2;
    for (const slopePlat of slopePlatforms) {
      if (
        charCenterX >= slopePlat.x &&
        charCenterX <= slopePlat.x + slopePlat.width
      ) {
        const relX = (charCenterX - slopePlat.x) / slopePlat.width;
        let surfaceY = slopePlat.y;
        if (slopePlat.slope === "up-right") {
          surfaceY = slopePlat.y + slopePlat.height * (1 - relX);
        } else if (slopePlat.slope === "up-left") {
          surfaceY = slopePlat.y + slopePlat.height * relX;
        }

        const feetY = char.y + char.height;
        if (feetY >= surfaceY - 12 && feetY <= surfaceY + 20 && char.vy >= -80) {
          char.y = surfaceY - char.height;
          char.vy = 0;
          char.grounded = true;
        }
      }
    }

    // 3. Moving Platforms Collisions & Riding Transfer
    for (const plat of level.movingPlatforms) {
      // Check if character is standing on moving platform
      const feetY = char.y + char.height;
      const isStandingOn =
        feetY >= plat.y - 4 &&
        feetY <= plat.y + 8 &&
        char.x + char.width > plat.x &&
        char.x < plat.x + plat.width &&
        char.vy >= 0;

      if (isStandingOn) {
        char.y = plat.y - char.height;
        char.vy = 0;
        char.grounded = true;
        // Carry character with platform velocity
        char.x += plat.vx * dt;
        char.y += plat.vy * dt;
      }
    }
  }

  private processBlockCollisions(
    blocks: PushableBlock[],
    dt: number,
    level: Level,
    doors: Door[]
  ) {
    for (const block of blocks) {
      block.grounded = false;
      const solids: Rect[] = [
        ...level.platforms,
        ...doors.filter((d) => !d.open)
      ];

      // Move Block X
      block.x += block.vx * dt;
      for (const solid of solids) {
        if (this.checkOverlap(block, solid)) {
          if (block.vx > 0) {
            block.x = solid.x - block.width;
          } else if (block.vx < 0) {
            block.x = solid.x + solid.width;
          }
          block.vx = 0;
        }
      }

      // Move Block Y
      block.y += block.vy * dt;
      for (const solid of solids) {
        if (this.checkOverlap(block, solid)) {
          if (block.vy > 0) {
            block.y = solid.y - block.height;
            block.vy = 0;
            block.grounded = true;
          } else if (block.vy < 0) {
            block.y = solid.y + solid.height;
            block.vy = 0;
          }
        }
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
