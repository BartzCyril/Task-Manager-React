export type TypeTask = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    user_id: number;
    created_at: Date;
}

export enum AuthStatus {
    UNAUTHORIZED = 'Vous n\'êtes pas autorisé à accéder à cette ressource',
    NOT_AUTHENTICATED = 'Vous n\'êtes plus connecté'
}

export enum Role {
    SUPER_ADMIN = 'superAdmin',
    ADMIN = 'admin',
    USER = 'user'
}

export type User = {
    role: Role;
    username: string;
    id: number;
    email: string;
}