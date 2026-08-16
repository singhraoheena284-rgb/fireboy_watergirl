export type Vec2 = {
  x: number;
  y: number;
};

export type Rect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export type HazardType = "fire" | "water" | "toxic";

export type PlatformType = "solid" | "one-way";

export type Platform = Rect & {
  type: PlatformType;
  color?: string;
  slope?: "up-right" | "up-left";
  startY?: number;
  endY?: number;
};

export type Hazard = Rect & {
  type: HazardType;
};

export type PressurePlate = Rect & {
  id: string;
  targetId: string;
  pressed: boolean;
  color?: string;
};

export type SwitchLever = Rect & {
  id: string;
  targetId: string;
  active: boolean;
};

export type DoorGate = Rect & {
  id: string;
  startY: number;
  targetY: number;
  open: boolean;
  color?: string;
};

export type MovingPlatform = Rect & {
  id: string;
  waypoints: Vec2[];
  speed: number;
  currentTargetIdx: number;
  active: boolean;
  requiresTrigger?: boolean;
  vx: number;
  vy: number;
};

export type PushableBlock = Rect & {
  id: string;
  vx: number;
  vy: number;
  grounded: boolean;
};

export type CollectibleType = "fire_gem" | "water_gem";

export type Collectible = Rect & {
  id: string;
  type: CollectibleType;
  collected: boolean;
};

export type ExitDoor = Rect & {
  type: "fire_exit" | "water_exit";
  occupied: boolean;
};

export type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  life: number;
  maxLife: number;
  shape?: "circle" | "square" | "spark";
};

export type CharacterType = "fire" | "water";

export type Level = {
  id: number;
  name: string;
  width: number;
  height: number;
  spawns: {
    fire: Vec2;
    water: Vec2;
  };
  platforms: Platform[];
  movingPlatforms: MovingPlatform[];
  hazards: Hazard[];
  pressurePlates: PressurePlate[];
  switches: SwitchLever[];
  doors: DoorGate[];
  pushableBlocks: PushableBlock[];
  gems: Collectible[];
  exits: {
    fire: ExitDoor;
    water: ExitDoor;
  };
};

export type GameStatus = "playing" | "paused" | "victory" | "defeated";

export type GameStats = {
  fireGemsCollected: number;
  fireGemsTotal: number;
  waterGemsCollected: number;
  waterGemsTotal: number;
  elapsedSeconds: number;
  status: GameStatus;
  defeatReason?: string;
};
