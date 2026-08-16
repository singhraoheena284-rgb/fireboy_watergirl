"use client";

import { useState } from "react";
import Link from "next/link";
import InstructionsModal from "./InstructionsModal";

export default function MainMenu() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <main className="menu-page">
      <section className="menu-card">
        <span className="eyebrow">COOPERATIVE PUZZLE PLATFORMER</span>

        <h1 className="game-title">
          <div className="title-line1">
            <span className="title-fire">FIREBOY</span>
            <span className="title-amp">&amp;</span>
            <span className="title-water">WATERGIRL</span>
          </div>
          <div className="title-line2">IN THE FOREST TEMPLE</div>
        </h1>

        <p className="subtitle">
          Guide both elemental heroes through the ancient temple. Solve puzzles, collect diamonds, and reach the exit doors!
        </p>

        <div className="menu-actions">
          <Link className="parchment-button" href="/game?level=1">
            PLAY ▶
          </Link>
          <button
            className="secondary-button"
            onClick={() => setShowInstructions(true)}
          >
            INSTRUCTIONS
          </button>
          <Link className="secondary-button" href="/levels">
            LEVEL SELECT
          </Link>
        </div>

        <div className="menu-characters">
          <div className="char-preview water">
            <span className="char-icon">💧</span>
            <strong>Watergirl</strong>
          </div>
          <div className="char-preview fire">
            <span className="char-icon">🔥</span>
            <strong>Fireboy</strong>
          </div>
        </div>
      </section>

      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
    </main>
  );
}
