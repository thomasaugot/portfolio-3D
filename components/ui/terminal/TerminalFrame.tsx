"use client";

import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import TerminalHeader from "@/components/ui/terminal/TerminalHeader";
import { cn } from "@/utils/cn";

interface TerminalFrameProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {
  title: string;
  titleId?: string;
  children: ReactNode;
  style?: CSSProperties;
  shellClassName?: string;
  headerAsHeading?: boolean;
  terminalHeader?: boolean;
  staticCounter?: { current: number; total: number };
  liveCounter?: { total: number };
}

const DEFAULT_FRAME_CLASS =
  "keyboard-focus-ring bg-bg-surface/96 backdrop-blur-sm rounded-xl border border-border shadow-2xl overflow-hidden flex flex-col w-full h-full [html[data-theme='light']_&]:border-[#c8b99f] [html[data-theme='light']_&]:bg-[#f8f3e9]/96 [html[data-theme='light']_&]:shadow-[0_28px_80px_rgba(16,185,129,0.08),0_18px_40px_rgba(149,115,37,0.12)]";

export default function TerminalFrame({
  title,
  titleId,
  children,
  style,
  className,
  shellClassName,
  headerAsHeading,
  terminalHeader,
  staticCounter,
  liveCounter,
  ...shellProps
}: TerminalFrameProps) {
  return (
    <div
      {...shellProps}
      className={cn(DEFAULT_FRAME_CLASS, shellClassName, className)}
      style={style}
    >
      <TerminalHeader
        title={title}
        titleId={titleId}
        asHeading={headerAsHeading}
        terminalHeader={terminalHeader}
        staticCounter={staticCounter}
        liveCounter={liveCounter}
      />
      {children}
    </div>
  );
}
