import { MotionConfig } from "motion/react";
import OpeningScreen from "./components/OpeningScreen";

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="invitation">
        <OpeningScreen />
      </main>
    </MotionConfig>
  );
}
