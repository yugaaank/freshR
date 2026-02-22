-- ============================================================================
-- DATE MIGRATION PATCH (V4) — ultra-simple single-line queries
-- ============================================================================

UPDATE public.events SET date = (date + interval '1 year')::date WHERE date < '2026-01-01';

UPDATE public.user_calendar_events SET date = (date + interval '1 year')::date WHERE date < '2026-01-01';

UPDATE public.assignments SET due_date = (due_date + interval '1 year')::date WHERE due_date < '2026-01-01';
