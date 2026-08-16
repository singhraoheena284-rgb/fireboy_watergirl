import type { Platform as IPlatform, PlatformType } from "../types/game";

export class PlatformEntity implements IPlatform {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public type: PlatformType = "solid",
    public color?: string
  ) {}
}
