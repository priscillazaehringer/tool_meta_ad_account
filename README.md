# Meta Setup Flow

Self-serve Facebook / Instagram / ad account setup wizard for Whitney Bateson's Done-for-You Funnel clients. Replaces the manual email tennis that used to take a week per client.

## Stack

- Next.js 15 (App Router, TypeScript)
- Supabase (Postgres, service role from server only)
- Resend (completion email to admin)
- Tailwind CSS
- Deployed on Vercel

## What the flow does

1. Client lands on the entry page, enters first name, last name, and email
2. Six-step branching wizard walks them through:
   - Personal FB account check
   - Business Page (video if missing)
   - Instagram connection (video if missing)
   - Real ad account, filtering out ghost boost-created ones (video if missing)
   - Add our team to their Page (action + video)
   - Add our team to their ad account (action + video)
3. On completion, `admin@whitneybateson.com` gets an email
4. Progress persists in Supabase, keyed by email + last name. Client can resume by re-entering the same credentials.

## Local setup

```bash
npm install
cp .env.example .env.local
# Fill in Supabase + Resend keys
npm run dev
```

Then open http://localhost:3000.

## Supabase setup

1. Create a new Supabase project
2. In the SQL editor, run the contents of `supabase/schema.sql`
3. Copy your project URL and **service role** key into `.env.local`:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

The service role key is used server-side only. RLS is enabled and no client-side policies are granted, so the anon key can't touch the table.

## Resend setup

1. Create a Resend account and verify the sending domain (`whitneybateson.com`)
2. Create an API key
3. Set in `.env.local`:
   - `RESEND_API_KEY`
   - `FROM_EMAIL` (e.g. `notifications@whitneybateson.com` — must be on the verified domain)
   - `NOTIFY_EMAIL` = `admin@whitneybateson.com`

If Resend isn't configured, the flow still works but no email fires on completion. Fine for testing.

## Deploy to Vercel

1. Push this repo to GitHub
2. Import into Vercel
3. Add the env vars in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`
   - `NOTIFY_EMAIL`
   - `FROM_EMAIL`
4. Deploy

Later, point a subdomain like `setup.whitneybateson.com` at the Vercel deployment.

## Swapping in real videos

All copy, video URLs, and step logic live in `src/lib/steps.ts`. To add a video:

```ts
fallback: {
  body: "...",
  videoTitle: "Create a business Page",
  videoUrl: "https://player.vimeo.com/video/XXXXXXXXX",
},
```

The `VideoPlaceholder` component uses a plain `<iframe>` and works with Vimeo, YouTube (unlisted), and Loom embed URLs out of the box.

## Editing the flow

- **Question wording, helper text, options:** `src/lib/steps.ts`
- **Business manager ID:** `BUSINESS_MANAGER_ID` in `src/lib/steps.ts`
- **Completion email content:** `src/app/api/complete/route.ts`
- **Design tokens (colors, fonts):** `tailwind.config.ts` and `src/app/globals.css`

## Schema

See `supabase/schema.sql`. One table: `meta_setup`. Columns cover answers to each question, timestamps for each action step, current step for resume, and overall completion.

## Notes

- Answers to Q3 include a `"skip"` option (for "I don't use Instagram"). Both `"yes"` and `"skip"` advance without showing a video.
- Q4's phrasing explicitly excludes boost-created ad accounts, which is the ghost-ad-account failure mode we're solving for.
- No book-a-call button in the flow. Client emails you manually if truly stuck.
- The flow assumes one-sitting completion but tolerates resume via email + last name lookup.
