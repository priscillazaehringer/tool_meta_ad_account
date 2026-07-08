type Props = {
  title: string;
  url?: string;
};

export default function VideoPlaceholder({ title, url }: Props) {
  if (url) {
    // Assumes an embeddable URL (Vimeo, YouTube unlisted, Loom, etc.)
    // Swap this for the correct embed markup once video hosting is chosen.
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-ink/15 bg-ink/5">
        <iframe
          src={url}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
        />
      </div>
    );
  }
  return (
    <div className="flex aspect-video w-full items-center justify-center border border-dashed border-ink/25 bg-ink/[0.03] px-6 text-center">
      <div>
        <p className="eyebrow mb-2">Video placeholder</p>
        <p className="font-display text-xl italic text-ink/70">{title}</p>
        <p className="mt-2 font-sans text-xs text-muted">
          Add the embed URL in src/lib/steps.ts
        </p>
      </div>
    </div>
  );
}
