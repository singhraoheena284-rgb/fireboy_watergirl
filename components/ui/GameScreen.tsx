"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createGame } from "@/game/engine/createGame";
import type { GameStats } from "@/game/types/game";

export default function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();

  const levelNum = parseInt(searchParams.get("level") || "1", 10);
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

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const nextLevelAvailable = levelNum < 3;

  return (
    <main className="game-page">
      <div className="game-shell">
        {/* Top In-Game HUD matching Image 3 */}
        <div className="game-hud-bar">
          <div className="hud-group">
            <span className="gem-counter fire">
              💎 FIRE GEMS: {stats.fireGemsCollected} / {stats.fireGemsTotal}
            </span>
            <span className="gem-counter water">
              💎 WATER GEMS: {stats.waterGemsCollected} / {stats.waterGemsTotal}
            </span>
          </div>

          {/* Oval Leaf-Framed Timer (Image 3!) */}
          <div className="hud-timer-oval">
            <span>{formatTime(stats.elapsedSeconds)}</span>
          </div>

          <div className="hud-actions">
            <button
              className="parchment-button hud-btn"
              onClick={toggleSound}
              title="Toggle Audio (M)"
            >
              {isMuted ? "🔇 Muted" : "🔊 Sound"}
            </button>
            <button
              className="parchment-button hud-btn"
              onClick={handleRestart}
              title="Restart Level (R)"
            >
              🔄 Restart
            </button>
            <Link className="secondary-button hud-btn" href="/levels">
              📋 Map
            </Link>
          </div>
        </div>

        {/* Game Canvas Viewport */}
        <div className="canvas-wrapper">
          <canvas
            ref={canvasRef}
            className="game-canvas"
            width={1280}
            height={720}
            aria-label="Fireboy and Watergirl Canvas Viewport"
          />

          {/* Victory Overlay Modal */}
          {stats.status === "victory" && (
            <div className="parchment-modal-overlay">
              <div className="parchment-card">
                <h2>VICTORY! LEVEL COMPLETE 🎉</h2>
                <div
                  style={{
                    background: "rgba(0,0,0,0.15)",
                    padding: "16px",
                    borderRadius: "10px",
                    marginBottom: "24px",
                    textAlign: "left"
                  }}
                >
                  <p>⏱️ Time Taken: <strong>{formatTime(stats.elapsedSeconds)}</strong></p>
                  <p>🔥 Fire Diamonds: <strong>{stats.fireGemsCollected} / {stats.fireGemsTotal}</strong></p>
                  <p>💧 Water Diamonds: <strong>{stats.waterGemsCollected} / {stats.waterGemsTotal}</strong></p>
                </div>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                  {nextLevelAvailable ? (
                    <button
                      className="parchment-button"
                      onClick={() => router.push(`/game?level=${levelNum + 1}`)}
                    >
                      NEXT LEVEL ➡️
                    </button>
                  ) : (
                    <Link className="parchment-button" href="/levels">
                      TEMPLE CLEARED! 🎉
                    </Link>
                  )}
                  <button className="secondary-button" onClick={handleRestart}>
                    REPLAY LEVEL
                  </button>
                  <Link className="secondary-button" href="/levels">
                    MAP SELECT
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Defeat Overlay Modal */}
          {stats.status === "defeated" && (
            <div className="parchment-modal-overlay">
              <div className="parchment-card" style={{ borderColor: "#7f1d1d" }}>
                <h2 style={{ color: "#991b1b" }}>ELEMENTAL FAILURE 💥</h2>
                <p style={{ margin: "0 0 24px 0", fontSize: "16px", lineHeight: "1.5" }}>
                  A character touched an incompatible hazard pool!
                  <br />
                  Remember: <strong>Fireboy dies in Water &amp; Acid</strong>,{" "}
                  <strong>Watergirl dies in Fire &amp; Acid</strong>.
                </p>
                <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
                  <button className="parchment-button" onClick={handleRestart}>
                    TRY AGAIN (R)
                  </button>
                  <Link className="secondary-button" href="/levels">
                    MAP SELECT
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
                  <button
                    className="parchment-button"
                    onClick={() => {
                      const event = new KeyboardEvent("keydown", { code: "KeyP" });
                      window.dispatchEvent(event);
                    }}
                  >
                    RESUME
                  </button>
                  <button className="secondary-button" onClick={handleRestart}>
                    RESTART (R)
                  </button>
                  <Link className="secondary-button" href="/levels">
                    MAP SELECT
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Controls Tag Bar */}
        <div className="game-controls-bar">
          <div className="control-tag fire-tag">
            <strong>🔥 Fireboy:</strong> W (Jump), A (Left), D (Right)
          </div>
          <div className="control-tag water-tag">
            <strong>💧 Watergirl:</strong> ↑ (Jump), ← (Left), → (Right)
          </div>
          <div className="control-tag">
            <strong>Keys:</strong> R (Restart) | P (Pause) | M (Mute Sound)
          </div>
        </div>
      </div>
    </main>
  );
}
