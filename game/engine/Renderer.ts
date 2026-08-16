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
    this.time += 0.016; // Increment animation time (~60 FPS)
    const { ctx, canvas } = this;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 1. Forest Temple Background Wall & Visual Atmosphere
    this.drawBackground(level);

    // 2. Background In-Game Tutorial Text Hints (Level 1)
    if (level.id === 1) {
      this.drawLevel1TutorialText(ctx, level);
    }

    // 3. Hazards (Lava, Toxic Acid, Water)
    this.drawHazards(level.hazards);

    // 4. Platforms & Slopes
    this.drawPlatforms(level);

    // 5. Switches & Levers
    this.drawSwitches(level.switches);

    // 6. Pressure Plates & Sliding Gates
    this.drawPressurePlates(level.pressurePlates);
    this.drawDoors(doors);

    // 7. Pushable Metallic Blocks
    this.drawPushableBlocks(level.pushableBlocks);

    // 8. Collectible Gems & Exit Doors
    this.drawExits(level.exits);
    this.drawGems(level.gems);

    // 9. Particle Effects
    this.drawParticles(particles);

    // 10. Characters (Fireboy & Watergirl)
    this.drawCharacter(fireChar);
    this.drawCharacter(waterChar);
  }

  private drawBackground(level: Level) {
    const { ctx } = this;

    // Base dark green/brown temple brick background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, level.height);
    bgGrad.addColorStop(0, "#1c2214");
    bgGrad.addColorStop(0.5, "#252b1b");
    bgGrad.addColorStop(1, "#151910");
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, level.width, level.height);

    // Stone brick grid pattern
    ctx.strokeStyle = "rgba(0, 0, 0, 0.25)";
    ctx.lineWidth = 2;
    const brickW = 64;
    const brickH = 32;

    for (let y = 0; y < level.height; y += brickH) {
      const offsetX = (y / brickH) % 2 === 0 ? 0 : brickW / 2;
      for (let x = -brickW; x < level.width + brickW; x += brickW) {
        ctx.fillStyle = (x + y) % 128 === 0 ? "#232b1a" : "#1e2617";
        ctx.fillRect(x + offsetX, y, brickW - 2, brickH - 2);
        ctx.strokeRect(x + offsetX, y, brickW - 2, brickH - 2);
      }
    }

    // Atmospheric Light Rays streaming down from ceiling arches
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    const rayPositions = [200, 640, 1000];
    rayPositions.forEach((rx) => {
      const rayGrad = ctx.createLinearGradient(rx, 0, rx + 80, level.height);
      rayGrad.addColorStop(0, "rgba(255, 245, 200, 0.08)");
      rayGrad.addColorStop(0.6, "rgba(255, 245, 200, 0.03)");
      rayGrad.addColorStop(1, "rgba(0, 0, 0, 0)");

      ctx.fillStyle = rayGrad;
      ctx.beginPath();
      ctx.moveTo(rx - 40, 0);
      ctx.lineTo(rx + 80, 0);
      ctx.lineTo(rx + 220, level.height);
      ctx.lineTo(rx - 80, level.height);
      ctx.closePath();
      ctx.fill();
    });
    ctx.restore();

    // Hanging vines decoration from top ceiling
    ctx.strokeStyle = "#4d7c0f";
    ctx.lineWidth = 3;
    const vinePositions = [120, 360, 580, 840, 1100];
    vinePositions.forEach((vx, idx) => {
      ctx.beginPath();
      ctx.moveTo(vx, 0);
      const vineLen = 60 + (idx % 3) * 30;
      ctx.quadraticCurveTo(
        vx + Math.sin(this.time * 2 + idx) * 10,
        vineLen / 2,
        vx,
        vineLen
      );
      ctx.stroke();

      // Leaves
      ctx.fillStyle = "#65a30d";
      ctx.beginPath();
      ctx.arc(vx + 4, vineLen / 2, 4, 0, Math.PI * 2);
      ctx.arc(vx - 4, vineLen * 0.8, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  private drawLevel1TutorialText(ctx: CanvasRenderingContext2D, level: Level) {
    ctx.save();
    ctx.font = "bold 15px sans-serif";

    // "USE A,W,D TO MOVE WATERGIRL..."
    ctx.fillStyle = "#38bdf8";
    ctx.shadowColor = "#000";
    ctx.shadowBlur = 4;
    ctx.fillText("USE A,W,D TO MOVE WATERGIRL...", 140, 530);

    // "...USE ← ↑ → TO MOVE FIREBOY"
    ctx.fillStyle = "#ef4444";
    ctx.fillText("...USE ← ↑ → TO MOVE FIREBOY", 140, 600);

    // "...NEVER MIX FIRE & WATER !"
    ctx.fillStyle = "#eab308";
    ctx.font = "bold 18px sans-serif";
    ctx.fillText("...NEVER MIX FIRE & WATER !", 520, 620);

    ctx.restore();
  }

  private drawHazards(hazards: Level["hazards"]) {
    const { ctx } = this;

    for (const h of hazards) {
      ctx.save();

      if (h.type === "fire") {
        // Red Lava Pool
        const grad = ctx.createLinearGradient(h.x, h.y, h.x, h.y + h.height);
        grad.addColorStop(0, "#ef4444");
        grad.addColorStop(0.4, "#dc2626");
        grad.addColorStop(1, "#7f1d1d");
        ctx.fillStyle = grad;
        ctx.fillRect(h.x, h.y, h.width, h.height);

        // Animated Lava Wave Crests
        ctx.fillStyle = "#facc15";
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        for (let x = 0; x <= h.width; x += 10) {
          const waveY = h.y + Math.sin(this.time * 7 + (h.x + x) * 0.08) * 4;
          ctx.lineTo(h.x + x, waveY);
        }
        ctx.lineTo(h.x + h.width, h.y + 8);
        ctx.lineTo(h.x, h.y + 8);
        ctx.fill();
      } else if (h.type === "water") {
        // Blue Water Pool
        const grad = ctx.createLinearGradient(h.x, h.y, h.x, h.y + h.height);
        grad.addColorStop(0, "rgba(56, 189, 248, 0.85)");
        grad.addColorStop(1, "rgba(3, 105, 161, 0.95)");
        ctx.fillStyle = grad;
        ctx.fillRect(h.x, h.y, h.width, h.height);

        // Animated Water Ripples
        ctx.strokeStyle = "#e0f2fe";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(h.x, h.y + 3);
        for (let x = 0; x <= h.width; x += 12) {
          const waveY = h.y + 3 + Math.sin(this.time * 5 + (h.x + x) * 0.06) * 3;
          ctx.lineTo(h.x + x, waveY);
        }
        ctx.stroke();
      } else if (h.type === "toxic") {
        // Toxic Green Sludge Pool
        const grad = ctx.createLinearGradient(h.x, h.y, h.x, h.y + h.height);
        grad.addColorStop(0, "#22c55e");
        grad.addColorStop(1, "#14532d");
        ctx.fillStyle = grad;
        ctx.fillRect(h.x, h.y, h.width, h.height);

        // Bubbling crests
        ctx.fillStyle = "#86efac";
        ctx.beginPath();
        ctx.moveTo(h.x, h.y);
        for (let x = 0; x <= h.width; x += 14) {
          const waveY = h.y + Math.sin(this.time * 4 + (h.x + x) * 0.05) * 3;
          ctx.lineTo(h.x + x, waveY);
        }
        ctx.lineTo(h.x + h.width, h.y + 6);
        ctx.lineTo(h.x, h.y + 6);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  private drawPlatforms(level: Level) {
    const { ctx } = this;

    // Static Platforms & Slopes
    for (const p of level.platforms) {
      ctx.save();

      if (p.slope) {
        // Render Slope Polygon Ramps
        ctx.beginPath();
        if (p.slope === "up-right") {
          ctx.moveTo(p.x, p.y + p.height);
          ctx.lineTo(p.x + p.width, p.y);
          ctx.lineTo(p.x + p.width, p.y + p.height);
        } else if (p.slope === "up-left") {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.width, p.y + p.height);
          ctx.lineTo(p.x, p.y + p.height);
        }
        ctx.closePath();

        ctx.fillStyle = p.color || "#333d29";
        ctx.fill();

        ctx.strokeStyle = "#4d5b3e";
        ctx.lineWidth = 3;
        ctx.stroke();

        // Slope Top Moss Highlight
        ctx.strokeStyle = "#65a30d";
        ctx.lineWidth = 4;
        ctx.beginPath();
        if (p.slope === "up-right") {
          ctx.moveTo(p.x, p.y + p.height);
          ctx.lineTo(p.x + p.width, p.y);
        } else {
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x + p.width, p.y + p.height);
        }
        ctx.stroke();
      } else {
        // Render Rectangular Stone Platform
        ctx.fillStyle = p.color || "#333d29";
        ctx.fillRect(p.x, p.y, p.width, p.height);

        // Stone bevel lines
        ctx.fillStyle = "#1e2617";
        ctx.fillRect(p.x, p.y + p.height - 4, p.width, 4);

        ctx.strokeStyle = "#4d5b3e";
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.width, p.height);

        // Top Moss Crust
        ctx.fillStyle = "#65a30d";
        ctx.fillRect(p.x, p.y, p.width, 4);

        // Grass/Vine tufts on top edge
        ctx.fillStyle = "#4d7c0f";
        for (let gx = p.x + 8; gx < p.x + p.width - 8; gx += 18) {
          ctx.fillRect(gx, p.y - 3, 5, 3);
        }
      }

      ctx.restore();
    }

    // Moving Platforms / Elevators
    for (const mp of level.movingPlatforms) {
      ctx.save();
      // Elevator base structure
      ctx.fillStyle = "#4b5563";
      ctx.fillRect(mp.x, mp.y, mp.width, mp.height);

      // Distinctive color bar based on elevator ID
      const isYellow = mp.id.includes("yellow");
      ctx.fillStyle = isYellow ? "#eab308" : "#a855f7";
      ctx.fillRect(mp.x + 4, mp.y + 2, mp.width - 8, 4);

      // Gold / Purple border
      ctx.strokeStyle = isYellow ? "#fde047" : "#c084fc";
      ctx.lineWidth = 2;
      ctx.strokeRect(mp.x, mp.y, mp.width, mp.height);

      ctx.restore();
    }
  }

  private drawSwitches(switches: Level["switches"]) {
    const { ctx } = this;
    for (const s of switches) {
      ctx.save();

      // Lever Base Plate
      ctx.fillStyle = "#eab308";
      ctx.fillRect(s.x, s.y + s.height - 6, s.width, 6);

      // Pivot Handle Angle
      const angle = s.active ? Math.PI / 4 : -Math.PI / 4;
      const cx = s.x + s.width / 2;
      const cy = s.y + s.height - 3;

      ctx.strokeStyle = "#ca8a04";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.sin(angle) * 20, cy - Math.cos(angle) * 20);
      ctx.stroke();

      // Lever Knob Head
      ctx.fillStyle = "#ef4444";
      ctx.beginPath();
      ctx.arc(
        cx + Math.sin(angle) * 20,
        cy - Math.cos(angle) * 20,
        5,
        0,
        Math.PI * 2
      );
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

      const isPurple = plate.id.includes("2");
      ctx.fillStyle = plate.pressed
        ? "#22c55e"
        : isPurple
        ? "#a855f7"
        : "#eab308";
      ctx.fillRect(plate.x, y, plate.width, height);

      ctx.strokeStyle = "#1f2937";
      ctx.lineWidth = 1;
      ctx.strokeRect(plate.x, y, plate.width, height);

      ctx.restore();
    }
  }

  private drawDoors(doors: Door[]) {
    const { ctx } = this;
    for (const door of doors) {
      ctx.save();

      // Sliding Barrier Gate
      ctx.fillStyle = "#64748b";
      ctx.fillRect(door.x, door.y, door.width, door.height);

      ctx.strokeStyle = "#334155";
      ctx.lineWidth = 2;
      ctx.strokeRect(door.x, door.y, door.width, door.height);

      // Gate lines / grill
      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 2;
      for (let gy = door.y + 10; gy < door.y + door.height - 10; gy += 15) {
        ctx.beginPath();
        ctx.moveTo(door.x + 2, gy);
        ctx.lineTo(door.x + door.width - 2, gy);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  private drawPushableBlocks(blocks: Level["pushableBlocks"]) {
    const { ctx } = this;
    for (const b of blocks) {
      ctx.save();

      // Silver metal box body
      ctx.fillStyle = "#94a3b8";
      ctx.fillRect(b.x, b.y, b.width, b.height);

      // Gold corner plates (Matching Image 3 metal block!)
      ctx.fillStyle = "#eab308";
      const cornerSize = 10;
      ctx.fillRect(b.x, b.y, cornerSize, cornerSize);
      ctx.fillRect(b.x + b.width - cornerSize, b.y, cornerSize, cornerSize);
      ctx.fillRect(b.x, b.y + b.height - cornerSize, cornerSize, cornerSize);
      ctx.fillRect(
        b.x + b.width - cornerSize,
        b.y + b.height - cornerSize,
        cornerSize,
        cornerSize
      );

      // Crossbar rivets frame
      ctx.strokeStyle = "#475569";
      ctx.lineWidth = 3;
      ctx.strokeRect(b.x, b.y, b.width, b.height);

      ctx.beginPath();
      ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x + b.width, b.y + b.height);
      ctx.moveTo(b.x + b.width, b.y);
      ctx.lineTo(b.x, b.y + b.height);
      ctx.stroke();

      ctx.restore();
    }
  }

  private drawExits(exits: Level["exits"]) {
    const { ctx } = this;

    const drawDoor = (
      exit: Level["exits"]["fire"],
      primaryColor: string,
      glowColor: string,
      symbol: string
    ) => {
      ctx.save();

      // Stone doorframe border
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(exit.x - 4, exit.y - 6, exit.width + 8, exit.height + 6);

      // Archway interior
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(exit.x, exit.y, exit.width, exit.height);

      // Glowing interior arch when player inside
      const glow = ctx.createRadialGradient(
        exit.x + exit.width / 2,
        exit.y + exit.height / 2,
        4,
        exit.x + exit.width / 2,
        exit.y + exit.height / 2,
        35
      );
      glow.addColorStop(
        0,
        exit.occupied ? glowColor : "rgba(255, 255, 255, 0.1)"
      );
      glow.addColorStop(1, "rgba(0, 0, 0, 0.8)");
      ctx.fillStyle = glow;
      ctx.fillRect(exit.x + 4, exit.y + 4, exit.width - 8, exit.height - 8);

      ctx.strokeStyle = primaryColor;
      ctx.lineWidth = 3;
      ctx.strokeRect(exit.x, exit.y, exit.width, exit.height);

      // Symbol Emblem (♂ for Fireboy, ♀ for Watergirl as in original game!)
      ctx.fillStyle = primaryColor;
      ctx.font = "bold 24px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(
        symbol,
        exit.x + exit.width / 2,
        exit.y + exit.height / 2 - 4
      );

      ctx.restore();
    };

    drawDoor(exits.fire, "#ef4444", "#fde047", "♂");
    drawDoor(exits.water, "#38bdf8", "#e0f2fe", "♀");
  }

  private drawGems(gems: Level["gems"]) {
    const { ctx } = this;

    for (const gem of gems) {
      if (gem.collected) continue;

      const cx = gem.x + gem.width / 2;
      const cy =
        gem.y + gem.height / 2 + Math.sin(this.time * 4 + gem.x) * 4; // Floating animation

      ctx.save();
      ctx.translate(cx, cy);

      const isFire = gem.type === "fire_gem";
      const mainColor = isFire ? "#ef4444" : "#38bdf8";
      const highlightColor = isFire ? "#fde047" : "#e0f2fe";

      // Shiny Aura
      const aura = ctx.createRadialGradient(0, 0, 2, 0, 0, 16);
      aura.addColorStop(0, mainColor);
      aura.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = aura;
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();

      // 3D Faceted Diamond Shape
      ctx.fillStyle = mainColor;
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(9, 0);
      ctx.lineTo(0, 11);
      ctx.lineTo(-9, 0);
      ctx.closePath();
      ctx.fill();

      // Facet Highlight
      ctx.fillStyle = highlightColor;
      ctx.beginPath();
      ctx.moveTo(0, -11);
      ctx.lineTo(4, 0);
      ctx.lineTo(0, 4);
      ctx.lineTo(-4, 0);
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

    if (!char.isAlive) {
      // Death pop animation
      ctx.save();
      ctx.globalAlpha = Math.max(0, char.deathTimer / 0.8);
      ctx.fillStyle = char.type === "fire" ? "#ef4444" : "#38bdf8";
      ctx.beginPath();
      ctx.arc(
        char.x + char.width / 2,
        char.y + char.height / 2,
        28 * (1 - char.deathTimer / 0.8),
        0,
        Math.PI * 2
      );
      ctx.fill();
      ctx.restore();
      return;
    }

    const cx = char.x + char.width / 2;
    const cy = char.y + char.height / 2;

    ctx.save();

    const isFire = char.type === "fire";
    const primaryColor = isFire ? "#ef4444" : "#38bdf8";
    const secondaryColor = isFire ? "#facc15" : "#93c5fd";

    // Dynamic bobbing for character movement
    const bounce = Math.sin(this.time * 12) * (Math.abs(char.vx) > 10 ? 3 : 1);

    // 1. Character Silhouette Body (rounded teardrop / flame body)
    ctx.fillStyle = primaryColor;
    ctx.beginPath();
    ctx.ellipse(
      cx,
      cy + 2,
      char.width / 2,
      char.height / 2 - 2,
      0,
      0,
      Math.PI * 2
    );
    ctx.fill();

    // 2. Character Head Feature
    if (isFire) {
      // Fireboy Flame Head Spikes (Matching Image 5 cute flame head!)
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.moveTo(cx - 10, char.y + 8);
      ctx.quadraticCurveTo(
        cx - 14,
        char.y - 14 + bounce,
        cx - 4,
        char.y - 2 + bounce
      );
      ctx.quadraticCurveTo(
        cx,
        char.y - 20 + bounce,
        cx + 4,
        char.y - 2 + bounce
      );
      ctx.quadraticCurveTo(
        cx + 14,
        char.y - 14 + bounce,
        cx + 10,
        char.y + 8
      );
      ctx.fill();
    } else {
      // Watergirl Teardrop Ponytail Head (Matching Image 5 cute water droplet head!)
      ctx.fillStyle = secondaryColor;
      ctx.beginPath();
      ctx.arc(cx, char.y + 2 + bounce, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Expressive Eyes
    const eyeOffset = char.facing === "right" ? 3 : -3;
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(cx + eyeOffset - 4, char.y + 16, 4, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffset + 4, char.y + 16, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(cx + eyeOffset - 3, char.y + 16, 2, 0, Math.PI * 2);
    ctx.arc(cx + eyeOffset + 5, char.y + 16, 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
