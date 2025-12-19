'use client';
import { api } from "@/app/lib/api";
import { AuthDTO } from "@/app/lib/validatiors/auth.login";
import { CreateUserDTO, UserResponseDTO } from "@/app/lib/validatiors/user.schema";
import { AuthResponse } from "@/types/auth.types";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";

export interface AuthContextType {
  user: UserResponseDTO | null;
  login: (credentials: AuthDTO) => Promise<boolean>;
  register: (data: CreateUserDTO) => Promise<boolean>;
  logout: () => Promise<void> | void;
  authenticated: boolean;
  isLoading: boolean;
}

const PUBLIC_ROUTES = ['/login', '/register'];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}

export function AuthProvider(
  { children }: { children: ReactNode; }
) {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const pathName = usePathname();

  const isPublicRoute = PUBLIC_ROUTES.some((route) =>
    pathName?.startsWith(route)
  );

  const checkAuthStatus = useCallback(
    async (
      { redirectOnAuthChange = false }:
        { redirectOnAuthChange?: boolean; } = {}
    ) => {
      setIsLoading(true);

      try {
        const res = await api.get<UserResponseDTO>('/auth/me');

        setUser(res.data);

        if (redirectOnAuthChange && isPublicRoute) {
          router.replace('/dashboard');
        }
      } catch (err) {

        setUser(null);

        if (redirectOnAuthChange && !isPublicRoute) {
          router.replace('/login');
        }
      } finally {
        setIsLoading(false);
      }
    },
    [isPublicRoute, router]
  );

  useEffect(() => {
    checkAuthStatus({ redirectOnAuthChange: true });
  }, [pathName, checkAuthStatus]);


  const register = useCallback(
    async (data: CreateUserDTO): Promise<boolean> => {
      try {
        setIsLoading(true);

        const res = await api.post<UserResponseDTO>('/auth/register', data);

        if (res.status === 201) {
          await checkAuthStatus({ redirectOnAuthChange: true });
          return true;
        }
        return false;
      } catch (err) {
        toast.error(`Erro na api ao fazer registro`);
        console.error("❌ [REGISTER] Erro no registro:", err);
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [checkAuthStatus]
  );

  const login = useCallback(
    async (credentials: AuthDTO): Promise<boolean> => {
      try {
        setIsLoading(true);
        const res = await api.post<UserResponseDTO>("/auth/login", credentials);
        if (res.status === 200) {
          await checkAuthStatus({ redirectOnAuthChange: true });
          return true;
        }

        return false;
      } catch (err) {
        toast.error("Erro na APi ao fazer login");
        console.error("❌ [LOGIN] Erro ao logar:", err);
        setUser(null);
        return false;
      } finally { setIsLoading(false); }
    }, [checkAuthStatus]
  );

  const logout = useCallback(
    async () => {
      try {
        setIsLoading(true);

        await api.post("auth/logout");

        setUser(null);
        router.replace('/');
      } catch (err) {
        console.error("❌ [LOGOUT] Erro ao deslogar:", err);
      } finally {
        setIsLoading(false);
      }

    }, [router]
  );

  const value: AuthContextType = {
    user,
    login,
    logout,
    register,
    authenticated: !!user,
    isLoading,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={value}>

      {children}

    </AuthContext.Provider>
  );
}

