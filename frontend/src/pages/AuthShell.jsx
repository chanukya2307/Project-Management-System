const AuthShell = ({ title, subtitle, children }) => (
  <main className="grid min-h-screen bg-white lg:grid-cols-[1fr_1.1fr]">
    <section className="flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md">
        <p className="mb-8 text-xl font-bold text-ink">ProjectFlow</p>
        <h1 className="text-3xl font-bold text-ink">{title}</h1>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
    <section className="hidden bg-[linear-gradient(135deg,#2563eb_0%,#14b8a6_50%,#f97316_100%)] lg:block">
      <div className="flex h-full items-end p-12 text-white">
        <div>
          <p className="text-5xl font-bold leading-tight">Plan, assign, and deliver with clarity.</p>
          <p className="mt-4 max-w-xl text-lg text-white/85">A focused workspace for teams that need practical project visibility without noisy ceremony.</p>
        </div>
      </div>
    </section>
  </main>
);

export default AuthShell;
