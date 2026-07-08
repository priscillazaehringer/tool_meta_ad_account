// Central question/step definition.
// Change wording, video URLs, or options here.

export const BUSINESS_MANAGER_ID = "483230735518997";

export type StepKind = "yesno" | "action";

export type Step = {
  id: number;
  key: string; // matches DB column suffix, e.g. "q1"
  kind: StepKind;
  label: string; // shown in the progress rail
  question: string;
  helper?: string;
  options?: { value: string; text: string }[];
  // For "no" answers, show this content:
  fallback?: {
    body: string;
    videoTitle: string;
    videoUrl?: string; // TODO: placeholder for now
  };
  // For action steps (Q5, Q6):
  action?: {
    body: string;
    videoTitle: string;
    videoUrl?: string;
    showBusinessId?: boolean;
    idNote?: string;
  };
  // Which answer values move the user to the "no path" (show video, then continue)
  continueValues?: string[]; // answers that skip the video
};

export const STEPS: Step[] = [
  {
    id: 1,
    key: "q1",
    kind: "yesno",
    label: "Personal account",
    question: "Do you have a personal Facebook account?",
    options: [
      { value: "yes", text: "Yes" },
      { value: "no", text: "No" },
    ],
    continueValues: ["yes"],
    fallback: {
      body:
        "You'll need one to manage a business Page. Head to facebook.com and sign up with your personal info. Come back here once you're logged in.",
      videoTitle: "Create a personal Facebook account",
    },
  },
  {
    id: 2,
    key: "q2",
    kind: "yesno",
    label: "Business Page",
    question: "Do you have a Facebook business Page for your business?",
    helper: "A business Page is separate from your personal profile. It's where your business lives on Facebook.",
    options: [
      { value: "yes", text: "Yes" },
      { value: "no", text: "No" },
      { value: "unsure", text: "Not sure" },
    ],
    continueValues: ["yes"],
    fallback: {
      body:
        "A business Page is separate from your personal profile. It's what we'll run ads from. Here's how to set one up.",
      videoTitle: "Create a business Page",
    },
  },
  {
    id: 3,
    key: "q3",
    kind: "yesno",
    label: "Instagram connected",
    question: "Is your Instagram account connected to your business Page?",
    options: [
      { value: "yes", text: "Yes" },
      { value: "no", text: "No" },
      { value: "skip", text: "I don't use Instagram for my business" },
    ],
    continueValues: ["yes", "skip"],
    fallback: {
      body:
        "Connecting them lets us run ads across both platforms from one place. Takes about five minutes.",
      videoTitle: "Connect Instagram to your Page",
    },
  },
  {
    id: 4,
    key: "q4",
    kind: "yesno",
    label: "Ad account",
    question: "Do you have a Meta ad account you've used to run real campaigns?",
    helper:
      "Boosting an Instagram post doesn't count. That creates a hidden ad account we can't really work with. If you've only ever boosted posts, choose No.",
    options: [
      { value: "yes", text: "Yes" },
      { value: "no", text: "No" },
      { value: "unsure", text: "Not sure" },
    ],
    continueValues: ["yes"],
    fallback: {
      body:
        "You'll create a fresh one from your business Page. This is the account we'll use to run everything.",
      videoTitle: "Create an ad account",
    },
  },
  {
    id: 5,
    key: "q5",
    kind: "action",
    label: "Add us to your Page",
    question: "Add our team to your Page",
    action: {
      body:
        "Now you'll give us partner access to your business Page. This lets us manage ads without needing your login.",
      videoTitle: "Grant partner access to a Page",
      showBusinessId: true,
      idNote: "Copy this and paste it when the video prompts you.",
    },
  },
  {
    id: 6,
    key: "q6",
    kind: "action",
    label: "Add us to your ad account",
    question: "Add our team to your ad account",
    action: {
      body:
        "Same idea, but for the ad account. If you see more than one ad account listed, pick the one you just created following the video in the last step. Not any older ones from boosting posts.",
      videoTitle: "Set up ad account access",
      showBusinessId: true,
      idNote: "Copy this and paste it when the video prompts you.",
    },
  },
];

export const TOTAL_STEPS = STEPS.length;
