import { ABOUT_TECH_STACK_GROUPS } from "@/data/about";

export interface TerminalLine {
  type: "command" | "output" | "success" | "info" | "ascii" | "badge-group" | "info-grid";
  content: string;
  delay?: number;
  icon?: "location" | "status";
  category?: string;
  badges?: string[];
  rows?: { label: string; value: string }[];
  typewriterSpeed?: number;
  isParagraph?: boolean;
  batchSize?: number;
}

export type Stage = "hero" | "about" | "projects" | "contact";

export function getHeroContent(t: (key: string) => string, isDesktop: boolean): TerminalLine[] {
  return [
    { type: "command", content: t("hero.commands.whoami"), delay: 300 },
    { type: "output", content: `${t("hero.whoami")} — ${t("hero.role")}`, delay: 100 },
    { type: "command", content: t("hero.commands.location"), delay: 350 },
    { type: "success", content: t("hero.location"), delay: 100, icon: "location" },
    { type: "command", content: t("hero.commands.stack"), delay: 350 },
    { type: "output", content: t("hero.stack_favorite"), delay: 100 },
    ...(isDesktop
      ? [
          { type: "command" as const, content: t("hero.commands.status"), delay: 350 },
          { type: "success" as const, content: t("hero.status"), delay: 100, icon: "status" as const },
        ]
      : []),
  ];
}

export function getAboutContent(t: (key: string) => string): TerminalLine[] {
  const getTechLabel = (key: string) => t(`about.tech.${key}`) || key;

  const badgeLines: TerminalLine[] = ABOUT_TECH_STACK_GROUPS.map((group) => ({
    type: "badge-group" as const,
    content: "",
    delay: 50,
    category: getTechLabel(group.key),
    badges: group.items,
  }));

  const aboutGridRows = [
    {
      label: t("about.stats.experience_label"),
      value: `${t("about.stats.years_value")} ${t("about.stats.years")}`,
    },
    {
      label: t("about.stats.projects_label"),
      value: t("about.stats.projects_value"),
    },
    {
      label: t("about.stats.languages_label"),
      value: t("about.stats.languages_value"),
    },
  ];

  const infoLines: TerminalLine[] = [
    { type: "command", content: t("hero.terminal.commands.neofetch"), delay: 250 },
    {
      type: "info-grid",
      content: "",
      rows: aboutGridRows,
      delay: 120,
    },
    { type: "command", content: t("hero.terminal.commands.cat_readme"), delay: 300 },
    {
      type: "info",
      content: t("about.bio"),
      delay: 100,
      typewriterSpeed: 32,
      isParagraph: true,
    },
  ];

  return [
    ...infoLines,
    { type: "command", content: t("hero.terminal.commands.ls_skills"), delay: 300 },
    ...badgeLines,
  ];
}

export function getAboutContentPages(t: (key: string) => string): TerminalLine[][] {
  const aboutContent = getAboutContent(t);
  return [aboutContent.slice(0, 4), aboutContent.slice(4)];
}

export function getProjectsContent(t: (key: string) => string): TerminalLine[] {
  return [
    { type: "command", content: t("hero.terminal.commands.projects"), delay: 250 },
    {
      type: "output",
      content: t("projects.terminal.intro_line1"),
      delay: 100,
      typewriterSpeed: 18,
    },
    {
      type: "success",
      content: t("projects.terminal.project_count"),
      delay: 150,
      icon: "status",
    },
    { type: "command", content: t("hero.terminal.commands.cat_readme"), delay: 300 },
    {
      type: "info",
      content: t("projects.terminal.intro_line2"),
      delay: 100,
      typewriterSpeed: 20,
      isParagraph: true,
    },
    {
      type: "info",
      content: t("projects.terminal.intro_line3"),
      delay: 100,
      typewriterSpeed: 18,
      isParagraph: true,
    },
  ];
}

export function getContactContent(t: (key: string) => string): TerminalLine[] {
  return [
    { type: "command", content: t("footer.command"), delay: 250 },
    {
      type: "success",
      content: t("footer.available"),
      delay: 100,
      icon: "status",
    },
    { type: "command", content: t("hero.terminal.commands.cat_readme"), delay: 300 },
    {
      type: "info",
      content: t("footer.description"),
      delay: 100,
      typewriterSpeed: 18,
      isParagraph: true,
    },
  ];
}

export function getLoadingLines(t: (key: string) => string): TerminalLine[] {
  return [
    { type: "command", content: t("hero.terminal.commands.init"), delay: 0 },
    { type: "output", content: t("hero.terminal.loading_message"), delay: 0 },
  ];
}

export function getStageContent(
  stage: Stage,
  t: (key: string) => string,
  isDesktop: boolean
): TerminalLine[] {
  switch (stage) {
    case "hero":
      return getHeroContent(t, isDesktop);
    case "about":
      return isDesktop ? getAboutContent(t) : getAboutContentPages(t)[0];
    case "projects":
      return getProjectsContent(t);
    case "contact":
      return getContactContent(t);
    default:
      return getHeroContent(t, isDesktop);
  }
}

export function getHeaderLabel(
  stage: Stage,
  heroActive: boolean,
  t: (key: string) => string
): string {
  if (!heroActive) return t("hero.terminal.loading");
  switch (stage) {
    case "about":
      return t("hero.terminal.about_title");
    case "projects":
      return t("hero.terminal.projects_title");
    case "contact":
      return t("hero.terminal.contact_title");
    default:
      return t("hero.terminal_title");
  }
}

export interface PromptConfig {
  label: string;
  yesLabel: string;
  noLabel: string;
  onYes: () => void;
  onNo: () => void;
}

export function getPromptConfig(
  stage: Stage,
  promptLabel: string | undefined,
  t: (key: string) => string,
  handlers: {
    setPrompt: (value: boolean) => void;
    handlePromptYes: () => void;
    handlePromptNo: () => void;
    goToProjects: () => void;
    goToHero: () => void;
  }
): PromptConfig {
  const { setPrompt, handlePromptYes, handlePromptNo, goToProjects, goToHero } = handlers;

  switch (stage) {
    case "hero":
      return {
        label: promptLabel || t("hero.prompt_more"),
        yesLabel: t("hero.prompt_yes"),
        noLabel: t("hero.prompt_no"),
        onYes: () => {
          setPrompt(false);
          handlePromptYes();
        },
        onNo: () => {
          setPrompt(false);
          handlePromptNo();
        },
      };
    case "about":
      return {
        label: t("about.cta_work"),
        yesLabel: t("hero.prompt_yes"),
        noLabel: t("hero.prompt_no"),
        onYes: () => {
          setPrompt(false);
          goToProjects();
        },
        onNo: () => {
          setPrompt(false);
          goToHero();
        },
      };
    case "projects":
      return {
        label: t("projects.terminal.scroll_cta"),
        yesLabel: t("projects.scroll_hint"),
        noLabel: t("hero.prompt_no"),
        onYes: () => setPrompt(false),
        onNo: () => {
          setPrompt(false);
          goToHero();
        },
      };
    case "contact":
    default:
      return {
        label: "",
        yesLabel: "",
        noLabel: "",
        onYes: () => {},
        onNo: () => {},
      };
  }
}
