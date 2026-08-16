import Link from "next/link";

export default function SettingsPage() {
  return (
    <main className="menu-page">
      <section className="menu-card">
        <span className="eyebrow">GAME CONTROLS & SETTINGS</span>
        <h1>SETTINGS</h1>

        <div className="settings-section">
          <h3>🎮 Character Controls</h3>
          <div className="controls-table">
            <div className="control-row">
              <span className="char-label fire">🔥 Fireboy</span>
              <span><strong>W</strong> (Jump), <strong>A</strong> (Left), <strong>D</strong> (Right)</span>
            </div>
            <div className="control-row">
              <span className="char-label water">💧 Watergirl</span>
              <span><strong>↑</strong> (Jump), <strong>←</strong> (Left), <strong>→</strong> (Right)</span>
            </div>
            <div className="control-row">
              <span>⌨️ Shortcuts</span>
              <span><strong>R</strong> (Restart Level), <strong>P</strong> / <strong>Esc</strong> (Pause), <strong>M</strong> (Mute)</span>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>🌊 Elemental Safety Rules</h3>
          <ul className="rules-list">
            <li>🔥 <strong>Fireboy</strong> can safely walk through fire/lava pools, but dies in water or toxic acid.</li>
            <li>💧 <strong>Watergirl</strong> can safely walk through water pools, but dies in fire/lava or toxic acid.</li>
            <li>☣️ <strong>Toxic Acid</strong> is deadly to both characters!</li>
            <li>🚪 Both characters must stand at their matching exit doors simultaneously to clear a level.</li>
          </ul>
        </div>

        <Link className="back-link" href="/">
          ← Back to Main Menu
        </Link>
      </section>
    </main>
  );
}
