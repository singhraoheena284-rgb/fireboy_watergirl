import type { CharacterType, Rect, Vec2 } from "../types/game";

export class Character implements Rect {
  public x: number;
  public y: number;
  public width = 28;
  public height = 44;
  public vx = 0;
  public vy = 0;

  public grounded = false;
  public wasGrounded = false;
  public isJumping = false;
  public facing: "left" | "right" = "right";
  public isAlive = true;
  public deathTimer = 0;

  // Coyote time and jump buffer for responsive controls
  public coyoteTimeCounter = 0;
  public jumpBufferCounter = 0;

  // Visual/Animation properties
  public animFrame = 0;
  public animTime = 0;

  constructor(
    public readonly type: CharacterType,
    public spawnPos: Vec2
  ) {
    this.x = spawnPos.x;
    this.y = spawnPos.y;
  }

  reset(spawnPos?: Vec2) {
    if (spawnPos) {
      this.spawnPos = spawnPos;
    }
    this.x = this.spawnPos.x;
    this.y = this.spawnPos.y;
    this.vx = 0;
    this.vy = 0;
    this.grounded = false;
    this.wasGrounded = false;
    this.isJumping = false;
    this.isAlive = true;
    this.deathTimer = 0;
    this.coyoteTimeCounter = 0;
    this.jumpBufferCounter = 0;
  }

  die() {
    if (!this.isAlive) return;
    this.isAlive = false;
    this.deathTimer = 0.8; // 0.8s death animation duration
    this.vx = 0;
    this.vy = -200; // small pop upwards on death
  }
}
