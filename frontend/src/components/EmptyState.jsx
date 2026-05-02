const EmptyState = ({ title, subtitle }) => (
  <div className="rounded-lg border border-dashed border-slate-300 bg-white p-8 text-center">
    <h3 className="text-base font-semibold text-ink">{title}</h3>
    <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
  </div>
);

export default EmptyState;
