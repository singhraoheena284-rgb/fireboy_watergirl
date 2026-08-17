"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createGame } from "@/game/engine/createGame";
import type { GameStats, Level } from "@/game/types/game";
import { getLevel } from "@/game/levels";

export default function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const levelNum = parseInt(searchParams.get("level") || "1", 10);
  const [levelData, setLevelData] = useState<Level | null>(null);
  const [stats, setStats] = useState<GameStats>({
    fireGemsCollected: 0,
    fireGemsTotal: 0,
    waterGemsCollected: 0,
    waterGemsTotal: 0,
    elapsedSeconds: 0,
    status: "playing"
  });

  const [isMuted, setIsMuted] = useState(false);

  const gameInstanceRef = useRef<{
    start: () => void;
    restart: () => void;
    destroy: () => void;
  } | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const lvl = getLevel(levelNum);
    setLevelData(lvl);

    const game = createGame(canvasRef.current, levelNum, (newStats: GameStats) => {
      setStats({ ...newStats });
    });

    gameInstanceRef.current = game;
    game.start();

    return () => {
      game.destroy();
      gameInstanceRef.current = null;
    };
  }, [levelNum]);

  const handleRestart = () => {
    if (gameInstanceRef.current) {
      gameInstanceRef.current.restart();
    }
  };

  const toggleSound = () => {
    setIsMuted(!isMuted);
    const event = new KeyboardEvent("keydown", { code: "KeyM" });
    window.dispatchEvent(event);
  };

  const togglePause = () => {
    const event = new KeyboardEvent("keydown", { code: "KeyP" });
    window.dispatchEvent(event);
  };

  // Canvas Click Handler for Ancient Sandstone Input Panels [ 0 ] [ 1 ]
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !levelData || !levelData.inputPanels) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = 1280 / rect.width;
    const scaleY = 720 / rect.height;
    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

    for (const panel of levelData.inputPanels) {
      const btn0X = panel.x + 80;
      const btn1X = panel.x + 118;
      const btnY = panel.y + 5;
      const btnW = 32;
      const btnH = 26;

      // Clicked [ 0 ]
      if (
        clickX >= btn0X &&
        clickX <= btn0X + btnW &&
        clickY >= btnY &&
        clickY <= btnY + btnH
      ) {
        panel.value = 0;
        break;
      }

      // Clicked [ 1 ]
      if (
        clickX >= btn1X &&
        clickX <= btn1X + btnW &&
        clickY >= btnY &&
        clickY <= btnY + btnH
      ) {
        panel.value = 1;
        break;
      }
    }
  };

  // 5-Minute Countdown Timer (05:00 -> 00:00)
  const formatCountdown = (elapsed: number) => {
    const rem = Math.max(0, 300 - Math.floor(elapsed));
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatTimeRemaining = (elapsed: number) => {
    const rem = Math.max(0, 300 - Math.floor(elapsed));
    const m = Math.floor(rem / 60);
    const s = rem % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  return (
    <main className="game-page">
      <div className="game-shell">
        {/* Minimal Sandstone Top HUD Bar matching Screenshot! */}
        <div className="game-hud-bar">
          <div className="hud-group">
            <button
              className="parchment-button hud-btn"
              onClick={togglePause}
              title="Pause (P/ESC)"
            >
              ◀ BACK
            </button>
          </div>

          {/* Wooden Timer Box Centered at Top (Screenshot Match!) */}
          <div className="hud-timer-oval">
            <span>{formatCountdown(stats.elapsedSeconds)}</span>
          </div>

          <div className="hud-actions">
            <button
              className="parchment-button hud-btn"
              onClick={toggleSound}
              title="Toggle Audio (M)"
            >
              {isMuted ? "🔇" : "🔊"}
            </button>
            <button
              className="parchment-button hud-btn"
              onClick={handleRestart}
              title="Restart Level (R)"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Game Canvas Viewport */}
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="game-canvas"
            width={1280}
            height={720}
            onClick={handleCanvasClick}
            aria-label="Binary Bridge Sandstone Game Canvas"
          />

          {/* Victory Overlay Modal */}
          {stats.status === "victory" && (
            <div className="parchment-modal-overlay">
              <div className="parchment-card">
                <h2>LEVEL COMPLETE 🎉</h2>
                <h3 style={{ color: "#16a34a", margin: "0 0 16px 0" }}>
                  LOGIC TEMPLE CLEARED
                </h3>
                <div
                  style={{
                    background: "rgba(0,0,0,0.15)",
                    padding: "16px",
                    borderRadius: "10px",
                    marginBottom: "24px",
                    textAlign: "left"
                  }}
                >
                  <p>⏱️ TIME REMAINING: <strong>{formatTimeRemaining(stats.elapsedSeconds)}</strong></p>
                  <p>⚡ LOGIC SCORE: <strong>100% (ALL GATES SOLVED)</strong></p>
                  <p>💎 COLLECTIBLES: <strong>{stats.fireGemsCollected + stats.waterGemsCollected} / {stats.fireGemsTotal + stats.waterGemsTotal}</strong></p>
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button className="parchment-button" onClick={handleRestart}>
                    REPLAY
                  </button>
                  <Link className="secondary-button" href="/">
                    MAIN MENU
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Defeat / Time Up Overlay Modal */}
          {stats.status === "defeated" && (
            <div className="parchment-modal-overlay">
              <div className="parchment-card" style={{ borderColor: "#7f1d1d" }}>
                <h2 style={{ color: "#991b1b" }}>
                  {stats.defeatReason === "TIME UP" ? "TIME UP ⏱️" : "LOGIC FAILURE 💥"}
                </h2>
                <p style={{ margin: "0 0 24px 0", fontSize: "16px" }}>
                  {stats.defeatReason === "TIME UP"
                    ? "You ran out of time! Re-examine the logic gates and try again."
                    : stats.defeatReason || "A character touched a hazard pool!"}
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button className="parchment-button" onClick={handleRestart}>
                    RETRY (R)
                  </button>
                  <Link className="secondary-button" href="/">
                    MAIN MENU
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Pause Overlay Modal */}
          {stats.status === "paused" && (
            <div className="parchment-modal-overlay">
              <div className="parchment-card">
                <h2>GAME PAUSED ⏸️</h2>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button className="parchment-button" onClick={togglePause}>
                    RESUME
                  </button>
                  <button className="secondary-button" onClick={handleRestart}>
                    RESTART (R)
                  </button>
                  <Link className="secondary-button" href="/">
                    MAIN MENU
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Subtle Bottom Controls Tag Bar */}
        <div className="game-controls-bar">
          <div className="control-tag fire-tag">
            <strong>🔴 RED:</strong> WASD (W=Jump, A=Left, D=Right)
          </div>
          <div className="control-tag water-tag">
            <strong>🔵 BLUE:</strong> ARROW KEYS (↑=Jump, ←=Left, →=Right)
          </div>
          <div className="control-tag">
            <strong>PANELS:</strong> Click [ 0 ] or [ 1 ] on temple input panels!
          </div>
        </div>
      </div>
    </main>
  );
}
