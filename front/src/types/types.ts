export type Todo = {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    user_id: number;
}

export enum Role {
    SUPER_ADMIN = 'superAdmin',
    ADMIN = 'admin',
    USER = 'user'
}

export type User = {
    role: Role;
    username: string;
}