// types/user.ts
export type UserRole = 'student' | 'admin';

export interface UserData {
    uid: string;
    name: string;
    email: string;
    role: UserRole;
    teamId: string | null;
    pixels: number;
}