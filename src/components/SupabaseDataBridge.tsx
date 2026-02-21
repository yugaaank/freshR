/**
 * SupabaseDataBridge
 *
 * A headless React component placed inside the app root (in _layout.tsx).
 * It uses React Query hooks to fetch live clubs/events/posts from Supabase and
 * seeds them into hybridStore so the Waves feed, Explore tab, and club detail
 * screens automatically display real data.
 *
 * It also initialises userStore → Supabase Auth session on mount.
 */
import { useEffect } from 'react';
import { useClubs, useFeed } from '../hooks/useClubs';
import { useEvents } from '../hooks/useEvents';
import { useHybridStore } from '../store/hybridStore';
import { useUserStore } from '../store/userStore';

export default function SupabaseDataBridge() {
    const setClubs = useHybridStore((s) => s.setClubs);
    const setEvents = useHybridStore((s) => s.setEvents);
    const setPosts = useHybridStore((s) => s.setPosts);
    const initialize = useUserStore((s) => s.initialize);

    // Initialise auth session once on mount
    useEffect(() => {
        initialize();
    }, [initialize]);

    // Live clubs
    const { data: clubs } = useClubs();
    useEffect(() => {
        if (!clubs) return;
        setClubs(
            clubs.map((c) => ({
                id: c.id,
                name: c.name,
                logo: c.logo,
                banner: c.banner,
                tagline: c.tagline,
                vibeTag: c.vibe_tag as any,
                followersCount: c.followers_count,
            })),
        );
    }, [clubs, setClubs]);

    // Live events
    const { data: events } = useEvents();
    useEffect(() => {
        if (!events) return;
        setEvents(
            events.map((e) => ({
                id: e.id,
                clubId: e.club_id ?? '',
                host: e.host ?? undefined,
                title: e.title,
                description: e.description,
                date: e.date,
                time: e.time,
                location: e.venue,
                totalSeats: e.total_seats,
                registeredCount: e.registered_count,
                category: e.category,
                mediaAssets: e.image ? [e.image] : [],
                engagementScore: e.engagement_score,
            })),
        );
    }, [events, setEvents]);

    // Live feed / posts
    const { data: feed } = useFeed();
    useEffect(() => {
        if (!feed) return;
        setPosts(
            feed.map((p) => ({
                id: p.id,
                clubId: p.club_id,
                linkedEventId: p.linked_event_id,
                type: p.type,
                mediaUrl: p.media_url,
                caption: p.caption,
                engagementScore: p.engagement_score,
            })),
        );
    }, [feed, setPosts]);

    return null; // headless — renders nothing
}
