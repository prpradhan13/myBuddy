export type UserProfileType = {
    id: string;
    full_name: string;
    username: string;
    email: string;
    bio: string | null;
    avatar_url: string | null;
    profile_banner: {
        id: number;
        user_id: string;
        content_type: string;
        content_path: string;
        created_at: string;
    } | null;
}

export type UserProfileFormType = {
    full_name?: string;
    username?: string;
    bio?: string | null;
    avatar_url?: string | null;
};

export type SearchUserType = {
    id: string;
    full_name: string;
    username: string;
    email: string;
    avatar_url: string | null;
}