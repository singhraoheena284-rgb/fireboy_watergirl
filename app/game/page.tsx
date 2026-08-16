import { Suspense } from "react";
import GameScreen from "@/components/ui/GameScreen";

export default function GamePage() {
  return (
    <Suspense
      fallback={
        <div className="menu-page">
          <div className="menu-card">
            <p>Loading Level...</p>
          </div>
        </div>
      }
    >
      <GameScreen />
    </Suspense>
  );
}
