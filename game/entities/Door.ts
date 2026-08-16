import type { DoorGate } from "../types/game";

export class Door implements DoorGate {
  public open = false;

  constructor(
    public id: string,
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public startY: number,
    public targetY: number,
    public color?: string
  ) {}

  update(dt: number) {
    const target = this.open ? this.targetY : this.startY;
    const speed = 120; // 120 px/s door slide speed

    if (Math.abs(this.y - target) > 0.5) {
      if (this.y < target) {
        this.y = Math.min(target, this.y + speed * dt);
      } else {
        this.y = Math.max(target, this.y - speed * dt);
      }
    } else {
      this.y = target;
    }
  }
}
