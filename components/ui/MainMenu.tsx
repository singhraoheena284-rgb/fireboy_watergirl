"use client";

import { useState } from "react";
import Link from "next/link";
import InstructionsModal from "./InstructionsModal";

export default function MainMenu() {
  const [showInstructions, setShowInstructions] = useState(false);

  return (
    <main className="menu-page">
      <section className="menu-card">
        <span className="eyebrow">2D BINARY LOGIC PUZZLE PLATFORMER</span>

        <h1 className="game-title">
          <div className="title-line1">
            <span className="title-fire">BINARY</span>
            <span className="title-amp">&amp;</span>
            <span className="title-water">BRIDGE</span>
          </div>
          <div className="title-line2">LEVEL 1 — THE LOGIC TEMPLE</div>
        </h1>

        <p className="subtitle">
          Real binary logic gates (AND, OR, NOT, XOR, Combination) physically control the temple. Work together to trigger the mechanisms and escape!
        </p>

        <div className="menu-actions">
          <Link className="parchment-button" href="/game?level=1">
            PLAY LEVEL 1 ▶
          </Link>
          <button
            className="secondary-button"
            onClick={() => setShowInstructions(true)}
          >
            INSTRUCTIONS
          </button>
        </div>

        <div className="menu-characters">
          <div className="char-preview fire">
            <span className="char-icon">🔴</span>
            <strong>RED (WASD)</strong>
          </div>
          <div className="char-preview water">
            <span className="char-icon">🔵</span>
            <strong>BLUE (Arrows)</strong>
          </div>
        </div>
      </section>

      {showInstructions && (
        <InstructionsModal onClose={() => setShowInstructions(false)} />
      )}
    </main>
  );
}
