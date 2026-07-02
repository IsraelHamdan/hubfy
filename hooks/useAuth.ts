import { AuthDTO } from "@/lib/validatiors/auth.login";
import { CreateUserDTO, UserResponseDTO } from "@/lib/validatiors/user.schema";
import { createContext, useContext } from "react";

export interface AuthContextType {
  user: UserResponseDTO | null;
  login: (credentials: AuthDTO) => Promise<boolean>;
  register: (data: CreateUserDTO) => Promise<boolean>;
  logout: () => Promise<void> | void;
  authenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
