interface Props {
  label: string;
}

export default function AvailabilityBadge({ label }: Props) {
  return (
    <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
      <span className="relative flex h-2.5 w-2.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
      </span>
      <span className="text-sm text-text/82 font-mono">{label}</span>
    </div>
  );
}
