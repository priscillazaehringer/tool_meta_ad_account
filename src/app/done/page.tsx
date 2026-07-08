export default function DonePage() {
  return (
    <main className="min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col justify-center px-6 py-24 md:px-12">
        <p className="eyebrow mb-6">Complete</p>
        <h1 className="font-display text-4xl leading-[1.05] tracking-tight md:text-5xl">
          You&rsquo;re done.
        </h1>
        <p className="mt-6 font-sans text-base leading-relaxed text-ink/80">
          We&rsquo;ll get a notification on our end and confirm access within one business day.
          If anything looks off, we&rsquo;ll email you. Otherwise, you&rsquo;re set and we&rsquo;ll
          take it from here.
        </p>
        <p className="mt-10 font-sans text-sm text-muted">
          You can close this window.
        </p>
      </div>
    </main>
  );
}
