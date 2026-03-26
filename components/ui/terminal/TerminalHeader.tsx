interface TerminalHeaderProps {
  title: string;
  titleId?: string;
  asHeading?: boolean;
  terminalHeader?: boolean;
  staticCounter?: { current: number; total: number };
  liveCounter?: { total: number };
}

export default function TerminalHeader({
  title,
  titleId,
  asHeading,
  terminalHeader,
  staticCounter,
  liveCounter,
}: TerminalHeaderProps) {
  const titleClass = `ml-4 text-xs text-muted font-mono text-nowrap [html[data-theme='light']_&]:text-[#756a5b]${asHeading ? " hidden sm:block" : ""}`;

  return (
    <div
      {...(terminalHeader ? { "data-portfolio-terminal-header": true } : {})}
      className="flex h-12 items-center gap-2 px-4 bg-bg-panel border-b border-border flex-shrink-0 [html[data-theme='light']_&]:bg-[linear-gradient(90deg,rgba(16,185,129,0.07),rgba(245,158,11,0.06))] [html[data-theme='light']_&]:border-b-[#cdbda3]"
    >
      <div className="flex gap-2" aria-hidden="true">
        <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
        <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
        <div className="w-3 h-3 rounded-full bg-[#27ca40]" />
      </div>

      {asHeading ? (
        <h2 id={titleId} className={titleClass}>{title}</h2>
      ) : (
        <div id={titleId} className={titleClass}>{title}</div>
      )}

      {staticCounter && (
        <div className="ml-auto flex items-center gap-3">
          <span className="text-lg font-bold text-primary font-mono">
            {staticCounter.current.toString().padStart(2, "0")}
          </span>
          <span className="text-muted">/</span>
          <span className="text-sm text-muted font-mono">
            {staticCounter.total.toString().padStart(2, "0")}
          </span>
        </div>
      )}

      {liveCounter && (
        <div data-project-counter className="ml-auto flex items-center gap-3 opacity-0">
          <span data-counter-number className="text-lg font-bold text-primary font-mono">01</span>
          <span className="text-muted">/</span>
          <span className="text-sm text-muted font-mono">
            {liveCounter.total.toString().padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}
