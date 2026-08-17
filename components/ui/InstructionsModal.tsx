"use client";

interface InstructionsModalProps {
  onClose: () => void;
}

export default function InstructionsModal({ onClose }: InstructionsModalProps) {
  return (
    <div className="parchment-modal-overlay">
      <div className="parchment-card">
        <h2>LOGIC TEMPLE INSTRUCTIONS</h2>
        <ul className="parchment-rules">
          <li>
            <span className="bullet">•</span>
            <span>
              <strong className="text-fire">RED CHARACTER (WASD)</strong>: W = Jump, A = Left, D = Right.
            </span>
          </li>
          <li>
            <span className="bullet">•</span>
            <span>
              <strong className="text-water">BLUE CHARACTER (ARROWS)</strong>: ↑ = Jump, ← = Left, → = Right.
            </span>
          </li>
          <li>
            <span className="bullet">•</span>
            <span>
              <strong>BINARY SIGNALS</strong>: Switches set input to 1 (ON). Glowing green wires carry 1 signals; dim red wires carry 0 signals.
            </span>
          </li>
          <li>
            <span className="bullet">•</span>
            <span>
              <strong>LOGIC GATES</strong>:
              <br />
              - <strong>AND</strong>: Requires BOTH inputs ON.
              <br />
              - <strong>OR</strong>: Requires EITHER input ON.
              <br />
              - <strong>NOT</strong>: Inverts input (OFF = 1 opens door!).
              <br />
              - <strong>XOR</strong>: Requires EXACTLY ONE input ON.
            </span>
          </li>
          <li>
            <span className="bullet">•</span>
            <span>
              <strong>TIMED ESCAPE</strong>: Solving the final combination gate triggers a 10-second escape sequence. Both RED &amp; BLUE must reach their exits!
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
