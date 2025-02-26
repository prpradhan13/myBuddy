export type UserProfileType = {
    id: string;
    full_name: string;
    username: string;
    email: string;
    bio: string | null;
    avatar_url: string | null;
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