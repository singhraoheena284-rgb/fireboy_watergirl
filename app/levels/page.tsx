"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LevelsPage() {
  const router = useRouter();

  const levels = [
    { id: 1, name: "Level 1: The Entrance", status: "unlocked" },
    { id: 2, name: "Level 2: Dual Switches", status: "unlocked" },
    { id: 3, name: "Level 3: Toxic Vault", status: "unlocked" }
  ];

  return (
    <main className="levels-page">
      <div className="map-container">
        <h2
          style={{
            textAlign: "center",
            fontSize: "32px",
            marginTop: 0,
            color: "#3b280a",
            letterSpacing: "2px"
          }}
        >
          THE FOREST TEMPLE MAP
        </h2>

        <div className="map-node-tree">
          {levels.map((lvl) => (
            <div
              key={lvl.id}
              className="node-btn"
              onClick={() => router.push(`/game?level=${lvl.id}`)}
              title={lvl.name}
            >
              <span className="node-text">{lvl.id}</span>
            </div>
          ))}
        </div>

        <div style={{ marginTop: "24px" }}>
          <Link className="parchment-button" href="/">
            ◀ MAIN MENU
          </Link>
        </div>
      </div>
    </main>
  );
}
