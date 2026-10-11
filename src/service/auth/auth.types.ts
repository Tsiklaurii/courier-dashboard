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

export type WorkingDay = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday";

export interface WorkingSlot {
    day: WorkingDay | "";
    time: string;
}

export type WorkingDays = Partial<Record<WorkingDay, { enable: boolean; time: string }[]>>;

export interface RegistrationForm extends LoginForm {
    firstName: string;
    lastName: string;
    pid: string;
    phoneNumber: string;
    profileImage: string;
    address?: string;
    vehicle?: string;
    workingDays?: WorkingDays;
}

export interface RefreshTokenResponse {
    credentials: {
        accessToken: string;
        refreshToken: string;
    };
}
