"use client";

import { MapPin, Check, Send, RotateCcw } from "lucide-react";
import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import Image from "next/image";
import { useTranslation } from "@/contexts/TranslationProvider";
import { useCanva } from "@/components/ui/Canva";
import { useIsAppReady } from "@/contexts/LoadingProvider";
import { morphToHero, getTerminalConfig } from "@/utils/animations/terminal-morph";
import { ABOUT_TECH_STACK_GROUPS } from "@/data/about";
import { SOCIAL_LINKS } from "@/data/contact";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

type ContactFormState = "idle" | "sending" | "success";

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

type Stage = "hero" | "about" | "projects" | "contact";
type TerminalState = Stage | "loader";

export default function Terminal() {
  const { t, language } = useTranslation();
  const {
    stage,
    promptLabel,
    statusMessage,
    heroReady,
    setHeroReady,
    handlePromptYes,
    handlePromptNo,
    handleBootComplete,
    goToProjects,
    goToHero,
    isMorphing,
    setIsMorphing,
  } = useCanva();
  const { isReady, progress } = useIsAppReady();

  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [typing, setTyping] = useState(false);
  const [cursor, setCursor] = useState(true);
  const [prompt, setPrompt] = useState(false);
  const [heroActive, setHeroActive] = useState(false);
  const [hasExpanded, setHasExpanded] = useState(false);
  const [contentReady, setContentReady] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [terminalContentHidden, setTerminalContentHidden] = useState(false);

  // Contact form state
  const [contactFormState, setContactFormState] = useState<ContactFormState>("idle");
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const prevStageRef = useRef(stage);
  const typingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const currentLineIndexRef = useRef(-1);
  const typedStageRef = useRef<Stage | null>(null);
  const [promptLabelTyped, setPromptLabelTyped] = useState("");
  const promptLabelTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const terminalState: TerminalState = heroActive ? stage : "loader";
  const terminalConfig = useMemo(() => getTerminalConfig(terminalState), [terminalState]);
  const terminalStyle = useMemo(
    () => ({
      width: terminalConfig.widthCss,
      height: terminalConfig.heightCss,
    }),
    [terminalConfig]
  );
  // Skip inline dimensions during morphing to let GSAP handle transitions
  const appliedTerminalStyle = isMorphing ? undefined : terminalStyle;

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 1024);
  }, []);

  const heroContent: TerminalLine[] = useMemo(
    () => [
      { type: "command", content: t("hero.commands.whoami"), delay: 300 },
      { type: "output", content: `${t("hero.whoami")} — ${t("hero.role")}`, delay: 100 },
      { type: "command", content: t("hero.commands.location"), delay: 350 },
      { type: "success", content: t("hero.location"), delay: 100, icon: "location" },
      { type: "command", content: t("hero.commands.stack"), delay: 350 },
      { type: "output", content: t("hero.stack_favorite"), delay: 100 },
      { type: "command", content: t("hero.commands.status"), delay: 350 },
      { type: "success", content: t("hero.status"), delay: 100, icon: "status" },
    ],
    [t]
  );
  const heroTagline = t("hero.tagline");

  const getTechLabel = useCallback(
    (key: string) => t(`about.tech.${key}`) || key,
    [t]
  );

  const badgeLines = useMemo(
    () =>
      ABOUT_TECH_STACK_GROUPS.map((group) => ({
        type: "badge-group" as const,
        content: "",
        delay: 50,
        category: getTechLabel(group.key),
        badges: group.items,
      })),
    [getTechLabel]
  );

  const aboutGridRows = useMemo(
    () => [
      {
        label: "experience",
        value: `${t("about.stats.years_value")} ${t("about.stats.years")}`,
      },
      {
        label: "projects",
        value: t("about.stats.projects_value"),
      },
      {
        label: "languages",
        value: t("about.stats.languages_value"),
      },
    ],
    [t]
  );

  const aboutContent: TerminalLine[] = useMemo(() => {
    const infoLines: TerminalLine[] = [
      { type: "command", content: "neofetch --terminal", delay: 250 },
      {
        type: "info-grid",
        content: "",
        rows: aboutGridRows,
        delay: 120,
      },
      { type: "command", content: "cat README.md", delay: 300 },
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
      { type: "command", content: "ls -la ./skills/", delay: 300 },
      ...badgeLines,
    ];
  }, [t, aboutGridRows, badgeLines]);

  const projectsContent: TerminalLine[] = useMemo(
    () => [
      { type: "command", content: "./projects.sh", delay: 250 },
      {
        type: "output",
        content: t("projects.terminal.intro_line1") || "Initializing project showcase...",
        delay: 100,
        typewriterSpeed: 18,
      },
      {
        type: "success",
        content: t("projects.terminal.project_count") || "5 featured projects loaded",
        delay: 150,
        icon: "status",
      },
      { type: "command", content: "cat README.md", delay: 300 },
      {
        type: "info",
        content: t("projects.terminal.intro_line2") || "This is a curated selection of my best work.",
        delay: 100,
        typewriterSpeed: 20,
        isParagraph: true,
      },
      {
        type: "info",
        content: t("projects.terminal.intro_line3") || "Each project demonstrates my skills in modern web development.",
        delay: 100,
        typewriterSpeed: 18,
        isParagraph: true,
      },
    ],
    [t]
  );

  const contactContent: TerminalLine[] = useMemo(
    () => [
      { type: "command", content: t("footer.command") || "./new-message.sh", delay: 250 },
      {
        type: "success",
        content: t("footer.available") || "Open to new opportunities",
        delay: 100,
        icon: "status",
      },
      { type: "command", content: "cat README.md", delay: 300 },
      {
        type: "info",
        content: t("footer.description") || "Got a project idea? Need a developer? Or just want to say hi?",
        delay: 100,
        typewriterSpeed: 18,
        isParagraph: true,
      },
    ],
    [t]
  );

  const loadingLines: TerminalLine[] = useMemo(
    () => [
      { type: "command", content: "./init-portfolio.sh", delay: 0 },
      { type: "output", content: "Preparing assets...", delay: 0 },
    ],
    []
  );

  const getStageContent = useCallback(() => {
    switch (stage) {
      case "hero":
        return heroContent;
      case "about":
        return aboutContent;
      case "projects":
        return projectsContent;
      case "contact":
        return contactContent;
      default:
        return heroContent;
    }
  }, [stage, heroContent, aboutContent, projectsContent, contactContent]);

  const delayTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const wait = (ms: number) =>
    new Promise<void>((resolve) => {
      delayTimerRef.current = setTimeout(() => {
        delayTimerRef.current = null;
        resolve();
      }, ms);
    });

  const getTypewriterSpeed = (line: TerminalLine) => {
    if (line.typewriterSpeed) return line.typewriterSpeed;
    if (line.isParagraph) return 3;
    switch (line.type) {
      case "command":
        return 12;
      case "success":
        return 10;
      case "info":
        return 11;
      case "output":
        return 10;
      default:
        return 11;
    }
  };

  const appendLine = (line: TerminalLine) => {
    setLines((prev) => {
      const initialContent =
        line.type === "badge-group" || line.type === "info-grid"
          ? line.content
          : "";
      const next = [...prev, { ...line, content: initialContent }];
      currentLineIndexRef.current = next.length - 1;
      return next;
    });
  };

  const updateLineText = (text: string) => {
    setLines((prev) => {
      const index = currentLineIndexRef.current;
      if (index < 0 || index >= prev.length) return prev;
      const next = [...prev];
      next[index] = { ...next[index], content: text };
      return next;
    });
  };

  const typeLine = (line: TerminalLine, isCancelled: () => boolean) =>
    new Promise<void>((resolve) => {
      if (
        line.type === "badge-group" ||
        line.type === "info-grid" ||
        !line.content
      ) {
        resolve();
        return;
      }

      const target = line.content;
      let index = 0;
      const chunkSize = line.batchSize ?? (line.isParagraph ? 4 : 1);
      const speed = getTypewriterSpeed(line);

      const step = () => {
        if (isCancelled()) {
          resolve();
          return;
        }

        index = Math.min(target.length, index + chunkSize);
        updateLineText(target.slice(0, index));
        if (index < target.length) {
          typingTimerRef.current = setTimeout(step, speed);
        } else {
          resolve();
        }
      };

      step();
    });

  const resetPromptLabel = () => {
    setPromptLabelTyped("");
    if (promptLabelTimerRef.current) {
      clearTimeout(promptLabelTimerRef.current);
      promptLabelTimerRef.current = null;
    }
  };

  const typePromptLabel = (
    label: string,
    speed = 24,
    isCancelled: () => boolean
  ) =>
    new Promise<void>((resolve) => {
      setPromptLabelTyped("");
      let index = 0;

      const step = () => {
        if (isCancelled()) {
          resolve();
          return;
        }

        index += 1;
        setPromptLabelTyped(label.slice(0, index));
        if (index < label.length) {
          promptLabelTimerRef.current = setTimeout(step, speed);
        } else {
          resolve();
        }
      };

      step();
    });

  useEffect(() => {
    const id = setInterval(() => setCursor((prev) => !prev), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!isReady || hasExpanded) return;
    setHasExpanded(true);

    // Hide loader content before morphing
    setTerminalContentHidden(true);

    // Start morph animation
    setIsMorphing(true);
    morphToHero(() => {
      setIsMorphing(false);
      setHeroActive(true);
    });
  }, [isReady, hasExpanded, setIsMorphing]);

  useEffect(() => {
    if (heroActive && !heroReady) {
      setHeroReady(true);
    }
  }, [heroActive, heroReady, setHeroReady]);

  useEffect(() => {
    if (!heroActive) return;

    if (prevStageRef.current !== stage) {
      prevStageRef.current = stage;
      setLines([]);
      setTyping(false);
      setPrompt(false);
      setContentReady(false);
      currentLineIndexRef.current = -1;
      typedStageRef.current = null;
      return;
    }

    setLines([]);
    setTyping(false);
    setPrompt(false);
    currentLineIndexRef.current = -1;
    typedStageRef.current = null;
  }, [language, heroActive, stage]);

  useEffect(() => {
    if (!heroActive) return;

    if (isMorphing) {
      setTerminalContentHidden(true);
      setLines([]);
      setTyping(false);
      setPrompt(false);
      setContentReady(false);
      currentLineIndexRef.current = -1;
      return;
    }

    const id = setTimeout(() => {
      setTerminalContentHidden(false);
    }, 260);

    return () => clearTimeout(id);
  }, [heroActive, isMorphing]);

  useEffect(() => {
    if (!heroActive || isMorphing || contentReady) return;

    setContentReady(true);
    setTyping(true);
  }, [heroActive, isMorphing, contentReady]);

  const getHeaderLabel = () => {
    if (!heroActive) return "loading.sh";
    switch (stage) {
      case "about":
        return "tom@portfolio ~ % ./about.sh";
      case "projects":
        return "tom@portfolio ~ % ./projects.sh";
      case "contact":
        return t("footer.command");
      default:
        return t("hero.terminal_title");
    }
  };

  const getPromptConfig = () => {
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
          label: t("projects.terminal.scroll_cta") || "Scroll down to explore each project",
          yesLabel: t("projects.scroll_hint") || "scroll down",
          noLabel: t("hero.prompt_no"),
          onYes: () => {
            // Scroll hint - no action needed, user will scroll
            setPrompt(false);
          },
          onNo: () => {
            setPrompt(false);
            goToHero();
          },
        };
      case "contact":
        return {
          label: "", // Form is shown instead of prompt
          yesLabel: "",
          noLabel: "",
          onYes: () => {},
          onNo: () => {},
        };
      default:
        return {
          label: "",
          yesLabel: "",
          noLabel: "",
          onYes: () => {},
          onNo: () => {},
        };
    }
  };

  const promptConfig = getPromptConfig();
  const isHeroStage = stage === "hero";
  const showPrompt = heroActive && prompt;
  const showHeroTagline = isHeroStage && heroActive && !isMorphing;

  // Contact form handlers
  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactEmail || !contactMessage) return;

    setContactFormState("sending");

    const mailtoLink = `mailto:thomas.augot@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(contactName)}&body=${encodeURIComponent(`Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`)}`;
    window.location.href = mailtoLink;

    setTimeout(() => {
      setContactFormState("success");
    }, 500);
  };

  const resetContactForm = () => {
    setContactName("");
    setContactEmail("");
    setContactMessage("");
    setContactFormState("idle");
    setTimeout(() => nameInputRef.current?.focus(), 100);
  };

  // Focus name input when contact form appears
  useEffect(() => {
    if (stage === "contact" && showPrompt && contactFormState === "idle") {
      setTimeout(() => nameInputRef.current?.focus(), 300);
    }
  }, [stage, showPrompt, contactFormState]);
  useEffect(() => {
    if (!heroActive || isMorphing || !contentReady) return;
    if (typedStageRef.current === stage) return;

    let cancelled = false;
    setTyping(true);
    setLines([]);
    currentLineIndexRef.current = -1;
    typedStageRef.current = stage;
    resetPromptLabel();

    const runTypingQueue = async () => {
      const content = getStageContent();

      for (const line of content) {
        if (cancelled) break;
        await wait(line.delay ?? 100);
        if (cancelled) break;

        appendLine(line);
        await typeLine(line, () => cancelled);
      }

      if (cancelled) return;

      const labelToType = promptConfig.label;
      if (labelToType) {
        await typePromptLabel(labelToType, 26, () => cancelled);
        if (cancelled) return;
      } else {
        setPromptLabelTyped("");
      }

      setTyping(false);
      setTimeout(() => {
        setPrompt(true);
        if (stage === "hero") {
          handleBootComplete();
        }
      }, 300);
    };

    runTypingQueue();

    return () => {
      cancelled = true;
      setTyping(false);
      resetPromptLabel();
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      if (delayTimerRef.current) {
        clearTimeout(delayTimerRef.current);
        delayTimerRef.current = null;
      }
    };
  }, [
    contentReady,
    getStageContent,
    handleBootComplete,
    heroActive,
    isMorphing,
    stage,
    promptConfig.label,
  ]);

  const renderTypingContent = () => (
    <>
      {!heroActive && typeof progress === "number" && (
        <div className="mb-4 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center justify-between text-xs text-white/50">
            <span>Initializing...</span>
            <span className="text-primary font-bold tabular-nums">{progress}%</span>
          </div>
          <div className="mt-2 h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary to-secondary"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
      {!heroActive && loadingLines.length > 0 && (
        <>
          {loadingLines.map((line, index) => (
            <div key={`loading-${index}`} className="mb-1.5 animate-fadeIn">
              <div className="flex items-center gap-2">
                <span className="text-primary">❯</span>
                <span className="text-white">{line.content}</span>
              </div>
            </div>
          ))}
        </>
      )}
      {heroActive && (
        <>
          {/* Mobile-only: compact portrait inside terminal for about stage */}
          {stage === "about" && !isDesktop && !isMorphing && (
            <div className="flex flex-col items-center gap-2 mb-4 pb-4 border-b border-white/10 animate-fadeIn">
              <div className="relative w-24 h-24 overflow-hidden border-2 border-primary/40 flex-shrink-0 morphing-border">
                <Image
                  src="/assets/images/portrait/portrait.png"
                  alt={t("about.name")}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <p className="text-sm font-semibold text-white">{t("about.name")}</p>
              <p className="text-xs text-primary font-mono">{t("hero.role")}</p>
            </div>
          )}
          {lines.map((line, index) => {
            const spacingClass = index > 0 && line.type === "command" ? "mt-3" : "mt-2";
            return (
              <div
                key={index}
                className={`animate-fadeIn ${line.type === "badge-group" ? "pt-2" : ""} ${spacingClass}`}
              >
                {line.type === "command" && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-primary">❯</span>
                    <span className="text-white">{line.content}</span>
                  </div>
                )}
                {line.type === "info-grid" && line.rows && (
                  <div className="mb-2 pl-4">
                    <div className="flex flex-nowrap justify-start gap-4 md:gap-10 overflow-x-auto pb-1 hide-scrollbar">
                      {line.rows.map((row) => (
                        <div
                          key={row.label}
                          className="flex min-w-[100px] md:min-w-[150px] items-end gap-2"
                        >
                          <span className="text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
                            {row.label}
                          </span>
                          <span className="text-secondary font-semibold">{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {line.type === "output" && (
                  <div className="mb-1 text-white/80 pl-4">{line.content}</div>
                )}
                {line.type === "success" && (
                  <div className="mb-1 text-primary pl-4 flex items-center gap-2">
                    {line.icon === "location" ? (
                      <MapPin className="w-4 h-4 inline-block" />
                    ) : line.icon === "status" ? (
                      <Check className="w-4 h-4 inline-block" />
                    ) : null}
                    {line.content}
                  </div>
                )}
                {line.type === "badge-group" && line.category && line.badges && (
                  <div className="mb-1 pl-4">
                    <div className="flex items-center gap-4 overflow-x-auto pb-1 text-[0.65rem] text-white/60 hide-scrollbar">
                      <span className="flex-shrink-0 text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
                        {line.category}
                      </span>
                      <div className="flex flex-nowrap gap-2 whitespace-nowrap">
                        {line.badges.map((badge) => (
                          <span
                            key={badge}
                            className="inline-flex items-center justify-center rounded-[0.6rem] border border-white/15 bg-white/5 px-3 py-1 text-[0.7rem] font-semibold text-white/90 transition-colors hover:border-secondary/50 hover:text-secondary"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
                {line.type === "info" && (
                  <div className="mb-1 text-secondary/80 pl-4">{line.content}</div>
                )}
              </div>
            );
          })}
        </>
      )}
      {typing && (
        <div className="flex items-center gap-2">
          <span className="text-primary">❯</span>
          <span
            className={`w-2 h-5 bg-primary ${cursor ? "opacity-100" : "opacity-0"}`}
          />
        </div>
      )}
      {statusMessage && isHeroStage && (
        <div className="mt-3 text-secondary/80 flex items-center gap-2">
          <span className="text-primary">❯</span>
          <span>{statusMessage}</span>
        </div>
      )}
      {showPrompt && isHeroStage && (promptLabelTyped || promptLabel) && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-white">
            <span className="text-primary">❯</span>
            <span>{promptLabelTyped || promptLabel}</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <Button
              type="button"
              onClick={promptConfig.onYes}
              variant="orange"
              size="md"
            >
              {promptConfig.yesLabel}
            </Button>
            <Button
              type="button"
              onClick={promptConfig.onNo}
              variant="outlined"
              size="md"
            >
              {promptConfig.noLabel}
            </Button>
          </div>
        </div>
      )}
      {stage === "about" && heroActive && showPrompt && (
        <div className="mt-3 pt-3 border-t border-white/10">
          <div className="flex items-center gap-2 text-white">
            <span className="text-primary">❯</span>
            <span>{promptLabelTyped || promptConfig.label}</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-3">
            <Button
              type="button"
              onClick={promptConfig.onYes}
              variant="orange"
              size="md"
            >
              {promptConfig.yesLabel}
            </Button>
            <Button
              type="button"
              onClick={promptConfig.onNo}
              variant="outlined"
              size="md"
            >
              {promptConfig.noLabel}
            </Button>
          </div>
        </div>
      )}
      {stage === "contact" && heroActive && showPrompt && (
        <div className="mt-3 pt-3 border-t border-white/10">
          {contactFormState === "success" ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <Check className="w-5 h-5" />
                <span className="font-bold">{t("footer.form.success_title")}</span>
              </div>
              <p className="text-secondary/80 pl-7">{t("footer.form.success_text")}</p>
              <Button
                type="button"
                onClick={resetContactForm}
                variant="outlined"
                size="md"
                className="mt-2"
              >
                <RotateCcw className="w-4 h-4" />
                {t("footer.form.send_another")}
              </Button>
            </div>
          ) : (
            <form onSubmit={handleContactSubmit} className="space-y-2">
              {/* Name field */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary text-xs">❯</span>
                  <span className="text-white/60 text-xs">{t("footer.form.name_command")}</span>
                </div>
                <Input
                  ref={nameInputRef}
                  type="text"
                  value={contactName}
                  onChange={(e) => setContactName(e.target.value)}
                  placeholder={t("footer.form.name_placeholder")}
                  disabled={contactFormState === "sending"}
                />
              </div>

              {/* Email field */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary text-xs">❯</span>
                  <span className="text-white/60 text-xs">{t("footer.form.email_command")}</span>
                </div>
                <Input
                  type="email"
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder={t("footer.form.email_placeholder")}
                  disabled={contactFormState === "sending"}
                />
              </div>

              {/* Message field */}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-primary text-xs">❯</span>
                  <span className="text-white/60 text-xs">{t("footer.form.message_command")}</span>
                </div>
                <Textarea
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  placeholder={t("footer.form.message_placeholder")}
                  rows={3}
                  disabled={contactFormState === "sending"}
                />
              </div>

              {/* Submit button */}
              <div className="pt-1">
                <Button
                  type="submit"
                  variant="orange"
                  size="md"
                  disabled={!contactName || !contactEmail || !contactMessage || contactFormState === "sending"}
                >
                  {contactFormState === "sending" ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      {t("footer.form.sending")}...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t("footer.form.submit")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          )}
          {/* Mobile-only: social links inside terminal (hidden in desktop ContactSection) */}
          {!isDesktop && (
            <div className="mt-3 pt-3 border-t border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary text-xs">❯</span>
                <span className="text-white/60 text-xs">cat ./socials.txt</span>
              </div>
              <div className="space-y-1.5 pl-4">
                {SOCIAL_LINKS.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={social.href}
                      target={social.label !== "Email" ? "_blank" : undefined}
                      rel={social.label !== "Email" ? "noreferrer" : undefined}
                      className="flex items-center gap-2.5 py-1.5 text-white/70 hover:text-primary transition-colors"
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-xs">{social.handle}</span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );

  return (
    <div data-terminal-wrapper className="fixed z-[100] opacity-0">
      <div
        data-terminal-shell
        suppressHydrationWarning
        className="bg-bg-surface/95 backdrop-blur-sm rounded-xl border border-white/10 shadow-2xl overflow-hidden flex flex-col w-full h-full"
        style={appliedTerminalStyle}
      >
        <div
          data-terminal-header
          className="flex items-center gap-2 px-4 py-3 bg-bg-panel border-b border-white/10"
        >
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
            <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
          </div>
          <span className="ml-4 text-xs text-white/40 font-mono">
            {getHeaderLabel()}
          </span>
        </div>
        {showHeroTagline && (
          <div className="px-4 md:px-6 pt-4 pb-2 border-b border-white/10">
            <p className="text-xs font-mono text-secondary mb-2 tracking-widest uppercase">
              {t("hero.tagline_prefix")}
            </p>
            <h1 className="text-lg md:text-2xl lg:text-3xl font-bold text-white leading-tight">
              <TypewriterText text={heroTagline} speed={45} />
            </h1>
          </div>
        )}
        <div
          data-terminal-body
          className="relative p-4 md:p-6 font-mono text-sm leading-relaxed overflow-y-auto overflow-x-hidden flex-1 min-h-0 no-scrollbar"
        >
          <div
            data-terminal-content
            className={`transition-opacity duration-300 ${
              terminalContentHidden ? "opacity-0 pointer-events-none" : "opacity-100"
            }`}
          >
            {renderTypingContent()}
          </div>
          <div data-terminal-morph-layer className="absolute inset-0 opacity-0 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}

interface TypewriterTextProps {
  text: string;
  speed?: number;
}

function TypewriterText({ text, speed = 30 }: TypewriterTextProps) {
  const [display, setDisplay] = useState("");

  useEffect(() => {
    if (!text) {
      setDisplay("");
      return;
    }

    let index = 0;
    let timer: ReturnType<typeof setTimeout> | null = null;

    const typeNext = () => {
      index += 1;
      setDisplay(text.slice(0, index));
      if (index < text.length) {
        timer = setTimeout(typeNext, speed);
      }
    };

    typeNext();

    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [text, speed]);

  return <>{display}</>;
}
