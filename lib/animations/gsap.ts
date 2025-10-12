import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { CSSPlugin } from "gsap/CSSPlugin";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(useGSAP, ScrollTrigger, CSSPlugin);

  gsap.config({
    force3D: true,
    nullTargetWarn: false,
  });

  ScrollTrigger.config({
    autoRefreshEvents: "visibilitychange,DOMContentLoaded,load",
  });
}

export { gsap, ScrollTrigger, useGSAP };