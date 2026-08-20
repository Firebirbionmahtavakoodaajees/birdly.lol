-- Booking email webhook. Fires the booking-email function once per inserted slot.
-- REPLACE: <PROJECT_REF> and <SERVICE_ROLE_KEY>
create trigger booking_email
after insert on public.bookings
for each row
execute function supabase_functions.http_request(
    'https://<PROJECT_REF>.supabase.co/functions/v1/booking-email',
    'POST',
    '{"Content-Type":"application/json","Authorization":"Bearer <SERVICE_ROLE_KEY>"}',
    '{}',
    '5000'
);
