import type { Character } from "../entities/Character";
import type { Door } from "../entities/Door";
import type { GameStats, Level, Particle } from "../types/game";

export class Renderer {
  private time = 0;

  constructor(
    private ctx: CanvasRenderingContext2D,
    private canvas: HTMLCanvasElement
  ) {}

  render(
    level: Level,
    fireChar: Character,
    waterChar: Character,
    doors: Door[],
    particles: Particle[],
    stats: GameStats
  ) {
    this.time += 0.016; // Increment animation time
    const { ctx, canvas } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Sandstone Wall Background (Reference Image Match!)
    this.drawBackground(level);

    // 2. Signal Lines (Red when 0, Green when 1)
    if (level.signalWires) {
      this.drawSignalWires(level.signalWires);
    }

    // 3. Top Center OUTPUT Capsule Device
    this.drawTopOutputCapsule(level, stats);

    // 4. Sandstone Platforms & Ledges
    this.drawPlatforms(level);

    // 5. Hazards
    this.drawHazards(level.hazards);

    // 6. In-Game Switches & Pressure Plates
    this.drawSwitches(level.switches);
    this.drawPressurePlates(level.pressurePlates);

    // 7. Sliding Stone Doors
    this.drawDoors(doors);

    // 8. Four Large Circular Logic Gate Devices (AND ∧, OR ∨, XOR ⊕, NOT ¬)
    if (level.logicGates) {
      this.drawLogicGates(level.logicGates);
    }

    // 9. Clickable Ancient Sandstone Input Panels [ 0 ] [ 1 ]
    if (level.inputPanels) {
      this.drawInputPanels(level.inputPanels);
    }

    // 10. Collectible Diamonds & Upper Character Exit Doors (♂ & ♀)
    this.drawExits(level.exits);
    this.drawGems(level.gems);

    // 11. Particles
    this.drawParticles(particles);

    // 12. Red & Blue Characters
    this.drawCharacter(fireChar);
    this.drawCharacter(waterChar);

    // 13. Final Route Unlocked Highlight Banner
    if (stats.isEscaping) {
      this.drawRouteUnlockedBanner(ctx, canvas);
    }
  }

  private drawBackground(level: Level) {
    const { ctx } = this;

    // Warm golden sandstone wall background
    ctx.fillStyle = "#d4a359";
    ctx.fillRect(0, 0, level.width, level.height);

    // Sandstone brick grid texture with dark mortar lines
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 2;
    const brickW = 80;
    const brickH = 40;

    for (let y = 0; y < level.height; y += brickH) {
      const offsetX = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
      for (let x = -brickW; x < level.width + brickW; x += brickW) {
        ctx.fillStyle = (x + y) % 160 === 0 ? "#caa050" : "#d8aa5d";
        ctx.fillRect(x + offsetX, y, brickW - 2, brickH - 2);
        ctx.strokeRect(x + offsetX, y, brickW - 2, brickH - 2);
      }
    }
  }

  private drawTopOutputCapsule(level: Level, stats: GameStats) {
    const { ctx } = this;
    const combGate = level.logicGates?.find((g) => g.type === "COMBINATION");
    const isOutputActive = combGate ? combGate.output : stats.isEscaping || false;

    const cx = 640;
    const cy = 40;
    const w = 90;
    const h = 75;

    ctx.save();

    // Recessed Sandstone Niche Frame
    ctx.fillStyle = "#1e140a";
    ctx.fillRect(cx - w / 2 - 8, cy - 6, w + 16, h + 12);
    ctx.strokeStyle = "#1a1008";
    ctx.lineWidth = 3.5;
    ctx.strokeRect(cx - w / 2 - 8, cy - 6, w + 16, h + 12);

    // Gold Metallic Top & Bottom Caps
    ctx.fillStyle = "#ca8a04";
    ctx.fillRect(cx - w / 2, cy, w, 12);
    ctx.fillRect(cx - w / 2, cy + h - 12, w, 12);

    ctx.strokeStyle = "#fde047";
    ctx.lineWidth = 2;
    ctx.strokeRect(cx - w / 2, cy, w, 12);
    ctx.strokeRect(cx - w / 2, cy + h - 12, w, 12);

    // Vertical Glass Tube
    const tubeGrad = ctx.createLinearGradient(cx - w / 2, 0, cx + w / 2, 0);
    tubeGrad.addColorStop(0, "#0f172a");
    tubeGrad.addColorStop(0.5, "#1e293b");
    tubeGrad.addColorStop(1, "#0f172a");
    ctx.fillStyle = tubeGrad;
    ctx.fillRect(cx - w / 2 + 6, cy + 12, w - 12, h - 24);

    // Glowing Vertical Energy Beam Inside Capsule
    if (isOutputActive) {
      const beamGrad = ctx.createRadialGradient(cx, cy + h / 2, 4, cx, cy + h / 2, w / 2);
      beamGrad.addColorStop(0, "#86efac");
      beamGrad.addColorStop(0.5, "#22c55e");
      beamGrad.addColorStop(1, "rgba(34, 197, 94, 0)");
      ctx.fillStyle = beamGrad;
      ctx.fillRect(cx - w / 2 + 10, cy + 12, w - 20, h - 24);

      ctx.fillStyle = "#ffffff";
      ctx.fillRect(cx - 8, cy + 12, 16, h - 24);
    } else {
      ctx.fillStyle = "rgba(20, 83, 45, 0.4)";
      ctx.fillRect(cx - 12, cy + 12, 24, h - 24);
    }

    // OUTPUT Label Text Below Capsule
    ctx.fillStyle = isOutputActive ? "#4ade80" : "#fef08a";
    ctx.font = "bold 16px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText("OUTPUT", cx, cy + h + 8);

    ctx.restore();
  }

