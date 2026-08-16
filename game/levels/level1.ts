import type { Level } from "../types/game";

export function createLevel1(): Level {
  return {
    id: 1,
    name: "The Forest Temple - Level 1",
    width: 1280,
    height: 720,

    spawns: {
      fire: { x: 80, y: 610 },
      water: { x: 160, y: 610 }
    },

    platforms: [
      // Outer border walls & ceiling
      { x: 0, y: 0, width: 1280, height: 32, type: "solid" },
      { x: 0, y: 0, width: 32, height: 720, type: "solid" },
      { x: 1248, y: 0, width: 32, height: 720, type: "solid" },

      // Bottom Floor segments around hazards
      { x: 32, y: 660, width: 380, height: 60, type: "solid" },
      { x: 560, y: 660, width: 120, height: 60, type: "solid" },
      { x: 830, y: 660, width: 110, height: 60, type: "solid" },
      { x: 1090, y: 660, width: 158, height: 60, type: "solid" },

      // Lower tier platform (with yellow lever)
      { x: 260, y: 540, width: 220, height: 24, type: "solid" },

      // Middle-left ramp / slope rising to middle platform
      {
        x: 480,
        y: 375,
        width: 120,
        height: 165,
        type: "solid",
        slope: "up-left"
      },

      // Middle main platform - Raised to y: 375 for generous head clearance!
      { x: 140, y: 375, width: 380, height: 24, type: "solid" },

      // Right-side intermediate ledge above toxic pool
      { x: 740, y: 460, width: 220, height: 24, type: "solid" },
      {
        x: 960,
        y: 375,
        width: 120,
        height: 85,
        type: "solid",
        slope: "up-right"
      },

      // Upper-left platform - Raised to y: 210 for generous head clearance!
      { x: 140, y: 210, width: 420, height: 24, type: "solid" },

      // Upper-right main exit platform - Raised to y: 185 for generous head clearance!
      { x: 680, y: 185, width: 480, height: 24, type: "solid" }
    ],

    movingPlatforms: [
      // Yellow elevator at left
      {
        id: "plat-yellow",
        x: 32,
        y: 460,
        width: 90,
        height: 18,
        waypoints: [
          { x: 32, y: 460 },
          { x: 32, y: 210 }
        ],
        speed: 110,
        currentTargetIdx: 0,
        active: false,
        requiresTrigger: true,
        vx: 0,
        vy: 0
      },

      // Purple elevator at right
      {
        id: "plat-purple",
        x: 1150,
        y: 375,
        width: 90,
        height: 18,
        waypoints: [
          { x: 1150, y: 375 },
          { x: 1150, y: 185 }
        ],
        speed: 120,
        currentTargetIdx: 0,
        active: false,
        requiresTrigger: true,
        vx: 0,
        vy: 0
      }
    ],

    hazards: [
      // Fire/Lava pool
      { x: 412, y: 660, width: 148, height: 24, type: "fire" },
      // Green Toxic Acid pool
      { x: 680, y: 660, width: 150, height: 24, type: "toxic" },
      // Blue Water pool
      { x: 940, y: 660, width: 150, height: 24, type: "water" }
    ],

    pressurePlates: [
      // Plate 1 on middle platform -> activates purple elevator
      {
        id: "plate-1",
        targetId: "plat-purple",
        x: 420,
        y: 367,
        width: 44,
        height: 8,
        pressed: false
      },
      // Plate 2 on upper-left platform -> opens door
      {
        id: "plate-2",
        targetId: "door-1",
        x: 320,
        y: 202,
        width: 44,
        height: 8,
        pressed: false
      }
    ],

    switches: [
      // Yellow lever on lower-left platform -> toggles yellow elevator
      {
        id: "lever-1",
        targetId: "plat-yellow",
        x: 310,
        y: 512,
        width: 28,
        height: 28,
        active: false
      }
    ],

    doors: [
      // Sliding gate barrier on upper path
      {
        id: "door-1",
        x: 620,
        y: 95,
        width: 20,
        height: 90,
        startY: 95,
        targetY: 5,
        open: false
      }
    ],

    pushableBlocks: [
      // Silver box on middle platform to hold down pressure plate
      {
        id: "box-1",
        x: 480,
        y: 335,
        width: 40,
        height: 40,
        vx: 0,
        vy: 0,
        grounded: false
      }
    ],

    gems: [
      // Fire diamonds (Red)
      {
        id: "fg-1",
        type: "fire_gem",
        x: 280,
        y: 490,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "fg-2",
        type: "fire_gem",
        x: 200,
        y: 325,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "fg-3",
        type: "fire_gem",
        x: 760,
        y: 135,
        width: 20,
        height: 20,
        collected: false
      },

      // Water diamonds (Blue)
      {
        id: "wg-1",
        type: "water_gem",
        x: 60,
        y: 160,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "wg-2",
        type: "water_gem",
        x: 820,
        y: 410,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "wg-3",
        type: "water_gem",
        x: 900,
        y: 135,
        width: 20,
        height: 20,
        collected: false
      }
    ],

    exits: {
      fire: {
        x: 960,
        y: 105,
        width: 54,
        height: 80,
        type: "fire_exit",
        occupied: false
      },
      water: {
        x: 1040,
        y: 105,
        width: 54,
        height: 80,
        type: "water_exit",
        occupied: false
      }
    }
  };
}
