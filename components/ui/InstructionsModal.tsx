"use client";

interface InstructionsModalProps {
  onClose: () => void;
}

export default function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <div className="parchment-modal-overlay">
      <div className="parchment-card">
        <h2>INSTRUCTIONS</h2>
        <ul className="parchment-rules">
          <li>
            <span className="bullet">•</span>
            <span>
              USE <strong className="text-fire">W, A, D</strong> TO MOVE{" "}
              <strong className="text-fire">FIREBOY</strong> (W = Jump, A = Left,
              D = Right).
            </span>
          </li>
          <li>
            <span className="bullet">•</span>
            <span>
              USE THE <strong className="text-water">ARROW KEYS</strong> TO MOVE{" "}
              <strong className="text-water">WATERGIRL</strong> (↑ = Jump, ← = Left,
              → = Right).
            </span>
          </li>
          <li>
            <span className="bullet">•</span>
            <span>
              IN DIAMOND LEVELS GET TO THE EXIT DOORS AS FAST AS POSSIBLE, GRABBING
              ALL DIAMONDS.
            </span>
          </li>
          <li>
            <span className="bullet">•</span>
            <span>
              THE TRICK IS TO MOVE BOTH CHARACTERS SIMULTANEOUSLY AND WORK
              TOGETHER TO SOLVE PUZZLES.
            </span>
          </li>
          <li>
            <span className="bullet">•</span>
            <span>
              <strong className="text-fire">FIREBOY</strong> DIES IN WATER &amp;
              ACID. <strong className="text-water">WATERGIRL</strong> DIES IN FIRE
              &amp; ACID.
            </span>
          </li>
        </ul>

        <button className="parchment-button" onClick={onClose}>
          OK
        </button>
      </div>
    </div>
  );
}
