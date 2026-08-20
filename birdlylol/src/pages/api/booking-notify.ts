import { createClient } from "@supabase/supabase-js";

// REPLACE: verified Resend sender domain
const FROM_EMAIL = "Birdly <bookings@birdly.lol>";
const EMAIL_TO = "contacts@birdly.lol";
// REPLACE: Vonage sender ID (registered) and recipient, E.164 without +
const SMS_FROM = "Birdly";
const SMS_TO = "358451846625";

export const prerender = false;

const admin = createClient(
    process.env.PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST({ request }: { request: Request }) {
    const auth = request.headers.get("authorization");
    if (auth !== `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`)
        return new Response("unauthorized", { status: 401 });

    const { date, start, end, user_id } = await request.json();
    if (!date || !start || !end) return new Response("bad payload", { status: 400 });

    const { data } = await admin.auth.admin.getUserById(user_id);
    const raw = data?.user?.phone;
    const phone = raw ? `+${raw.replace(/^\+/, "")}` : "unknown";
    const range = `${start.slice(0, 5)}-${end.slice(0, 5)}`;
    const day = date.split("-").reverse().slice(0, 2).join(".");

    const [e, s] = await Promise.allSettled([
        sendEmail(date, range, phone),
        sendSms(day, range, phone),
    ]);

    return Response.json({
        email: e.status === "fulfilled" ? e.value.status : "failed",
        sms: s.status === "fulfilled" ? s.value.status : "failed",
    });
}

const sendEmail = (date: string, range: string, phone: string) =>
    fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: FROM_EMAIL,
            to: EMAIL_TO,
            subject: `Booking ${date} ${range}`,
            html: `<table style="border-collapse:collapse;font-family:monospace;font-size:14px;letter-spacing:.05em;color:#000">
<tr><td style="border-left:4px solid #b7a6ff;padding:0 0 0 16px">
<div style="padding-bottom:8px"><span style="display:inline-block;width:72px">DATE</span>${date}</div>
<div style="padding-bottom:8px"><span style="display:inline-block;width:72px">TIME</span>${range}</div>
<div><span style="display:inline-block;width:72px">PHONE</span>${phone}</div>
</td></tr>
</table>`,
        }),
    });

const sendSms = (day: string, range: string, phone: string) =>
    fetch("https://rest.nexmo.com/sms/json", {
        method: "POST",
        headers: {
            Authorization: `Basic ${btoa(`${process.env.VONAGE_API_KEY}:${process.env.VONAGE_API_SECRET}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            from: SMS_FROM,
            to: SMS_TO,
            text: `BIRDLY ${day} ${range} ${phone}`,
        }),
    });
