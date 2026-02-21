// Explicit (non-circular) TypeScript types for freshr Supabase schema.
// Keep in sync with supabase/schema.sql.
// Circular Omit<Database[...][...]> references are avoided to prevent 'never' types.

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

// ─── Enums ────────────────────────────────────────────────────────────────────
export type EventCategory = 'Tech' | 'Cultural' | 'Sports' | 'Academic' | 'Music' | 'Drama' | 'Workshop';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type AssignmentStatus = 'pending' | 'submitted' | 'graded';
export type PostType = 'image' | 'reel';
export type AlertType = 'info' | 'warning' | 'success' | 'error';
export type PrintStatus = 'pending' | 'processing' | 'ready' | 'collected';
export type VibeTag = 'Competitive' | 'Creative' | 'Social' | 'Academic' | 'Tech';

// ─── Row types ────────────────────────────────────────────────────────────────
export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string; name: string; phone: string | null; college: string; branch: string;
                    year: number; roll_no: string | null; avatar_url: string | null;
                    interests: string[]; created_at: string; updated_at: string;
                };
                Insert: {
                    id: string; name?: string; phone?: string | null; college?: string; branch?: string;
                    year?: number; roll_no?: string | null; avatar_url?: string | null; interests?: string[];
                };
                Update: {
                    name?: string; phone?: string | null; college?: string; branch?: string;
                    year?: number; roll_no?: string | null; avatar_url?: string | null;
                    interests?: string[]; updated_at?: string;
                };
                Relationships: [];
            };

            campus_alerts: {
                Row: {
                    id: string; emoji: string; title: string; description: string;
                    type: AlertType; expires_at: string | null; is_active: boolean; created_at: string;
                };
                Insert: {
                    emoji?: string; title: string; description?: string; type?: AlertType;
                    expires_at?: string | null; is_active?: boolean;
                };
                Update: {
                    emoji?: string; title?: string; description?: string; type?: AlertType;
                    expires_at?: string | null; is_active?: boolean;
                };
                Relationships: [];
            };

            clubs: {
                Row: {
                    id: string; name: string; logo: string; banner: string; tagline: string;
                    vibe_tag: VibeTag; followers_count: number; created_at: string;
                };
                Insert: {
                    name: string; logo: string; banner: string; tagline?: string;
                    vibe_tag?: VibeTag; followers_count?: number;
                };
                Update: {
                    name?: string; logo?: string; banner?: string; tagline?: string;
                    vibe_tag?: VibeTag; followers_count?: number;
                };
                Relationships: [];
            };

            club_followers: {
                Row: { user_id: string; club_id: string; created_at: string };
                Insert: { user_id: string; club_id: string };
                Update: { user_id?: string; club_id?: string };
                Relationships: [];
            };

            events: {
                Row: {
                    id: string; club_id: string | null; host: string | null; title: string;
                    description: string; date: string; time: string; venue: string;
                    organizer: string | null; college: string | null; city: string | null;
                    total_seats: number; registered_count: number; category: EventCategory;
                    color_bg: string | null; emoji: string | null; image: string | null;
                    is_featured: boolean; tags: string[]; tickets: Json; media_assets: string[];
                    engagement_score: number; created_at: string;
                };
                Insert: {
                    club_id?: string | null; host?: string | null; title: string; description?: string;
                    date: string; time: string; venue?: string; organizer?: string | null;
                    college?: string | null; city?: string | null; total_seats?: number;
                    registered_count?: number; category?: EventCategory; color_bg?: string | null;
                    emoji?: string | null; image?: string | null; is_featured?: boolean;
                    tags?: string[]; tickets?: Json; media_assets?: string[]; engagement_score?: number;
                };
                Update: {
                    club_id?: string | null; host?: string | null; title?: string; description?: string;
                    date?: string; time?: string; venue?: string; organizer?: string | null;
                    college?: string | null; city?: string | null; total_seats?: number;
                    registered_count?: number; category?: EventCategory; color_bg?: string | null;
                    emoji?: string | null; image?: string | null; is_featured?: boolean;
                    tags?: string[]; tickets?: Json; media_assets?: string[]; engagement_score?: number;
                };
                Relationships: [];
            };

            event_registrations: {
                Row: { user_id: string; event_id: string; created_at: string };
                Insert: { user_id: string; event_id: string };
                Update: never;
                Relationships: [];
            };

            club_posts: {
                Row: {
                    id: string; club_id: string; linked_event_id: string | null;
                    type: PostType; media_url: string; caption: string;
                    engagement_score: number; created_at: string;
                };
                Insert: {
                    club_id: string; linked_event_id?: string | null; type?: PostType;
                    media_url: string; caption?: string; engagement_score?: number;
                };
                Update: {
                    club_id?: string; linked_event_id?: string | null; type?: PostType;
                    media_url?: string; caption?: string; engagement_score?: number;
                };
                Relationships: [];
            };

            restaurants: {
                Row: {
                    id: string; name: string; cuisine: string; rating: number; delivery_time: string;
                    delivery_fee: number; min_order: number; image: string | null;
                    is_open: boolean; tag: string | null; color_bg: string | null;
                    emoji: string | null; created_at: string;
                };
                Insert: {
                    name: string; cuisine: string; rating?: number; delivery_time?: string;
                    delivery_fee?: number; min_order?: number; image?: string | null;
                    is_open?: boolean; tag?: string | null; color_bg?: string | null; emoji?: string | null;
                };
                Update: {
                    name?: string; cuisine?: string; rating?: number; delivery_time?: string;
                    delivery_fee?: number; min_order?: number; image?: string | null;
                    is_open?: boolean; tag?: string | null; color_bg?: string | null; emoji?: string | null;
                };
                Relationships: [];
            };

            menu_items: {
                Row: {
                    id: string; restaurant_id: string; name: string; description: string;
                    price: number; original_price: number | null; category: string;
                    image: string | null; is_veg: boolean; is_popular: boolean;
                    rating: number; prep_time: number; is_available: boolean; created_at: string;
                };
                Insert: {
                    restaurant_id: string; name: string; description?: string; price: number;
                    original_price?: number | null; category: string; image?: string | null;
                    is_veg?: boolean; is_popular?: boolean; rating?: number;
                    prep_time?: number; is_available?: boolean;
                };
                Update: {
                    restaurant_id?: string; name?: string; description?: string; price?: number;
                    original_price?: number | null; category?: string; image?: string | null;
                    is_veg?: boolean; is_popular?: boolean; rating?: number;
                    prep_time?: number; is_available?: boolean;
                };
                Relationships: [];
            };

            orders: {
                Row: {
                    id: string; user_id: string; restaurant_id: string;
                    status: OrderStatus; total_price: number; created_at: string; updated_at: string;
                };
                Insert: {
                    user_id: string; restaurant_id: string; status?: OrderStatus; total_price: number;
                };
                Update: {
                    status?: OrderStatus; total_price?: number; updated_at?: string;
                };
                Relationships: [];
            };

            order_items: {
                Row: { id: string; order_id: string; menu_item_id: string; quantity: number; unit_price: number };
                Insert: { order_id: string; menu_item_id: string; quantity: number; unit_price: number };
                Update: { quantity?: number; unit_price?: number };
                Relationships: [];
            };

            teachers: {
                Row: {
                    id: string; name: string; subject: string; department: string;
                    rating: number; review_count: number; office_hours: string;
                    email: string; cabin: string; image: string | null;
                    experience: number; weekly_classes: number[]; is_available_now: boolean; created_at: string;
                };
                Insert: {
                    name: string; subject: string; department: string; rating?: number;
                    review_count?: number; office_hours?: string; email: string; cabin: string;
                    image?: string | null; experience?: number;
                    weekly_classes?: number[]; is_available_now?: boolean;
                };
                Update: {
                    name?: string; subject?: string; department?: string; rating?: number;
                    review_count?: number; office_hours?: string; email?: string; cabin?: string;
                    image?: string | null; experience?: number;
                    weekly_classes?: number[]; is_available_now?: boolean;
                };
                Relationships: [];
            };

            departments: {
                Row: {
                    id: string;
                    name: string;
                    code: string;
                    description: string | null;
                    created_at: string;
                };
                Insert: {
                    name: string;
                    code: string;
                    description?: string | null;
                };
                Update: {
                    name?: string;
                    code?: string;
                    description?: string | null;
                };
                Relationships: [];
            };

            teacher_reviews: {
                Row: {
                    id: string; teacher_id: string; user_id: string;
                    rating: number; comment: string; created_at: string;
                };
                Insert: { teacher_id: string; user_id: string; rating: number; comment?: string };
                Update: { rating?: number; comment?: string };
                Relationships: [];
            };

            subjects: {
                Row: { id: string; name: string; code: string; credits: number; professor: string; created_at: string };
                Insert: { name: string; code: string; credits?: number; professor?: string };
                Update: { name?: string; code?: string; credits?: number; professor?: string };
                Relationships: [];
            };

            user_subjects: {
                Row: {
                    user_id: string; subject_id: string; attendance: number;
                    grade: string; grade_point: number; next_class: string | null;
                };
                Insert: {
                    user_id: string; subject_id: string; attendance?: number;
                    grade?: string; grade_point?: number; next_class?: string | null;
                };
                Update: {
                    attendance?: number; grade?: string; grade_point?: number; next_class?: string | null;
                };
                Relationships: [];
            };

            assignments: {
                Row: {
                    id: string; subject_id: string; title: string;
                    due_date: string; total_marks: number; created_at: string;
                };
                Insert: { subject_id: string; title: string; due_date: string; total_marks?: number };
                Update: { subject_id?: string; title?: string; due_date?: string; total_marks?: number };
                Relationships: [];
            };

            user_assignments: {
                Row: { user_id: string; assignment_id: string; status: AssignmentStatus; marks: number | null };
                Insert: { user_id: string; assignment_id: string; status?: AssignmentStatus; marks?: number | null };
                Update: { status?: AssignmentStatus; marks?: number | null };
                Relationships: [];
            };

            coding_challenges: {
                Row: {
                    id: string; title: string; difficulty: DifficultyLevel;
                    tags: string[]; description: string; examples: Json; constraints: string[];
                    acceptance_rate: number; total_submissions: number; date: string; created_at: string;
                };
                Insert: {
                    title: string; difficulty?: DifficultyLevel; tags?: string[];
                    description: string; examples?: Json; constraints?: string[];
                    acceptance_rate?: number; total_submissions?: number; date: string;
                };
                Update: {
                    title?: string; difficulty?: DifficultyLevel; tags?: string[];
                    description?: string; examples?: Json; constraints?: string[];
                    acceptance_rate?: number; total_submissions?: number;
                };
                Relationships: [];
            };

            user_challenge_submissions: {
                Row: {
                    id: string; user_id: string; challenge_id: string;
                    solved_at: string; language: string; code: string;
                };
                Insert: { user_id: string; challenge_id: string; language?: string; code?: string };
                Update: { language?: string; code?: string };
                Relationships: [];
            };

            user_streaks: {
                Row: {
                    user_id: string; current_streak: number; longest_streak: number;
                    total_solved: number; last_solved_at: string | null;
                };
                Insert: {
                    user_id: string; current_streak?: number; longest_streak?: number;
                    total_solved?: number; last_solved_at?: string | null;
                };
                Update: {
                    current_streak?: number; longest_streak?: number;
                    total_solved?: number; last_solved_at?: string | null;
                };
                Relationships: [];
            };

            print_requests: {
                Row: {
                    id: string; user_id: string; file_url: string; file_name: string;
                    pages: number; copies: number; color: boolean; scheduled_time: string;
                    status: PrintStatus; pickup_code: string | null; created_at: string;
                };
                Insert: {
                    user_id: string; file_url: string; file_name: string; pages?: number;
                    copies?: number; color?: boolean; scheduled_time: string;
                    status?: PrintStatus; pickup_code?: string | null;
                };
                Update: {
                    status?: PrintStatus; pickup_code?: string | null;
                };
                Relationships: [];
            };

            push_notification_tokens: {
                Row: { id: string; user_id: string; token: string; platform: string; created_at: string };
                Insert: { user_id: string; token: string; platform: string };
                Update: { token?: string; platform?: string };
                Relationships: [];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            event_category: EventCategory;
            difficulty_level: DifficultyLevel;
            order_status: OrderStatus;
            assignment_status: AssignmentStatus;
            post_type: PostType;
            alert_type: AlertType;
            print_status: PrintStatus;
            vibe_tag: VibeTag;
        };
        CompositeTypes: Record<string, never>;
    };
}

// ─── Shorthand helpers ────────────────────────────────────────────────────────
export type Tables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Row'];

export type InsertTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Insert'];

export type UpdateTables<T extends keyof Database['public']['Tables']> =
    Database['public']['Tables'][T]['Update'];

// Convenience row aliases
export type Profile = Tables<'profiles'>;
export type CampusAlert = Tables<'campus_alerts'>;
export type Club = Tables<'clubs'>;
export type DBEvent = Tables<'events'>;
export type ClubPost = Tables<'club_posts'>;
export type Restaurant = Tables<'restaurants'>;
export type MenuItemRow = Tables<'menu_items'>;
export type Order = Tables<'orders'>;
export type OrderItem = Tables<'order_items'>;
export type Teacher = Tables<'teachers'>;
export type Subject = Tables<'subjects'>;
export type UserSubject = Tables<'user_subjects'>;
export type Assignment = Tables<'assignments'>;
export type UserAssignment = Tables<'user_assignments'>;
export type Challenge = Tables<'coding_challenges'>;
export type UserStreak = Tables<'user_streaks'>;
export type PrintRequest = Tables<'print_requests'>;
