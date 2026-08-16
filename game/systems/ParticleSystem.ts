import type { Character } from "../entities/Character";
import type { Level, Particle } from "../types/game";

export class ParticleSystem {
  public particles: Particle[] = [];

  update(dt: number, level: Level, fireChar: Character, waterChar: Character) {
    // 1. Update existing particles
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.life -= dt;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 20 * dt; // mild particle gravity
    }

    // 2. Emit aura particles for active characters
    if (fireChar.isAlive && Math.random() < 0.4) {
      this.spawnFireParticle(
        fireChar.x + Math.random() * fireChar.width,
        fireChar.y + fireChar.height - 4
      );
    }

    if (waterChar.isAlive && Math.random() < 0.4) {
      this.spawnWaterParticle(
        waterChar.x + Math.random() * waterChar.width,
        waterChar.y + waterChar.height - 4
      );
    }

    // 3. Ambient hazard pool bubbling particles
    if (Math.random() < 0.3) {
      for (const hazard of level.hazards) {
        if (Math.random() < 0.2) {
          const px = hazard.x + Math.random() * hazard.width;
          const py = hazard.y + 4;
          if (hazard.type === "fire") {
            this.spawnFireParticle(px, py);
          } else if (hazard.type === "water") {
            this.spawnWaterParticle(px, py);
          }
        }
      }
    }
  }

  public spawnFireParticle(x: number, y: number) {
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 30,
      vy: -Math.random() * 40 - 20,
      size: Math.random() * 4 + 2,
      color: Math.random() < 0.5 ? "#f97316" : "#facc15",
      life: 0.4 + Math.random() * 0.3,
      maxLife: 0.7,
      shape: "circle"
    });
  }

  public spawnWaterParticle(x: number, y: number) {
    this.particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 20,
      vy: Math.random() * 30 + 10,
      size: Math.random() * 3 + 2,
      color: Math.random() < 0.5 ? "#38bdf8" : "#60a5fa",
      life: 0.4 + Math.random() * 0.3,
      maxLife: 0.7,
      shape: "circle"
    });
  }

  public spawnSparkles(x: number, y: number, color: string, count = 12) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 120 + 40;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 5 + 3,
        color,
        life: 0.5 + Math.random() * 0.4,
        maxLife: 0.9,
        shape: "spark"
      });
    }
  }
}
