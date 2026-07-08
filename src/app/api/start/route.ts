import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = String(body.email ?? "").trim().toLowerCase();
    const lastName = String(body.last_name ?? "").trim();
    const firstName = String(body.first_name ?? "").trim();

    if (!email || !lastName || !firstName) {
      return NextResponse.json(
        { error: "First name, last name, and email are required." },
        { status: 400 }
      );
    }

    // Look up existing row by email + last_name (case-insensitive)
    const { data: existing, error: lookupError } = await supabaseAdmin
      .from("meta_setup")
      .select("*")
      .ilike("email", email)
      .ilike("last_name", lastName)
      .maybeSingle();

    if (lookupError) {
      console.error("Lookup error:", lookupError);
      return NextResponse.json({ error: "Database error." }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({
        id: existing.id,
        current_step: existing.current_step,
        completed_at: existing.completed_at,
        resumed: true,
      });
    }

    // Create new row
    const { data: created, error: insertError } = await supabaseAdmin
      .from("meta_setup")
      .insert({
        email,
        last_name: lastName,
        first_name: firstName,
        current_step: 1,
      })
      .select("*")
      .single();

    if (insertError) {
      console.error("Insert error:", insertError);
      return NextResponse.json({ error: "Couldn't start setup." }, { status: 500 });
    }

    return NextResponse.json({
      id: created.id,
      current_step: created.current_step,
      completed_at: created.completed_at,
      resumed: false,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
