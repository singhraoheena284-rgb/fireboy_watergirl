import { Door } from "../entities/Door";
import { FireCharacter } from "../entities/FireCharacter";
import { WaterCharacter } from "../entities/WaterCharacter";
import type { InputManager } from "../input/InputManager";
import { CollisionSystem } from "../systems/CollisionSystem";
import { HazardSystem } from "../systems/HazardSystem";
import { LevelSystem } from "../systems/LevelSystem";
import { LogicSystem } from "../systems/LogicSystem";
import { ParticleSystem } from "../systems/ParticleSystem";
import { PhysicsSystem } from "../systems/PhysicsSystem";
import { PuzzleSystem } from "../systems/PuzzleSystem";
import type { GameStats, Level } from "../types/game";
import type { Renderer } from "./Renderer";
import { SoundSystem } from "./SoundSystem";

type GameLoopOptions = {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  input: InputManager;
  renderer: Renderer;
  level: Level;
  onStatsUpdate?: (stats: GameStats) => void;
};

export class GameLoop {
  private animationFrame = 0;
  private lastTime = 0;
  private running = false;

  public fireChar: FireCharacter;
  public waterChar: WaterCharacter;
  public doors: Door[] = [];

  private physicsSystem = new PhysicsSystem();
  private collisionSystem = new CollisionSystem();
  private puzzleSystem = new PuzzleSystem();
  private logicSystem = new LogicSystem();
  private hazardSystem = new HazardSystem();
  private particleSystem = new ParticleSystem();
  private levelSystem = new LevelSystem();
  public soundSystem = new SoundSystem();

  constructor(private options: GameLoopOptions) {
    this.fireChar = new FireCharacter(options.level.spawns.fire);
    this.waterChar = new WaterCharacter(options.level.spawns.water);
    this.initLevelEntities();
  }

  private initLevelEntities() {
    // Instantiate Door entities from level data
    this.doors = this.options.level.doors.map(
      (d) =>
        new Door(
          d.id,
          d.x,
          d.y,
          d.width,
          d.height,
          d.startY,
          d.targetY,
          d.color
        )
    );

    // Initialize level system counters
    this.levelSystem.initLevel(this.options.level);
    this.logicSystem.reset();
  }

  public restartLevel() {
    this.fireChar.reset(this.options.level.spawns.fire);
    this.waterChar.reset(this.options.level.spawns.water);

    // Reset gems
    for (const gem of this.options.level.gems) {
      gem.collected = false;
    }

    // Reset pressure plates
    for (const plate of this.options.level.pressurePlates) {
      plate.pressed = false;
    }

    // Reset switches
    for (const s of this.options.level.switches) {
      s.active = false;
    }

    this.initLevelEntities();
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.lastTime = performance.now();
    this.animationFrame = requestAnimationFrame(this.frame);
  }

  private frame = (time: number) => {
    if (!this.running) return;

    const delta = Math.min((time - this.lastTime) / 1000, 0.033);
    this.lastTime = time;

    const { input, level, renderer, onStatsUpdate } = this.options;

    // Global Key Handling: R = Restart, P/Escape = Pause, M = Mute
    if (input.wasPressed("KeyR")) {
      this.restartLevel();
    }

    if (input.wasPressed("KeyP") || input.wasPressed("Escape")) {
      if (this.levelSystem.stats.status === "playing") {
        this.levelSystem.stats.status = "paused";
      } else if (this.levelSystem.stats.status === "paused") {
        this.levelSystem.stats.status = "playing";
      }
    }

    if (input.wasPressed("KeyM")) {
      this.soundSystem.muted = !this.soundSystem.muted;
    }

    // Engine updates during playing state
    if (this.levelSystem.stats.status === "playing") {
      this.physicsSystem.update(
        delta,
        level,
        this.fireChar,
        this.waterChar,
        input
      );
      this.collisionSystem.update(
        delta,
        level,
        this.fireChar,
        this.waterChar,
        this.doors
      );
      this.puzzleSystem.update(
        delta,
        level,
        this.fireChar,
        this.waterChar,
        this.doors
      );
      this.logicSystem.update(
        delta,
        level,
        this.doors,
        this.levelSystem.stats,
        () => this.soundSystem.playVictory()
      );
      this.hazardSystem.update(
        delta,
        level,
        this.fireChar,
        this.waterChar,
        () => this.soundSystem.playSplash()
      );
      this.particleSystem.update(delta, level, this.fireChar, this.waterChar);
      this.levelSystem.update(
        delta,
        level,
        this.fireChar,
        this.waterChar,
        this.particleSystem,
        () => this.soundSystem.playGemPickup(),
        () => this.soundSystem.playVictory()
      );
    }

    // Render 2D Canvas Scene
    renderer.render(
      level,
      this.fireChar,
      this.waterChar,
      this.doors,
      this.particleSystem.particles,
      this.levelSystem.stats
    );

    // Notify React UI layer of updated stats
    if (onStatsUpdate) {
      onStatsUpdate(this.levelSystem.stats);
    }

    input.update();
    this.animationFrame = requestAnimationFrame(this.frame);
  };

  destroy() {
    this.running = false;
    cancelAnimationFrame(this.animationFrame);
    this.options.input.destroy();
  }
}
