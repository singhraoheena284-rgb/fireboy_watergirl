import type { Door } from "../entities/Door";
import type { GameStats, Level } from "../types/game";

export class LogicSystem {
  private escapeTriggered = false;

  update(
    dt: number,
    level: Level,
    doors: Door[],
    stats: GameStats,
    onEscapeTrigger?: () => void
  ) {
    if (!level.logicGates) return;

    // Map to store current boolean state of every signal source
    const signalStateMap = new Map<string, boolean>();

    // 1. Gather Input Control Panel States (value: 0 or 1)
    if (level.inputPanels) {
      for (const panel of level.inputPanels) {
        signalStateMap.set(panel.id, panel.value === 1);
        signalStateMap.set(`panel-${panel.keyName}`, panel.value === 1);
      }
    }

    // 2. Gather In-Game Switch & Pressure Plate States (0 or 1)
    for (const plate of level.pressurePlates) {
      signalStateMap.set(plate.id, plate.pressed);
    }
    for (const s of level.switches) {
      signalStateMap.set(s.id, s.active);
    }

    // 3. Evaluate Logic Gates in order
    for (const gate of level.logicGates) {
      const inputValues = gate.inputIds.map((id) => {
        if (id.startsWith("panel-")) {
          const key = id.replace("panel-", "").toUpperCase();
          const p = level.inputPanels?.find(
            (panel) => panel.keyName === key || panel.id === id
          );
          if (p) return p.value === 1;
        }
        return signalStateMap.get(id) || false;
      });

      let gateOutput = false;

      switch (gate.type) {
        case "AND":
          gateOutput =
            inputValues.length > 0 && inputValues.every((val) => val === true);
          break;
        case "OR":
          gateOutput = inputValues.some((val) => val === true);
          break;
        case "NOT":
          gateOutput = !inputValues[0];
          break;
        case "XOR":
          gateOutput =
            inputValues.filter((val) => val === true).length === 1;
          break;
        case "COMBINATION":
          // Formula: (A AND B) OR (NOT C)
          const inA = inputValues[0] || false;
          const inB = inputValues[1] || false;
          const inC = inputValues[2] || false;
          gateOutput = (inA && inB) || !inC;
          break;
      }

      gate.output = gateOutput;
      signalStateMap.set(gate.id, gateOutput);

      // 4. Apply Output to Target Mechanisms
      const door = doors.find((d) => d.id === gate.targetId);
      if (door) {
        door.open = gateOutput;
      }

      const plat = level.movingPlatforms.find((p) => p.id === gate.targetId);
      if (plat) {
        plat.active = gateOutput;
      }

      if (gate.targetId === "plat-final-bridge" && gateOutput && !this.escapeTriggered) {
        this.escapeTriggered = true;
        stats.isEscaping = true;
        if (onEscapeTrigger) onEscapeTrigger();
      }
    }
  }

  reset() {
    this.escapeTriggered = false;
  }
}
