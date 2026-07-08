import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { resend, NOTIFY_EMAIL, FROM_EMAIL } from "@/lib/resend";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = String(body.id ?? "");
    if (!id) {
      return NextResponse.json({ error: "Missing id." }, { status: 400 });
    }

    // Update the row
    const now = new Date().toISOString();
    const { data, error } = await supabaseAdmin
      .from("meta_setup")
      .update({ completed_at: now })
      .eq("id", id)
      .select("first_name, last_name, email, created_at")
      .single();

    if (error || !data) {
      console.error(error);
      return NextResponse.json({ error: "Couldn't complete." }, { status: 500 });
    }

    // Fire completion email (best-effort)
    if (resend) {
      try {
        const subject = `${data.first_name} ${data.last_name} finished Meta setup`;
        const html = `
          <div style="font-family: system-ui, -apple-system, sans-serif; color: #1c1e1a; line-height: 1.6;">
            <h2 style="margin: 0 0 16px; font-family: Georgia, serif;">Meta setup completed</h2>
            <p><strong>${data.first_name} ${data.last_name}</strong> just finished the Meta setup flow.</p>
            <table style="border-collapse: collapse; margin-top: 12px;">
              <tr>
                <td style="padding: 4px 16px 4px 0; color: #8b857a;">Email</td>
                <td style="padding: 4px 0;">${data.email}</td>
              </tr>
              <tr>
                <td style="padding: 4px 16px 4px 0; color: #8b857a;">Started</td>
                <td style="padding: 4px 0;">${new Date(data.created_at).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 4px 16px 4px 0; color: #8b857a;">Completed</td>
                <td style="padding: 4px 0;">${new Date(now).toLocaleString()}</td>
              </tr>
              <tr>
                <td style="padding: 4px 16px 4px 0; color: #8b857a;">Record ID</td>
                <td style="padding: 4px 0; font-family: ui-monospace, monospace;">${id}</td>
              </tr>
            </table>
            <p style="margin-top: 20px; color: #8b857a; font-size: 13px;">
              Verify access in Meta Business Suite, then confirm with the client.
            </p>
          </div>
        `;
        await resend.emails.send({
          from: FROM_EMAIL,
          to: NOTIFY_EMAIL,
          subject,
          html,
        });
      } catch (mailErr) {
        console.error("Email send failed:", mailErr);
        // Don't fail the request; the row is already marked complete.
      }
    } else {
      console.warn("Resend not configured. Skipping completion email.");
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
}
