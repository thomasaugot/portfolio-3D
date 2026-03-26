"use client";

import { createPortal } from "react-dom";
import ProjectPanel from "@/components/sections/projects/ProjectPanel";
import StageMeasurer from "@/components/ui/StageMeasurer";
import TerminalFrame from "@/components/ui/terminal/TerminalFrame";
import { MOBILE_TERMINAL_WIDTH_CSS } from "@/utils/terminal-sizes";
import {
  PortfolioCtaPanel,
  PortfolioIntroPanel,
} from "./PortfolioTerminalPanels";

type ViewportConfig = {
  isMobile: boolean;
  isTablet: boolean;
  isSmallDesktop: boolean;
};

type Project = Parameters<typeof ProjectPanel>[0]["project"];
type TFn = Parameters<typeof ProjectPanel>[0]["t"];

interface Props {
  t: TFn;
  projects: Project[];
  viewportConfig: ViewportConfig;
  measurerTarget: HTMLElement;
  onMeasure: (key: string, height: number) => void;
}

function getMeasureWidth(viewportConfig: ViewportConfig, widths: { mobile: string; tablet: string; smallDesktop: string; desktop: string }) {
  if (viewportConfig.isMobile) return widths.mobile;
  if (viewportConfig.isTablet) return widths.tablet;
  if (viewportConfig.isSmallDesktop) return widths.smallDesktop;
  return widths.desktop;
}

export default function PortfolioMeasurers({ t, projects, viewportConfig, measurerTarget, onMeasure }: Props) {
  const terminalTitle = t("projects.terminal.header") || "tom@portfolio ~ % ./projects.sh";

  const introWidth = getMeasureWidth(viewportConfig, {
    mobile: MOBILE_TERMINAL_WIDTH_CSS,
    tablet: "clamp(360px, 60vw, 560px)",
    smallDesktop: "clamp(420px, 56vw, 640px)",
    desktop: "clamp(280px, 88vw, 640px)",
  });

  const ctaWidth = getMeasureWidth(viewportConfig, {
    mobile: MOBILE_TERMINAL_WIDTH_CSS,
    tablet: "clamp(360px, 58vw, 540px)",
    smallDesktop: "clamp(400px, 50vw, 580px)",
    desktop: "clamp(360px, 46vw, 600px)",
  });

  const projectWidth = getMeasureWidth(viewportConfig, {
    mobile: MOBILE_TERMINAL_WIDTH_CSS,
    tablet: "clamp(380px, 60vw, 600px)",
    smallDesktop: "clamp(420px, 52vw, 620px)",
    desktop: "clamp(340px, 42vw, 680px)",
  });

  const useCompactContent = viewportConfig.isMobile;
  const useCompactDensity = viewportConfig.isTablet || viewportConfig.isSmallDesktop;

  return createPortal(
    <>
      <StageMeasurer measureKey="intro" widthCss={introWidth} onMeasureCustom={onMeasure}>
        <TerminalFrame title={terminalTitle}>
          <PortfolioIntroPanel t={t} measure />
        </TerminalFrame>
      </StageMeasurer>

      <StageMeasurer measureKey="cta" widthCss={ctaWidth} onMeasureCustom={onMeasure}>
        <TerminalFrame title={terminalTitle}>
          <PortfolioCtaPanel t={t} projectCount={projects.length} measure />
        </TerminalFrame>
      </StageMeasurer>

      {projects.map((project, index) => (
        <StageMeasurer
          key={`project-measure-${project.id}`}
          measureKey={`project-${index}`}
          widthCss={projectWidth}
          onMeasureCustom={onMeasure}
        >
          <TerminalFrame
            title={terminalTitle}
            staticCounter={{ current: index + 1, total: projects.length }}
          >
            <ProjectPanel
              project={project}
              index={index}
              t={t}
              measure={true}
              useCompactContent={useCompactContent}
              useCompactDensity={useCompactDensity}
            />
          </TerminalFrame>
        </StageMeasurer>
      ))}
    </>,
    measurerTarget
  );
}
