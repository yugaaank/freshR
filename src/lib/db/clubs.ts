import { supabase } from '../supabase';
import type { Club, ClubPost, DBEvent } from '../types/database.types';

export type { Club, ClubPost };

export type ClubWithEvents = Club & { events: DBEvent[]; posts: ClubPost[] };

export type FeedItem = ClubPost & {
    club: Club;
    event: DBEvent | null;
};

export async function getClubs(): Promise<Club[]> {
    const { data, error } = await supabase
        .from('clubs').select('*').order('followers_count', { ascending: false });
    if (error) throw error;
    return (data ?? []) as Club[];
}

export async function getClubById(id: string): Promise<ClubWithEvents | null> {
    const [clubRes, eventsRes, postsRes] = await Promise.all([
        supabase.from('clubs').select('*').eq('id', id).single(),
        supabase.from('events').select('*').eq('club_id', id).order('date', { ascending: true }),
        supabase.from('club_posts').select('*').eq('club_id', id).order('created_at', { ascending: false }),
    ]);
    if (clubRes.error) throw clubRes.error;
    if (!clubRes.data) return null;
    return {
        ...(clubRes.data as Club),
        events: (eventsRes.data ?? []) as DBEvent[],
        posts: (postsRes.data ?? []) as ClubPost[],
    };
}

export async function getClubPosts(clubId: string): Promise<ClubPost[]> {
    const { data, error } = await supabase
        .from('club_posts').select('*').eq('club_id', clubId).order('engagement_score', { ascending: false });
    if (error) throw error;
    return (data ?? []) as ClubPost[];
}

export async function getFeed(): Promise<FeedItem[]> {
    const { data: posts, error } = await supabase
        .from('club_posts').select('*, clubs(*), events(*)').order('engagement_score', { ascending: false });
    if (error) throw error;
    if (!posts) return [];
    return (posts as any[]).map((p) => ({
        id: p.id as string,
        club_id: p.club_id as string,
        linked_event_id: p.linked_event_id as string | null,
        type: p.type,
        media_url: p.media_url as string,
        caption: p.caption as string,
        engagement_score: p.engagement_score as number,
        created_at: p.created_at as string,
        club: p.clubs as Club,
        event: p.events as DBEvent | null,
    }));
}

export async function followClub(userId: string, clubId: string): Promise<void> {
    const { error } = await supabase
        .from('club_followers').insert({ user_id: userId, club_id: clubId } as any);
    if (error && error.code !== '23505') throw error;
    // Increment follower count directly (no stored procedure needed)
    const { data: club } = await supabase.from('clubs').select('followers_count').eq('id', clubId).single();
    if (club) {
        await supabase.from('clubs').update({ followers_count: (club as any).followers_count + 1 } as any).eq('id', clubId);
    }
}

export async function unfollowClub(userId: string, clubId: string): Promise<void> {
    const { error } = await supabase
        .from('club_followers').delete().eq('user_id', userId).eq('club_id', clubId);
    if (error) throw error;
    const { data: club } = await supabase.from('clubs').select('followers_count').eq('id', clubId).single();
    if (club) {
        await supabase.from('clubs').update({ followers_count: Math.max(0, (club as any).followers_count - 1) } as any).eq('id', clubId);
    }
}

export async function getFollowedClubIds(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from('club_followers').select('club_id').eq('user_id', userId);
    if (error) throw error;
    return ((data ?? []) as any[]).map((r) => r.club_id as string);
}

export async function incrementPostEngagement(postId: string, increment = 1): Promise<void> {
    const { data: post } = await supabase.from('club_posts').select('engagement_score').eq('id', postId).single();
    if (post) {
        await supabase.from('club_posts')
            .update({ engagement_score: (post as any).engagement_score + increment } as any).eq('id', postId);
    }
}
