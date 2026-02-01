"use client";

import { MapPin, Check } from "lucide-react";
import type { TerminalLine } from "@/data/terminal-content";

interface TerminalLinesProps {
  lines: TerminalLine[];
}

export default function TerminalLines({ lines }: TerminalLinesProps) {
  return (
    <>
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
                <div className="flex flex-col gap-1.5 md:flex-row md:flex-nowrap md:justify-start md:gap-10 md:overflow-x-auto pb-1 hide-scrollbar">
                  {line.rows.map((row) => (
                    <div
                      key={row.label}
                      className="flex items-baseline gap-2 md:min-w-[150px] md:items-end"
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
                <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:gap-4 md:overflow-x-auto pb-1 text-[0.65rem] text-white/60 hide-scrollbar">
                  <span className="flex-shrink-0 text-[0.65rem] uppercase tracking-[0.35em] text-white/40">
                    {line.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5 md:flex-nowrap md:gap-2 md:whitespace-nowrap">
                    {line.badges.map((badge) => (
                      <span
                        key={badge}
                        className="inline-flex items-center justify-center rounded-[0.6rem] border border-white/15 bg-white/5 px-2.5 py-0.5 text-[0.65rem] font-semibold text-white/90 transition-colors hover:border-secondary/50 hover:text-secondary md:px-3 md:py-1 md:text-[0.7rem]"
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
  );
}
