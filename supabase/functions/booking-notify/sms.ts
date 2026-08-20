// REPLACE: Vonage sender ID (registered) and your number, E.164 without +
const FROM = "Birdly";
const TO = "358451846625";

export const sendSms = (day: string, range: string, phone: string) =>
    fetch("https://rest.nexmo.com/sms/json", {
        method: "POST",
        headers: {
            Authorization: `Basic ${btoa(`${Deno.env.get("VONAGE_API_KEY")}:${Deno.env.get("VONAGE_API_SECRET")}`)}`,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
            from: FROM,
            to: TO,
            text: `BIRDLY ${day} ${range} ${phone}`,
        }),
    });
