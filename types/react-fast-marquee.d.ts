declare module "react-fast-marquee" {
  import { CSSProperties, ReactNode } from "react";

  export interface MarqueeProps {
    style?: CSSProperties;
    className?: string;
    autoFill?: boolean;
    play?: boolean;
    pauseOnHover?: boolean;
    pauseOnClick?: boolean;
    direction?: "left" | "right" | "up" | "down";
    speed?: number;
    delay?: number;
    loop?: number;
    gradient?: boolean;
    gradientColor?: string;
    gradientWidth?: number | string;
    onFinish?: () => void;
    onCycleComplete?: () => void;
    onMount?: () => void;
    children?: ReactNode;
  }

  export default function Marquee(props: MarqueeProps): JSX.Element;
}