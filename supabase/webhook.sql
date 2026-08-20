-- One notification per booking (not per 30-min slot).
-- The calendar inserts every slot in a single statement, so a statement-level
-- trigger with a transition table fires once and collapses the slots to a range.
-- REPLACE: <SERVICE_ROLE_KEY> (Supabase → Settings → API → service_role; same
-- value as the SUPABASE_SERVICE_ROLE_KEY env var in Vercel)

create extension if not exists pg_net;

create or replace function public.notify_booking()
returns trigger
language plpgsql
security definer
as $$
declare
    b record;
begin
    -- group by user+date so one statement covers separate ranges safely
    for b in
        select
            date,
            min(time) as start_at,
            max(time) + interval '30 minutes' as end_at,
            user_id
        from new_rows
        group by date, user_id
    loop
        perform net.http_post(
            url := 'https://birdly.lol/api/booking-notify',
            headers := jsonb_build_object(
                'Content-Type', 'application/json',
                'Authorization', 'Bearer <SERVICE_ROLE_KEY>'
            ),
            body := jsonb_build_object(
                'date', b.date,
                'start', b.start_at::text,
                'end', b.end_at::text,
                'user_id', b.user_id
            )
        );
    end loop;

    return null;
end;
$$;

drop trigger if exists booking_email on public.bookings;
drop trigger if exists booking_notify on public.bookings;

create trigger booking_notify
after insert on public.bookings
referencing new table as new_rows
for each statement
execute function public.notify_booking();
