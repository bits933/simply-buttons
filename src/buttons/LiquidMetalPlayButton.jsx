import { LiquidMetalButton } from "../shaders/liquid-metal-button/LiquidMetalButton.tsx";
import "../shaders/threeui.css";
import "./liquid-metal-button.css";

export function LiquidMetalPlayButtonPreview() {
  return (
    <div className="liquid-metal-play-root" data-lmp-play>
      <div className="shader-frame">
        <LiquidMetalButton
          variant="play"
          rendering="colored"
          diameter={88}
          strokeWidth={3.0}
          text="Play"
        />
      </div>
    </div>
  );
}
