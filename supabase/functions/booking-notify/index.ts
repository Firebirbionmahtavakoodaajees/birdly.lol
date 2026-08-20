import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { sendEmail } from "./email.ts";
import { sendSms } from "./sms.ts";

const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

Deno.serve(async (req) => {
    const { date, start, end, user_id } = await req.json();
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
});
