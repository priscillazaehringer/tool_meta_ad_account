"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { STEPS, TOTAL_STEPS, BUSINESS_MANAGER_ID } from "@/lib/steps";
import ProgressRail from "@/components/ProgressRail";
import VideoPlaceholder from "@/components/VideoPlaceholder";
import CopyableId from "@/components/CopyableId";

type Phase = "question" | "video";

export default function SetupFlow() {
  const router = useRouter();
  const params = useSearchParams();
  const id = params.get("id") ?? "";

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [phase, setPhase] = useState<Phase>("question");
  const [answer, setAnswer] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load current progress on mount
  useEffect(() => {
    if (!id) {
      router.replace("/");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/progress?id=${id}`, { method: "GET" });
        if (!res.ok) throw new Error("Couldn't load your progress.");
        const data = await res.json();
        if (data.completed_at) {
          router.replace(`/done?id=${id}`);
          return;
        }
        setCurrentStep(Math.max(1, Math.min(TOTAL_STEPS, data.current_step ?? 1)));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router]);

  const step = STEPS.find((s) => s.id === currentStep);

  async function saveProgress(payload: Record<string, unknown>) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...payload }),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "Couldn't save. Try again.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      throw err;
    } finally {
      setSaving(false);
    }
  }

  async function handleAnswerSubmit() {
    if (!step || !answer) return;
    const shouldSkipVideo = step.continueValues?.includes(answer) ?? false;
    try {
      if (shouldSkipVideo) {
        // Advance to next step
        const nextStep = currentStep + 1;
        await saveProgress({
          answer_key: step.key,
          answer_value: answer,
          next_step: Math.min(nextStep, TOTAL_STEPS),
        });
        if (nextStep > TOTAL_STEPS) {
          await handleComplete();
        } else {
          setCurrentStep(nextStep);
          setAnswer("");
          setPhase("question");
        }
      } else {
        // Show the video, stay on this step
        await saveProgress({
          answer_key: step.key,
          answer_value: answer,
        });
        setPhase("video");
      }
    } catch {
      // error already set
    }
  }

  async function handleVideoDone() {
    if (!step) return;
    const nextStep = currentStep + 1;
    try {
      await saveProgress({
        next_step: Math.min(nextStep, TOTAL_STEPS),
      });
      if (nextStep > TOTAL_STEPS) {
        await handleComplete();
      } else {
        setCurrentStep(nextStep);
        setAnswer("");
        setPhase("question");
      }
    } catch {
      // error already set
    }
  }

  async function handleActionDone() {
    if (!step) return;
    const nextStep = currentStep + 1;
    try {
      await saveProgress({
        action_key: step.key,
        next_step: Math.min(nextStep, TOTAL_STEPS),
      });
      if (nextStep > TOTAL_STEPS) {
        await handleComplete();
      } else {
        setCurrentStep(nextStep);
        setAnswer("");
        setPhase("question");
      }
    } catch {
      // error already set
    }
  }

  async function handleComplete() {
    try {
      const res = await fetch("/api/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Couldn't finalize. Try again.");
      router.push(`/done?id=${id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-5xl px-6 py-24 text-muted">Loading your progress…</div>
      </main>
    );
  }

  if (!step) {
    return (
      <main className="min-h-screen">
        <div className="mx-auto max-w-5xl px-6 py-24">
          <p className="text-muted">Something&rsquo;s off. Please refresh.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen">
      <div className="mx-auto grid min-h-screen max-w-5xl grid-cols-1 gap-12 px-6 py-12 md:grid-cols-[minmax(0,220px)_1fr] md:gap-16 md:px-12 md:py-20">
        {/* Progress rail */}
        <aside className="md:pt-4">
          <p className="eyebrow mb-6">Setup</p>
          <ProgressRail currentStep={currentStep} />
        </aside>

        {/* Step content */}
        <section className="max-w-prose">
          <p className="eyebrow mb-4">
            Step {String(currentStep).padStart(2, "0")} of {String(TOTAL_STEPS).padStart(2, "0")}
          </p>

          {step.kind === "yesno" && phase === "question" && (
            <>
              <h2 className="font-display text-3xl leading-tight md:text-4xl">{step.question}</h2>
              {step.helper && (
                <p className="mt-4 font-sans text-base text-ink/75">{step.helper}</p>
              )}

              <div className="mt-10 space-y-3">
                {step.options?.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setAnswer(opt.value)}
                    className={`option ${answer === opt.value ? "option-selected" : ""}`}
                    aria-pressed={answer === opt.value}
                  >
                    <span>{opt.text}</span>
                    <span aria-hidden="true">{answer === opt.value ? "●" : "○"}</span>
                  </button>
                ))}
              </div>

              {error && (
                <p className="mt-6 font-sans text-sm text-clay" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleAnswerSubmit}
                  disabled={!answer || saving}
                  className="btn-primary"
                >
                  {saving ? "Saving…" : "Continue"}
                </button>
              </div>
            </>
          )}

          {step.kind === "yesno" && phase === "video" && step.fallback && (
            <>
              <h2 className="font-display text-3xl leading-tight md:text-4xl">
                {step.fallback.videoTitle}
              </h2>
              <p className="mt-4 font-sans text-base text-ink/80">{step.fallback.body}</p>

              <div className="mt-8">
                <VideoPlaceholder title={step.fallback.videoTitle} url={step.fallback.videoUrl} />
              </div>

              {error && (
                <p className="mt-6 font-sans text-sm text-clay" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-10 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={handleVideoDone}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving ? "Saving…" : "Done, next step"}
                </button>
                <button
                  type="button"
                  onClick={() => setPhase("question")}
                  className="btn-ghost"
                >
                  Back
                </button>
              </div>
            </>
          )}

          {step.kind === "action" && step.action && (
            <>
              <h2 className="font-display text-3xl leading-tight md:text-4xl">{step.question}</h2>
              <p className="mt-4 font-sans text-base text-ink/80">{step.action.body}</p>

              <div className="mt-8">
                <VideoPlaceholder title={step.action.videoTitle} url={step.action.videoUrl} />
              </div>

              {step.action.showBusinessId && (
                <div className="mt-8">
                  <p className="eyebrow mb-3">Our business manager ID</p>
                  <CopyableId value={BUSINESS_MANAGER_ID} />
                  {step.action.idNote && (
                    <p className="mt-3 font-sans text-sm text-muted">{step.action.idNote}</p>
                  )}
                </div>
              )}

              {error && (
                <p className="mt-6 font-sans text-sm text-clay" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-10">
                <button
                  type="button"
                  onClick={handleActionDone}
                  disabled={saving}
                  className="btn-primary"
                >
                  {saving
                    ? "Saving…"
                    : currentStep === TOTAL_STEPS
                    ? "I'm done"
                    : "Done, next step"}
                </button>
              </div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
