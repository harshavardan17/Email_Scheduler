interface StatusBadgeProps {
  status: string;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
  PROCESSING: "bg-sky-500/15 text-sky-300 border border-sky-500/20",
  SENT: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
  FAILED: "bg-rose-500/15 text-rose-300 border border-rose-500/20",
};

function StatusBadge({ status }: StatusBadgeProps) {
  const className = statusStyles[status] ?? "bg-slate-500/15 text-slate-300 border border-slate-500/20";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${className}`}>
      {status}
    </span>
  );
}

export default StatusBadge;
