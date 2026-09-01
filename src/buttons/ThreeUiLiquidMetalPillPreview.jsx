import { LiquidMetalButton } from "../shaders/liquid-metal-button/LiquidMetalButton.tsx";
import "../shaders/threeui.css";
import "./threeui-liquid-metal-pill.css";

export function ThreeUiLiquidMetalPillPreview() {
  return (
    <div className="threeui-liquid-metal-pill-preview">
      <div className="threeui-liquid-metal-pill-preview__content">
        <LiquidMetalButton variant="pill" />
      </div>
    </div>
  );
}
