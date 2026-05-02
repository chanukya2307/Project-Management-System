const StatCard = ({ label, value, tone = 'brand' }) => {
  const tones = {
    brand: 'bg-brand/10 text-brand',
    mint: 'bg-mint/10 text-mint',
    coral: 'bg-coral/10 text-coral',
    ink: 'bg-slate-100 text-ink'
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-soft">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-4 inline-flex min-w-14 items-center justify-center rounded-md px-3 py-2 text-2xl font-bold ${tones[tone]}`}>{value}</p>
    </div>
  );
};

export default StatCard;
