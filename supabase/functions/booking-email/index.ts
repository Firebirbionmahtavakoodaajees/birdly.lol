import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// REPLACE: verified Resend sender domain
const FROM = "Birdly <bookings@birdly.lol>";
const TO = "contacts@birdly.lol";

const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
    const { record } = await req.json();
    if (!record) return new Response("no record", { status: 400 });

    const { data } = await admin.auth.admin.getUserById(record.user_id);
    const raw = data?.user?.phone;
    const phone = raw ? `+${raw.replace(/^\+/, "")}` : "unknown";
    const time = record.time.slice(0, 5);

    const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: FROM,
            to: TO,
            subject: `Booking ${record.date} ${time}`,
            html: `<div style="font-family:monospace;font-size:14px;letter-spacing:.05em;color:#000;border-left:3px solid #b9a5e3;padding:0 0 0 16px">
<div>DATE &nbsp;&nbsp;${record.date}</div>
<div>TIME &nbsp;&nbsp;${time} (30 MIN SLOT)</div>
<div>PHONE &nbsp;${phone}</div>
</div>`,
        }),
    });

    return new Response(await res.text(), { status: res.status });
});
