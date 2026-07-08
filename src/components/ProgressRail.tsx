import { STEPS } from "@/lib/steps";

type Props = {
  currentStep: number;
};

export default function ProgressRail({ currentStep }: Props) {
  return (
    <nav aria-label="Setup progress">
      <ol className="relative border-l border-rail pl-6">
        {STEPS.map((s) => {
          const state =
            s.id < currentStep ? "done" : s.id === currentStep ? "current" : "upcoming";
          return (
            <li key={s.id} className="relative mb-6 last:mb-0">
              <span
                aria-hidden="true"
                className={[
                  "absolute -left-[29px] top-1 flex h-3 w-3 items-center justify-center rounded-full border",
                  state === "done"
                    ? "border-moss bg-moss"
                    : state === "current"
                    ? "border-ink bg-paper"
                    : "border-rail bg-paper",
                ].join(" ")}
              >
                {state === "current" && <span className="h-1.5 w-1.5 rounded-full bg-ink" />}
              </span>
              <p
                className={[
                  "font-sans text-xs uppercase tracking-[0.14em]",
                  state === "current"
                    ? "text-ink"
                    : state === "done"
                    ? "text-ink/60"
                    : "text-muted",
                ].join(" ")}
              >
                {String(s.id).padStart(2, "0")}
              </p>
              <p
                className={[
                  "mt-1 font-sans text-sm leading-snug",
                  state === "current"
                    ? "text-ink"
                    : state === "done"
                    ? "text-ink/60"
                    : "text-muted",
                ].join(" ")}
              >
                {s.label}
              </p>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
