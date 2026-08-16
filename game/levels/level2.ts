import type { Level } from "../types/game";

export function createLevel2(): Level {
  return {
    id: 2,
    name: "Dual Switches & Moving Lift",
    width: 1280,
    height: 720,

    spawns: {
      fire: { x: 80, y: 570 },
      water: { x: 150, y: 570 }
    },

    platforms: [
      // Floor and boundary walls
      { x: 0, y: 640, width: 1280, height: 80, type: "solid" },
      { x: 0, y: 0, width: 30, height: 720, type: "solid" },
      { x: 1250, y: 0, width: 30, height: 720, type: "solid" },
      { x: 0, y: 0, width: 1280, height: 30, type: "solid" },

      // Platform tiers
      { x: 30, y: 440, width: 280, height: 30, type: "solid" },
      { x: 450, y: 520, width: 380, height: 30, type: "solid" },
      { x: 950, y: 440, width: 300, height: 30, type: "solid" },
      { x: 300, y: 260, width: 680, height: 30, type: "solid" },
      { x: 30, y: 160, width: 220, height: 30, type: "solid" }
    ],

    movingPlatforms: [
      {
        id: "lift-1",
        x: 330,
        y: 440,
        width: 100,
        height: 20,
        waypoints: [
          { x: 330, y: 440 },
          { x: 330, y: 260 }
        ],
        speed: 110,
        currentTargetIdx: 0,
        active: false,
        requiresTrigger: true,
        vx: 0,
        vy: 0
      }
    ],

    hazards: [
      { x: 500, y: 620, width: 280, height: 20, type: "toxic" },
      { x: 90, y: 420, width: 100, height: 20, type: "fire" },
      { x: 1020, y: 420, width: 100, height: 20, type: "water" }
    ],

    pressurePlates: [
      {
        id: "plate-lift",
        targetId: "lift-1",
        x: 550,
        y: 512,
        width: 40,
        height: 8,
        pressed: false
      },
      {
        id: "plate-door-top",
        targetId: "door-top",
        x: 500,
        y: 252,
        width: 40,
        height: 8,
        pressed: false
      }
    ],

    switches: [],

    doors: [
      {
        id: "door-top",
        x: 230,
        y: 60,
        width: 24,
        height: 100,
        startY: 60,
        targetY: -40,
        open: false
      }
    ],

    pushableBlocks: [],

    gems: [
      {
        id: "fg-1",
        type: "fire_gem",
        x: 130,
        y: 380,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "fg-2",
        type: "fire_gem",
        x: 600,
        y: 470,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "fg-3",
        type: "fire_gem",
        x: 400,
        y: 210,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "wg-1",
        type: "water_gem",
        x: 1060,
        y: 380,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "wg-2",
        type: "water_gem",
        x: 700,
        y: 470,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "wg-3",
        type: "water_gem",
        x: 650,
        y: 210,
        width: 20,
        height: 20,
        collected: false
      }
    ],

    exits: {
      fire: {
        x: 50,
        y: 80,
        width: 50,
        height: 80,
        type: "fire_exit",
        occupied: false
      },
      water: {
        x: 140,
        y: 80,
        width: 50,
        height: 80,
        type: "water_exit",
        occupied: false
      }
    }
  };
}
