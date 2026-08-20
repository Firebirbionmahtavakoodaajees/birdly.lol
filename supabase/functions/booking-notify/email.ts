// REPLACE: verified Resend sender domain
const FROM = "Birdly <bookings@birdly.lol>";
const TO = "contacts@birdly.lol";

export const sendEmail = (date: string, range: string, phone: string) =>
    fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            from: FROM,
            to: TO,
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
