import { Check } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MEASURER_FRAME_CLASS, PANEL_CTA_CLASS, PANEL_FRAME_CLASS } from "@/utils/portfolio-classes";

type TranslationFn = (key: string) => string | undefined;

const SAFE_AREA_PADDING = {
  paddingBottom: "max(0.35rem, env(safe-area-inset-bottom, 0px))",
} as const;

interface PortfolioIntroPanelProps {
  t: TranslationFn;
  measure?: boolean;
  onTouchStart?: React.TouchEventHandler;
  onTouchEnd?: React.TouchEventHandler;
  onWheel?: React.WheelEventHandler;
  onStartClick?: React.MouseEventHandler<HTMLButtonElement>;
  onStartTouchEnd?: React.TouchEventHandler<HTMLButtonElement>;
  onStartPointerUp?: React.PointerEventHandler<HTMLButtonElement>;
}

interface PortfolioCtaPanelProps {
  t: TranslationFn;
  projectCount: number;
  measure?: boolean;
  onContact?: () => void;
}

function getPanelFrameClass(measure?: boolean) {
  return measure
    ? MEASURER_FRAME_CLASS
    : `${PANEL_FRAME_CLASS} pointer-events-auto bg-bg-surface`;
}

export function PortfolioIntroPanel({
  t,
  measure = false,
  onTouchStart,
  onTouchEnd,
  onWheel,
  onStartClick,
  onStartTouchEnd,
  onStartPointerUp,
}: PortfolioIntroPanelProps) {
  return (
    <div
      data-project-panel="0"
      data-intro-panel
      className={getPanelFrameClass(measure)}
      onTouchStart={measure ? undefined : onTouchStart}
      onTouchEnd={measure ? undefined : onTouchEnd}
      onWheel={measure ? undefined : onWheel}
    >
      <div data-typewriter-line={!measure || undefined} className="flex items-center gap-2 mb-2">
        <span className="text-primary">❯</span>
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "100" : undefined}
          data-typewriter-speed={!measure ? "30" : undefined}
          className="text-primary"
        >
          ./projects.sh
        </span>
      </div>
      <div data-typewriter-line={!measure || undefined} className="text-text pl-4 mb-2">
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "300" : undefined}
          data-typewriter-speed={!measure ? "18" : undefined}
        >
          {t("projects.terminal.intro_line1") || "Initializing project showcase..."}
        </span>
      </div>
      <div data-typewriter-line={!measure || undefined} className="text-text pl-4 flex items-center gap-2 mb-3">
        <Check className="w-4 h-4 text-primary" />
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "200" : undefined}
          data-typewriter-speed={!measure ? "20" : undefined}
        >
          {t("projects.terminal.project_count") || "5 featured projects loaded"}
        </span>
      </div>
      <div data-typewriter-line={!measure || undefined} className="flex items-center gap-2 mb-2 mt-2">
        <span className="text-primary">❯</span>
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "300" : undefined}
          data-typewriter-speed={!measure ? "30" : undefined}
          className="text-primary"
        >
          cat README.md
        </span>
      </div>
      <div data-typewriter-line={!measure || undefined} className="block text-text/82 pl-4 mb-2">
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "200" : undefined}
          data-typewriter-speed={!measure ? "12" : undefined}
        >
          {t("projects.terminal.intro_line2") || "This is a curated selection of my best work."}
        </span>
      </div>
      <div data-typewriter-line={!measure || undefined} className="block text-text/82 pl-4 mb-4">
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "100" : undefined}
          data-typewriter-speed={!measure ? "8" : undefined}
        >
          {t("projects.terminal.intro_line3") || "Each project demonstrates my skills in modern web development, from interactive 3D experiences to full-stack platforms."}
        </span>
      </div>
      <div
        data-intro-cta={!measure || undefined}
        className={`${PANEL_CTA_CLASS} mt-auto${measure ? " opacity-100" : ""}`}
        style={SAFE_AREA_PADDING}
      >
        <div className="flex items-center gap-2 text-text mb-3">
          <span className="text-primary">❯</span>
          <span>{t("projects.terminal.scroll_cta") || "Ready to explore?"}</span>
        </div>
        <Button
          data-start-projects-btn={!measure || undefined}
          type="button"
          variant="orange"
          size={measure ? "md" : "sm"}
          className="pointer-events-auto touch-manipulation"
          onClick={measure ? undefined : onStartClick}
          onTouchEnd={measure ? undefined : onStartTouchEnd}
          onPointerUp={measure ? undefined : onStartPointerUp}
        >
          {t("projects.start_exploring") || (measure ? "Start exploring" : "Explore")}
        </Button>
      </div>
    </div>
  );
}

