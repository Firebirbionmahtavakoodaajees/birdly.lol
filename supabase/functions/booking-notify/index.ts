import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// REPLACE: verified Resend sender domain
const FROM = "Birdly <bookings@birdly.lol>";
const TO = "contacts@birdly.lol";
// REPLACE: Vonage sender (alphanumeric ID or E.164 number) and your phone
const SMS_FROM = "Birdly";
const SMS_TO = "358451846625";

const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Statement-level trigger sends one payload per booking: { date, start, end, user_id }
Deno.serve(async (req) => {
    const { date, start, end, user_id } = await req.json();
    if (!date || !start) return new Response("bad payload", { status: 400 });

    const { data } = await admin.auth.admin.getUserById(user_id);
    const raw = data?.user?.phone;
    const phone = raw ? `+${raw.replace(/^\+/, "")}` : "unknown";
    const range = `${start.slice(0, 5)}-${end.slice(0, 5)}`;
    const day = date.split("-").reverse().slice(0, 2).join(".");

    const email = fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: FROM,
            to: TO,
            subject: `Booking ${date} ${range}`,
            html: `<div style="font-family:monospace;font-size:14px;letter-spacing:.05em;color:#000;border-left:3px solid #b9a5e3;padding:0 0 0 16px">
<div>DATE &nbsp;&nbsp;${date}</div>
<div>TIME &nbsp;&nbsp;${range}</div>
<div>PHONE &nbsp;${phone}</div>
</div>`,
        }),
    });

    const sms = fetch("https://rest.nexmo.com/sms/json", {
        method: "POST",
        headers: {
            Authorization: `Basic ${btoa(`${Deno.env.get("VONAGE_API_KEY")}:${Deno.env.get("VONAGE_API_SECRET")}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            from: SMS_FROM,
            to: SMS_TO,
            text: `BIRDLY ${day} ${range} ${phone}`,
        }),
    });

    const [e, s] = await Promise.allSettled([email, sms]);
    return Response.json({
        email: e.status === "fulfilled" ? e.value.status : "failed",
        sms: s.status === "fulfilled" ? s.value.status : "failed",
    });
});
