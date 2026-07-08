import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

const ALLOWED_ANSWER_KEYS = new Set(["q1", "q2", "q3", "q4"]);
const ALLOWED_ACTION_KEYS = new Set(["q5", "q6"]);

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  const { data, error } = await supabaseAdmin
    .from("meta_setup")
    .select("id, current_step, completed_at, first_name")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    console.error(error);
    return NextResponse.json({ error: "Database error." }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Not found." }, { status: 404 });
  }
  return NextResponse.json(data);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.id ?? "");
    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.answer_key === "string" && typeof body.answer_value === "string") {
      if (ALLOWED_ANSWER_KEYS.has(body.answer_key)) {
        updates[`${body.answer_key}_answer`] = body.answer_value;
      }
    }

    if (typeof body.action_key === "string") {
      if (ALLOWED_ACTION_KEYS.has(body.action_key)) {
        updates[`${body.action_key}_completed_at`] = new Date().toISOString();
      }
    }

    if (typeof body.next_step === "number") {
      updates.current_step = Math.max(1, Math.min(6, body.next_step));
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ ok: true, noop: true });
    }

    const { error } = await supabaseAdmin.from("meta_setup").update(updates).eq("id", id);
    if (error) {
      console.error(error);
      return NextResponse.json({ error: "Database error." }, { status: 500 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