export function PortfolioCtaPanel({
  t,
  projectCount,
  measure = false,
  onContact,
}: PortfolioCtaPanelProps) {
  return (
    <div
      data-project-panel={projectCount + 1}
      data-cta-panel
      className={`${getPanelFrameClass(measure)}${measure ? "" : " opacity-0 bg-bg-surface"}`}
      style={measure ? undefined : { pointerEvents: "none" }}
    >
      <div data-typewriter-line={!measure || undefined} className="flex items-center gap-2 mb-2">
        <span className="text-primary">❯</span>
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "100" : undefined}
          data-typewriter-speed={!measure ? "25" : undefined}
          className="text-primary"
        >
          ./wrap-up.sh
        </span>
      </div>
      <div data-typewriter-line={!measure || undefined} className="text-text pl-4 flex items-center gap-2 mb-3">
        <Check className="w-4 h-4 text-primary" />
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "300" : undefined}
          data-typewriter-speed={!measure ? "18" : undefined}
        >
          {t("projects.cta_complete") || "All projects explored!"}
        </span>
      </div>
      <div data-typewriter-line={!measure || undefined} className="flex items-center gap-2 mb-2 mt-2">
        <span className="text-primary">❯</span>
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "350" : undefined}
          data-typewriter-speed={!measure ? "25" : undefined}
          className="text-primary"
        >
          echo $NEXT_STEP
        </span>
      </div>
      <h3 data-typewriter-line={!measure || undefined} data-cta-title={!measure || undefined} className="pl-4 text-xl md:text-2xl font-bold text-text leading-tight mb-4">
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "300" : undefined}
          data-typewriter-speed={!measure ? "22" : undefined}
        >
          {t("projects.cta_title") || "Let's build something together"}
        </span>
      </h3>
      <div data-typewriter-line={!measure || undefined} className="text-text/82 pl-4 mb-4">
        <span
          data-typewriter={!measure || undefined}
          data-typewriter-delay={!measure ? "250" : undefined}
          data-typewriter-speed={!measure ? "10" : undefined}
        >
          {t("projects.cta_description") || "I'm always excited to take on new challenges and bring ideas to life."}
        </span>
      </div>
      <div
        className={`${PANEL_CTA_CLASS} mt-auto${measure ? " opacity-100" : " pointer-events-auto"}`}
        data-typewriter-reveal={!measure || undefined}
        data-typewriter-delay={!measure ? "400" : undefined}
        style={SAFE_AREA_PADDING}
      >
        <div className="flex items-center gap-2 text-text">
          <span className="text-primary">❯</span>
          <span>{t("projects.cta_prompt") || "Ready to start a conversation?"}</span>
        </div>
      </div>
      <Button
        data-contact-cta-btn={!measure || undefined}
        type="button"
        variant="orange"
        size="md"
        className={`mt-3 inline-flex w-fit self-start${measure ? "" : " pointer-events-auto touch-manipulation relative z-[100010]"}`}
        data-typewriter-reveal={!measure || undefined}
        data-typewriter-delay={!measure ? "400" : undefined}
        onClick={measure ? undefined : onContact}
      >
        {t("projects.cta_contact") || "Get in touch"}
      </Button>
    </div>
  );
}
