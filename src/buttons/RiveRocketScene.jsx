import { useEffect } from "react";
import {
  Alignment,
  Fit,
  Layout,
  useRive,
  useStateMachineInput,
} from "@rive-app/react-webgl2";

export function RiveRocketScene({ active }) {
  const { rive, RiveComponent } = useRive({
    src: "/rive/rive-rocket-button.riv",
    artboard: "Button",
    stateMachines: "Motion",
    autoplay: true,
    layout: new Layout({ fit: Fit.Contain, alignment: Alignment.Center }),
  });
  const hoverInput = useStateMachineInput(rive, "Motion", "isHover", false);

  useEffect(() => {
    if (hoverInput) hoverInput.value = active;
  }, [active, hoverInput]);

  return <RiveComponent />;
}
