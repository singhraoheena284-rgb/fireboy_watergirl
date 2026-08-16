export class InputManager {
  private keys = new Set<string>();
  private pressedThisFrame = new Set<string>();

  constructor() {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", this.onKeyDown);
      window.addEventListener("keyup", this.onKeyUp);
    }
  }

  private onKeyDown = (event: KeyboardEvent) => {
    if (!this.keys.has(event.code)) {
      this.pressedThisFrame.add(event.code);
    }
    this.keys.add(event.code);

    if (
      [
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "KeyW",
        "KeyA",
        "KeyS",
        "KeyD",
        "Space"
      ].includes(event.code)
    ) {
      event.preventDefault();
    }
  };

  private onKeyUp = (event: KeyboardEvent) => {
    this.keys.delete(event.code);
  };

  isDown(code: string): boolean {
    return this.keys.has(code);
  }

  wasPressed(code: string): boolean {
    return this.pressedThisFrame.has(code);
  }

  update() {
    this.pressedThisFrame.clear();
  }

  destroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("keydown", this.onKeyDown);
      window.removeEventListener("keyup", this.onKeyUp);
    }
    this.keys.clear();
    this.pressedThisFrame.clear();
  }
}
