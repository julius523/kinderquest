type DashboardCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function DashboardCard({ label, value, hint }: DashboardCardProps) {
  return (
    <div className="flex flex-col gap-1 rounded-2xl bg-white p-4 shadow">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">{label}</span>
      <span className="text-2xl font-bold text-slate-800">{value}</span>
      {hint && <span className="text-xs text-slate-400">{hint}</span>}
    </div>
  );
}