  private drawSignalWires(wires: Level["signalWires"]) {
    if (!wires) return;
    const { ctx } = this;

    for (const wire of wires) {
      if (wire.points.length < 2) continue;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(wire.points[0].x, wire.points[0].y);
      for (let i = 1; i < wire.points.length; i++) {
        ctx.lineTo(wire.points[i].x, wire.points[i].y);
      }

      if (wire.active) {
        // Glowing Green Signal (1)
        ctx.strokeStyle = "#22c55e";
        ctx.lineWidth = 5;
        ctx.shadowColor = "#86efac";
        ctx.shadowBlur = 10;
        ctx.stroke();

        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = 2;
        ctx.stroke();
      } else {
        // Red Signal (0)
        ctx.strokeStyle = "#ef4444";
        ctx.lineWidth = 4;
        ctx.shadowBlur = 0;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  private drawLogicGates(gates: Level["logicGates"]) {
    if (!gates) return;
    const { ctx } = this;

    for (const gate of gates) {
      if (gate.type === "COMBINATION") continue; // Rendered as top OUTPUT capsule

      ctx.save();
      const radius = 36; // Large Circular Gate Device

      // Outer Gold/Bronze Mechanical Gear Ring
      ctx.fillStyle = "#1e1b18";
      ctx.beginPath();
      ctx.arc(gate.x, gate.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // Distinct Gate Color Accent Ring (AND=purple, OR=blue, XOR=green, NOT=red)
      let accentColor = "#ca8a04";
      let gateSymbol = "∧";

      switch (gate.type) {
        case "AND":
          accentColor = "#a855f7"; // Purple accent
          gateSymbol = "∧";
          break;
        case "OR":
          accentColor = "#38bdf8"; // Blue accent
          gateSymbol = "∨";
          break;
        case "XOR":
          accentColor = "#22c55e"; // Green accent
          gateSymbol = "⊕";
          break;
        case "NOT":
          accentColor = "#ef4444"; // Red accent
          gateSymbol = "¬";
          break;
      }

      // Segmented Color Rim
      ctx.strokeStyle = gate.output ? "#22c55e" : accentColor;
      ctx.lineWidth = 6;
      ctx.shadowColor = gate.output ? "#86efac" : accentColor;
      ctx.shadowBlur = gate.output ? 14 : 4;
      ctx.stroke();

      // Thick Black Outline around circle
      ctx.strokeStyle = "#1a1008";
      ctx.lineWidth = 3.5;
      ctx.shadowBlur = 0;
      ctx.strokeRect(gate.x - radius - 2, gate.y - radius - 2, radius * 2 + 4, radius * 2 + 4);

      // Dark Metallic Inner Circle
      ctx.fillStyle = "#0f172a";
      ctx.beginPath();
      ctx.arc(gate.x, gate.y, radius - 8, 0, Math.PI * 2);
      ctx.fill();

      // Logic Symbol in Center (∧, ∨, ⊕, ¬)
      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 26px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(gateSymbol, gate.x, gate.y);

      // Label Text Above Gate
      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 15px sans-serif";
      ctx.fillText(gate.label, gate.x, gate.y - radius - 10);

      ctx.restore();
    }
  }

  private drawInputPanels(panels: Level["inputPanels"]) {
    if (!panels) return;
    const { ctx } = this;

    for (const panel of panels) {
      ctx.save();

      // Sandstone Control Plaque Base
      ctx.fillStyle = "#b8863b";
      ctx.fillRect(panel.x, panel.y, panel.width, panel.height);

      ctx.strokeStyle = "#1a1008";
      ctx.lineWidth = 3.5;
      ctx.strokeRect(panel.x, panel.y, panel.width, panel.height);

      // Label (INPUT A / INPUT B)
      ctx.fillStyle = "#fef08a";
      ctx.font = "bold 13px sans-serif";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      ctx.fillText(`INPUT ${panel.keyName}`, panel.x + 8, panel.y + panel.height / 2);

      // Buttons [ 0 ] [ 1 ]
      const btnW = 32;
      const btnH = 26;
      const btn0X = panel.x + 82;
      const btn1X = panel.x + 120;
      const btnY = panel.y + 5;

      // Button [ 0 ]
      ctx.fillStyle = panel.value === 0 ? "#ef4444" : "#451a03";
      ctx.fillRect(btn0X, btnY, btnW, btnH);
      ctx.strokeStyle = panel.value === 0 ? "#fca5a5" : "#78350f";
      ctx.lineWidth = 2;
      ctx.strokeRect(btn0X, btnY, btnW, btnH);

      ctx.fillStyle = panel.value === 0 ? "#ffffff" : "#ca8a04";
      ctx.font = "bold 14px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("0", btn0X + btnW / 2, btnY + btnH / 2 + 1);

      // Button [ 1 ]
      ctx.fillStyle = panel.value === 1 ? "#22c55e" : "#451a03";
      ctx.fillRect(btn1X, btnY, btnW, btnH);
      ctx.strokeStyle = panel.value === 1 ? "#86efac" : "#78350f";
      ctx.lineWidth = 2;
      ctx.strokeRect(btn1X, btnY, btnW, btnH);

      ctx.fillStyle = panel.value === 1 ? "#ffffff" : "#ca8a04";
      ctx.fillText("1", btn1X + btnW / 2, btnY + btnH / 2 + 1);

      ctx.restore();
    }
  }

  private drawPlatforms(level: Level) {
    const { ctx } = this;

    for (const p of level.platforms) {
      ctx.save();
      ctx.fillStyle = "#d4a359";
      ctx.fillRect(p.x, p.y, p.width, p.height);

      // Sandstone Bevel Highlights
      ctx.fillStyle = "#e5b86e";
      ctx.fillRect(p.x, p.y, p.width, 3);
      ctx.fillStyle = "#a87832";
      ctx.fillRect(p.x, p.y + p.height - 3, p.width, 3);

      // Thick Black Outline (Screenshot match!)
      ctx.strokeStyle = "#1a1008";
      ctx.lineWidth = 3.5;
      ctx.strokeRect(p.x, p.y, p.width, p.height);
      ctx.restore();
    }

    for (const mp of level.movingPlatforms) {
      ctx.save();
      ctx.fillStyle = mp.active ? "#eab308" : "#8c733e";
      ctx.fillRect(mp.x, mp.y, mp.width, mp.height);

      ctx.fillStyle = "#ca8a04";
      ctx.fillRect(mp.x, mp.y, 8, mp.height);
      ctx.fillRect(mp.x + mp.width - 8, mp.y, 8, mp.height);

      ctx.strokeStyle = "#1a1008";
      ctx.lineWidth = 3;
      ctx.strokeRect(mp.x, mp.y, mp.width, mp.height);
      ctx.restore();
    }
  }

  private drawHazards(hazards: Level["hazards"]) {
    const { ctx } = this;
    for (const h of hazards) {
      ctx.save();
      if (h.type === "water") {
        ctx.fillStyle = "rgba(56, 189, 248, 0.85)";
        ctx.fillRect(h.x, h.y, h.width, h.height);
      } else if (h.type === "fire") {
        ctx.fillStyle = "#ef4444";
        ctx.fillRect(h.x, h.y, h.width, h.height);
      }
      ctx.restore();
    }
  }

  private drawSwitches(switches: Level["switches"]) {
    const { ctx } = this;
    for (const s of switches) {
      ctx.save();
      ctx.fillStyle = "#ca8a04";
      ctx.fillRect(s.x, s.y + s.height - 6, s.width, 6);

      const angle = s.active ? Math.PI / 4 : -Math.PI / 4;
      const cx = s.x + s.width / 2;
      const cy = s.y + s.height - 3;

      ctx.strokeStyle = "#eab308";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.sin(angle) * 18, cy - Math.cos(angle) * 18);
      ctx.stroke();

      ctx.fillStyle = s.active ? "#22c55e" : "#ef4444";
      ctx.beginPath();
      ctx.arc(cx + Math.sin(angle) * 18, cy - Math.cos(angle) * 18, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawPressurePlates(plates: Level["pressurePlates"]) {
    const { ctx } = this;
    for (const plate of plates) {
      ctx.save();
      const height = plate.pressed ? 4 : 8;
      const y = plate.pressed ? plate.y + 4 : plate.y;

      ctx.fillStyle = plate.pressed ? "#22c55e" : "#ca8a04";
      ctx.fillRect(plate.x, y, plate.width, height);

      ctx.strokeStyle = "#1a1008";
      ctx.lineWidth = 1.5;
      ctx.strokeRect(plate.x, y, plate.width, height);
      ctx.restore();
    }
  }

  private drawDoors(doors: Door[]) {
    const { ctx } = this;
    for (const door of doors) {
      ctx.save();
      ctx.fillStyle = door.open ? "#281a0e" : "#eab308";
      ctx.fillRect(door.x, door.y, door.width, door.height);

      ctx.strokeStyle = "#1a1008";
      ctx.lineWidth = 3;
      ctx.strokeRect(door.x, door.y, door.width, door.height);
      ctx.restore();
    }
  }

  private drawExits(exits: Level["exits"]) {
    const { ctx } = this;
    const drawDoor = (
      exit: Level["exits"]["fire"],
      primaryColor: string,
      label: string
    ) => {
      ctx.save();
      ctx.fillStyle = "#1e140a";
      ctx.fillRect(exit.x, exit.y, exit.width, exit.height);

      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3.5;
      ctx.strokeRect(exit.x, exit.y, exit.width, exit.height);

      ctx.fillStyle = primaryColor;
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText(label, exit.x + exit.width / 2, exit.y + exit.height / 2 + 6);
      ctx.restore();
    };

    drawDoor(exits.fire, "#ef4444", "♂");
    drawDoor(exits.water, "#38bdf8", "♀");
  }

  private drawGems(gems: Level["gems"]) {
    const { ctx } = this;
    for (const gem of gems) {
      if (gem.collected) continue;
      const cx = gem.x + gem.width / 2;
      const cy = gem.y + gem.height / 2 + Math.sin(this.time * 4 + gem.x) * 3;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.fillStyle = gem.type === "fire_gem" ? "#ef4444" : "#38bdf8";
      ctx.beginPath();
      ctx.moveTo(0, -10);
      ctx.lineTo(8, 0);
      ctx.lineTo(0, 10);
      ctx.lineTo(-8, 0);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  private drawParticles(particles: Particle[]) {
    const { ctx } = this;
    for (const p of particles) {
      const alpha = Math.max(0, p.life / p.maxLife);
      ctx.save();
      ctx.globalAlpha = alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private drawCharacter(char: Character) {
    const { ctx } = this;
    if (!char.isAlive) return;

    const cx = char.x + char.width / 2;
    const cy = char.y + char.height / 2;

    ctx.save();
    const isRed = char.type === "fire";
    const primaryColor = isRed ? "#ef4444" : "#38bdf8";

    // Glow aura around character
    const aura = ctx.createRadialGradient(cx, cy, 3, cx, cy, 20);
    aura.addColorStop(0, primaryColor);
    aura.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(cx, cy, 20, 0, Math.PI * 2);
    ctx.fill();

    // Body Silhouette
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 2, char.width / 2, char.height / 2 - 2, 0, 0, Math.PI * 2);
    ctx.fill();

    // Eyes
    const eyeOffset = char.facing === "right" ? 3 : -3;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx + eyeOffset - 4, char.y + 16, 3.5, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffset + 4, char.y + 16, 3.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(cx + eyeOffset - 3, char.y + 16, 1.8, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffset + 5, char.y + 16, 1.8, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private drawRouteUnlockedBanner(
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement
  ) {
    ctx.save();
    ctx.fillStyle = "rgba(22, 101, 52, 0.9)";
    ctx.fillRect(canvas.width / 2 - 200, 16, 400, 44);

    ctx.strokeStyle = "#4ade80";
    ctx.lineWidth = 3;
    ctx.strokeRect(canvas.width / 2 - 200, 16, 400, 44);

    ctx.fillStyle = "#fef08a";
    ctx.font = "bold 18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      "FINAL ROUTE UNLOCKED! REACH EXITS! 🎉",
      canvas.width / 2,
      43
    );
    ctx.restore();
  }
}
