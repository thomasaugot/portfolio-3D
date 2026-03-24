"use client";

import { Button } from "@/components/ui/Button";

interface PromptConfig {
  label: string;
  yesLabel: string;
  noLabel: string;
  onYes: () => void;
  onNo: () => void;
}

interface TerminalPromptProps {
  promptLabelTyped: string;
  promptConfig: PromptConfig;
}

export default function TerminalPrompt({ promptLabelTyped, promptConfig }: TerminalPromptProps) {
  return (
    <div className="mt-3 pt-3 border-t border-border">
      <div className="flex items-center gap-2 text-text">
        <span className="text-primary">❯</span>
        <span>{promptLabelTyped || promptConfig.label}</span>
      </div>
      <div className="flex flex-wrap gap-3 mt-3">
        <Button
          type="button"
          onClick={promptConfig.onYes}
          variant="orange"
          size="sm"
        >
          {promptConfig.yesLabel}
        </Button>
        <Button
          type="button"
          onClick={promptConfig.onNo}
          variant="outlined"
          size="sm"
        >
          {promptConfig.noLabel}
        </Button>
      </div>
    </div>
  );
}

export type { PromptConfig };
