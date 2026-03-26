interface Props {
  label: string;
}

export default function ScrollIndicator({ label }: Props) {
  return (
    <div
      data-scroll-indicator
      aria-hidden="true"
      className="hidden lg:flex fixed bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 opacity-0 pointer-events-none z-20"
    >
      <span className="text-xs text-text/72 font-mono">{label}</span>
      <div className="w-6 h-10 rounded-full border-2 border-text/45 flex items-start justify-center p-1">
        <div className="w-1.5 h-3 bg-primary rounded-full animate-bounce" />
      </div>
    </div>
  );
}
