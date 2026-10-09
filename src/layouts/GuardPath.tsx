import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { LOCALSTORAGE_KEYS } from "../config";

type AuthState = "authenticated" | "unauthenticated";

const pathOptions = {
  login: { redirectTo: "/", requiredState: "unauthenticated" as const },
  home: { redirectTo: "/login", requiredState: "authenticated" as const },
};

const getAuthState = (): AuthState =>
  localStorage.getItem(LOCALSTORAGE_KEYS.ACCESS_TOKEN)
    ? "authenticated"
    : "unauthenticated";

const GuardPath = ({
  children,
  pathName,
}: {
  children: React.ReactNode;
  pathName: keyof typeof pathOptions;
}) => {
  useLocation();
  const config = pathOptions[pathName];
  const authState = getAuthState();

  if (authState !== config.requiredState)
    return <Navigate to={config.redirectTo} replace />;

  return <React.Fragment>{children}</React.Fragment>;
};

export default GuardPath;
