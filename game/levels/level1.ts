import type { Level } from "../types/game";

export function createLevel1(): Level {
  return {
    id: 1,
    name: "BINARY BRIDGE — LEVEL 1: LOGIC TEMPLE",
    width: 1280,
    height: 720,

    spawns: {
      fire: { x: 70, y: 605 },  // 🔴 RED Character (WASD) - Bottom Left
      water: { x: 130, y: 605 } // 🔵 BLUE Character (Arrow Keys) - Bottom Left
    },

    platforms: [
      // Outer border sandstone walls & ceiling
      { x: 0, y: 0, width: 1280, height: 32, type: "solid" },
      { x: 0, y: 0, width: 32, height: 720, type: "solid" },
      { x: 1248, y: 0, width: 32, height: 720, type: "solid" },

      // Bottom Floor (Full width)
      { x: 32, y: 650, width: 1216, height: 38, type: "solid" },

      // Upper Exit Platform Ledge (Below Top Center Output Capsule)
      { x: 440, y: 250, width: 400, height: 24, type: "solid" },

      // Left & Right Ledges for Input A & Input B pedestals
      { x: 32, y: 500, width: 220, height: 24, type: "solid" },
      { x: 1028, y: 500, width: 220, height: 24, type: "solid" },

      // Gate Ledges (Under AND, OR, XOR, NOT gates matching reference image)
      { x: 300, y: 430, width: 160, height: 18, type: "solid" }, // Under AND
      { x: 840, y: 430, width: 160, height: 18, type: "solid" }, // Under OR
      { x: 360, y: 610, width: 160, height: 18, type: "solid" }, // Under XOR
      { x: 780, y: 610, width: 160, height: 18, type: "solid" }, // Under NOT

      // Upper Left & Upper Right Ledges
      { x: 140, y: 180, width: 180, height: 20, type: "solid" },
      { x: 960, y: 180, width: 180, height: 20, type: "solid" }
    ],

    movingPlatforms: [
      // 1. AND Bridge (Left middle gap)
      {
        id: "plat-and-bridge",
        x: 250,
        y: 500,
        width: 120,
        height: 24,
        waypoints: [
          { x: 250, y: 600 },
          { x: 250, y: 500 }
        ],
        speed: 250,
        currentTargetIdx: 1,
        active: false,
        requiresTrigger: true,
        vx: 0,
        vy: 0
      },

      // 2. OR Elevator (Right vertical shaft)
      {
        id: "plat-or-elevator",
        x: 1144,
        y: 650,
        width: 100,
        height: 20,
        waypoints: [
          { x: 1144, y: 650 },
          { x: 1144, y: 180 }
        ],
        speed: 180,
        currentTargetIdx: 1,
        active: false,
        requiresTrigger: true,
        vx: 0,
        vy: 0
      },

      // 3. XOR Bridge (Lower middle gap)
      {
        id: "plat-xor-bridge",
        x: 520,
        y: 610,
        width: 140,
        height: 24,
        waypoints: [
          { x: 520, y: 700 },
          { x: 520, y: 610 }
        ],
        speed: 250,
        currentTargetIdx: 1,
        active: false,
        requiresTrigger: true,
        vx: 0,
        vy: 0
      },

      // 4. Final Exit Bridge (Access to Upper Exit Doors)
      {
        id: "plat-final-bridge",
        x: 570,
        y: 250,
        width: 140,
        height: 24,
        waypoints: [
          { x: 570, y: 350 },
          { x: 570, y: 250 }
        ],
        speed: 300,
        currentTargetIdx: 1,
        active: false,
        requiresTrigger: true,
        vx: 0,
        vy: 0
      }
    ],

    hazards: [
      { x: 250, y: 650, width: 120, height: 24, type: "water" },
      { x: 520, y: 650, width: 140, height: 24, type: "fire" }
    ],

    pressurePlates: [],

    switches: [
      // Lever C on upper-left ledge
      {
        id: "lever-c",
        targetId: "gate-comb",
        x: 180,
        y: 152,
        width: 28,
        height: 28,
        active: false
      }
    ],

    doors: [
      // NOT Gate Door
      {
        id: "door-not",
        x: 640,
        y: 250,
        width: 20,
        height: 110,
        startY: 360,
        targetY: 250,
        open: true
      }
    ],

    pushableBlocks: [],

    gems: [
      {
        id: "gem-1",
        type: "fire_gem",
        x: 340,
        y: 390,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "gem-2",
        type: "water_gem",
        x: 900,
        y: 390,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "gem-3",
        type: "fire_gem",
        x: 400,
        y: 570,
        width: 20,
        height: 20,
        collected: false
      },
      {
        id: "gem-4",
        type: "water_gem",
        x: 820,
        y: 570,
        width: 20,
        height: 20,
        collected: false
      }
    ],

    // 🔴 RED & 🔵 BLUE EXIT DOORS (Matching Reference Screenshot!)
    exits: {
      fire: {
        x: 480,
        y: 170,
        width: 54,
        height: 80,
        type: "fire_exit",
        occupied: false
      },
      water: {
        x: 740,
        y: 170,
        width: 54,
        height: 80,
        type: "water_exit",
        occupied: false
      }
    },

    // ANCIENT CLICKABLE INPUT CONTROL PANELS [ 0 ] [ 1 ] (Matching Reference Screenshot!)
    inputPanels: [
      { id: "panel-a", keyName: "A", value: 0, x: 80, y: 650, width: 160, height: 36 },
      { id: "panel-b", keyName: "B", value: 0, x: 1040, y: 650, width: 160, height: 36 }
    ],

    // FOUR LARGE CIRCULAR LOGIC GATES (Matching Reference Image Positions & Symbols!)
    logicGates: [
      {
        id: "gate-and",
        type: "AND",
        label: "AND",
        x: 360,
        y: 380,
        inputIds: ["panel-a", "panel-b"],
        targetId: "plat-and-bridge",
        output: false
      },
      {
        id: "gate-or",
        type: "OR",
        label: "OR",
        x: 920,
        y: 380,
        inputIds: ["panel-a", "panel-b"],
        targetId: "plat-or-elevator",
        output: false
      },
      {
        id: "gate-xor",
        type: "XOR",
        label: "XOR",
        x: 420,
        y: 560,
        inputIds: ["panel-a", "panel-b"],
        targetId: "plat-xor-bridge",
        output: false
      },
      {
        id: "gate-not",
        type: "NOT",
        label: "NOT",
        x: 860,
        y: 560,
        inputIds: ["lever-c"],
        targetId: "door-not",
        output: true
      },
      {
        id: "gate-comb",
        type: "COMBINATION",
        label: "OUTPUT",
        x: 640,
        y: 70,
        inputIds: ["panel-a", "panel-b", "lever-c"],
        targetId: "plat-final-bridge",
        output: false
      }
    ],

    // SIGNAL LINES (Matching Reference Image Wires!)
    signalWires: [
      // Input A -> AND & XOR (Red wire)
      {
        id: "wire-a-and",
        fromId: "panel-a",
        toId: "gate-and",
        points: [{ x: 160, y: 650 }, { x: 160, y: 380 }, { x: 360, y: 380 }],
        active: false
      },
      {
        id: "wire-a-xor",
        fromId: "panel-a",
        toId: "gate-xor",
        points: [{ x: 160, y: 560 }, { x: 420, y: 560 }],
        active: false
      },

      // Input B -> OR & NOT (Red wire)
      {
        id: "wire-b-or",
        fromId: "panel-b",
        toId: "gate-or",
        points: [{ x: 1120, y: 650 }, { x: 1120, y: 380 }, { x: 920, y: 380 }],
        active: false
      },
      {
        id: "wire-b-not",
        fromId: "panel-b",
        toId: "gate-not",
        points: [{ x: 1120, y: 560 }, { x: 860, y: 560 }],
        active: false
      },

      // XOR -> NOT -> OR (Green wire connection)
      {
        id: "wire-xor-not",
        fromId: "gate-xor",
        toId: "gate-not",
        points: [{ x: 420, y: 560 }, { x: 860, y: 560 }],
        active: false
      },
      {
        id: "wire-not-or",
        fromId: "gate-not",
        toId: "gate-or",
        points: [{ x: 860, y: 560 }, { x: 860, y: 380 }, { x: 920, y: 380 }],
        active: false
      },

      // AND & OR -> Top Center Output Capsule
      {
        id: "wire-and-out",
        fromId: "gate-and",
        toId: "gate-comb",
        points: [{ x: 360, y: 380 }, { x: 640, y: 380 }, { x: 640, y: 70 }],
        active: false
      },
      {
        id: "wire-or-out",
        fromId: "gate-or",
        toId: "gate-comb",
        points: [{ x: 920, y: 380 }, { x: 640, y: 380 }, { x: 640, y: 70 }],
        active: false
      }
    ]
  };
}
