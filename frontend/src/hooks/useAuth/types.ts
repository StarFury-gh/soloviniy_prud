type UserRoles = "admin" | "user";

interface JWTPayload {
  id: string;
  email: string;
  role: UserRoles;
}

interface AuthStatus {
  status: boolean;
  user?: JWTPayload;
  loading: boolean;
  error?: string;
}

export type { UserRoles, JWTPayload, AuthStatus };
