
export type User = {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    data?: Record<string, unknown> & {
        image?: string;
        profileImage?: string;
        street?: string;
        pid?: string;
        phoneNumber?: string;
        vehicle?: string;
        address?: string | { street?: string; lng?: number; lat?: number };
    };
};

export interface LoginForm {
    email: string;
    password: string;
    role: "admin" | "user" | "courier";
}

export interface RegistrationForm extends LoginForm {
    firstName: string;
    lastName: string;
    pid: string;
    phoneNumber: string;
    profileImage: string;
    address?: string;
}

export interface RefreshTokenResponse {
    credentials: {
        accessToken: string;
        refreshToken: string;
    };
}
