export interface User {
    id: string;
    username: string;
    password: string;
    lastJWT?: string;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
}
