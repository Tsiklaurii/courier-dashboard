
export type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
};

export interface LoginForm {
    email: string;
    password: string;
    role: "admin" | "user" | "courier";
}

export interface RefreshTokenResponse {
    credentials: {
        accessToken: string;
        refreshToken: string;
    };
}
