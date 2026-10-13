const ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REFRESH: "/auth/refresh",
  LOGOUT: "/auth/logout",
  ME: "/auth/me",
  USERS: "/users",
  BOOKINGS: "/resource/bookings",
  BOOKING_ID: (id: string) => `/resource/bookings/${id}`,
};

const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
};

const LOCALSTORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
};

export { ENDPOINTS, ROUTES, LOCALSTORAGE_KEYS };
