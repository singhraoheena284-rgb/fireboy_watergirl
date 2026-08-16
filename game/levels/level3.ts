import type { Level } from "../types/game";

export function createLevel3(): Level {
  return {
    id: 3,
    name: "The Acid Cavern & Crate Puzzle",
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

      // Platform tiers & ledges
      { x: 30, y: 480, width: 320, height: 30, type: "solid" },
      { x: 880, y: 480, width: 370, height: 30, type: "solid" },
      { x: 400, y: 320, width: 480, height: 30, type: "solid" },
      { x: 30, y: 200, width: 380, height: 30, type: "solid" },
      { x: 880, y: 200, width: 370, height: 30, type: "solid" }
    ],

    movingPlatforms: [
      {
        id: "acid-shuttle",
        x: 370,
        y: 480,
        width: 110,
        height: 20,
        waypoints: [
          { x: 370, y: 480 },
          { x: 750, y: 480 }
        ],
        speed: 100,
        currentTargetIdx: 0,
        active: true,
        vx: 0,
        vy: 0
      }
    ],

    hazards: [
      { x: 350, y: 620, width: 530, height: 20, type: "toxic" },
      { x: 100, y: 460, width: 120, height: 20, type: "fire" },
      { x: 980, y: 460, width: 120, height: 20, type: "water" }
    ],

    pressurePlates: [
      {
        id: "plate-crate",
        targetId: "door-crate",
        x: 250,
        y: 472,
        width: 40,
        height: 8,
        pressed: false
      }
    ],

    switches: [],

    doors: [
      {
        id: "door-crate",
        x: 880,
        y: 100,
        width: 24,
        height: 100,
        startY: 100,
        targetY: 0,
        open: false
      }
    ],

    pushableBlocks: [
      {
        id: "crate-1",
        x: 100,
        y: 440,
        width: 32,
        height: 32,
        vx: 0,
        vy: 0,
        grounded: false
      }
    ],

    gems: [
      {
        id: "fg-1",
        type: "fire_gem",
        x: 450,
        y: 270,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "fg-2",
        type: "fire_gem",
        x: 600,
        y: 270,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "fg-3",
        type: "fire_gem",
        x: 200,
        y: 150,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "wg-1",
        type: "water_gem",
        x: 750,
        y: 270,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "wg-2",
        type: "water_gem",
        x: 1050,
        y: 410,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "wg-3",
        type: "water_gem",
        x: 1100,
        y: 150,
        width: 20,
        height: 20,
        collected: false
      }
    ],

    exits: {
      fire: {
        x: 1000,
        y: 120,
        width: 50,
        height: 80,
        type: "fire_exit",
        occupied: false
      },
      water: {
        x: 1100,
        y: 120,
        width: 50,
        height: 80,
        type: "water_exit",
        occupied: false
      }
    }
  };
}
