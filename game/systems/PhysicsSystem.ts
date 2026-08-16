import type { Character } from "../entities/Character";
import type { InputManager } from "../input/InputManager";
import type { Level, PushableBlock } from "../types/game";

export class PhysicsSystem {
  private readonly gravity = 1450; // px/s^2
  private readonly moveSpeed = 245; // px/s
  private readonly jumpForce = -595; // px/s impulse for significantly higher jumps
  private readonly maxFallSpeed = 750; // px/s

  update(
    dt: number,
    level: Level,
    fireChar: Character,
    waterChar: Character,
    input: InputManager
  ) {
    this.updateCharacterInput(fireChar, input, "KeyA", "KeyD", "KeyW");
    this.updateCharacterInput(
      waterChar,
      input,
      "ArrowLeft",
      "ArrowRight",
      "ArrowUp"
    );

    this.updateCharacterPhysics(fireChar, dt);
    this.updateCharacterPhysics(waterChar, dt);

    this.updatePushableBlocksPhysics(level.pushableBlocks, dt);
  }

  private updateCharacterInput(
    char: Character,
    input: InputManager,
    leftKey: string,
    rightKey: string,
    jumpKey: string
  ) {
    if (!char.isAlive) return;

    let targetVx = 0;
    if (input.isDown(leftKey)) {
      targetVx -= this.moveSpeed;
      char.facing = "left";
    }
    if (input.isDown(rightKey)) {
      targetVx += this.moveSpeed;
      char.facing = "right";
    }

    // Smooth horizontal acceleration/deceleration
    const accel = char.grounded ? 18 : 10;
    char.vx += (targetVx - char.vx) * Math.min(1, accel * 0.016);

    // Jump buffering
    if (input.wasPressed(jumpKey)) {
      char.jumpBufferCounter = 0.16; // 160ms buffer window
    }

    // Variable jump height - release jump key early to jump shorter
    if (!input.isDown(jumpKey) && char.vy < -200) {
      char.vy *= 0.6;
    }
  }

  private updateCharacterPhysics(char: Character, dt: number) {
    // Coyote time and jump buffer tick
    if (char.grounded) {
      char.coyoteTimeCounter = 0.14; // 140ms coyote window
    } else {
      char.coyoteTimeCounter = Math.max(0, char.coyoteTimeCounter - dt);
    }

    char.jumpBufferCounter = Math.max(0, char.jumpBufferCounter - dt);

    // Execute jump if buffer and coyote time are valid
    if (char.jumpBufferCounter > 0 && char.coyoteTimeCounter > 0) {
      char.vy = this.jumpForce;
      char.grounded = false;
      char.coyoteTimeCounter = 0;
      char.jumpBufferCounter = 0;
      char.isJumping = true;
    }

    // Apply gravity
    if (!char.grounded) {
      char.vy += this.gravity * dt;
      if (char.vy > this.maxFallSpeed) {
        char.vy = this.maxFallSpeed;
      }
    }
  }

  private updatePushableBlocksPhysics(blocks: PushableBlock[], dt: number) {
    for (const block of blocks) {
      if (!block.grounded) {
        block.vy += this.gravity * dt;
        if (block.vy > this.maxFallSpeed) {
          block.vy = this.maxFallSpeed;
        }
      }
      // Apply friction to blocks
      block.vx *= 0.85;
      if (Math.abs(block.vx) < 1) block.vx = 0;
    }
  }
}
