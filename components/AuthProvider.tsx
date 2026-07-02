'use client';
import { AuthContext, AuthContextType } from "@/hooks/useAuth";
import { api } from "@/lib/api";
import { CLIENT_ROUTES, isClientProtectedRoute, isClientPublicRoute, isClientRootRedirectRoute } from "@/lib/routes.config";
import { AuthDTO } from "@/lib/validatiors/auth.login";
import { CreateUserDTO, UserResponseDTO } from "@/lib/validatiors/user.schema";
import axios, { isAxiosError } from "axios";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { ReactNode, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

const PUBLIC_ROUTES = ['/login', '/register'];

export function AuthProvider(
  { children }: { children: ReactNode; }
) {
  const [user, setUser] = useState<UserResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const router = useRouter();
  const pathName = usePathname();
  const currentPath = pathName ?? "/";

  const isRedirectRoute = isClientRootRedirectRoute(currentPath);
  const isPublicRoute = isClientPublicRoute(currentPath);
  const isProtectedRoute = isClientProtectedRoute(currentPath);

  const redirectTo = useCallback(
    (targetPath: string) => {
      if (currentPath !== targetPath) {
        router.replace(targetPath);
      }
    },
    [currentPath, router]
  );

  const checkAuthStatus = useCallback(
    async (opts?: { redirectOnAuthChange?: boolean; }) => {
      const { redirectOnAuthChange = true } = opts || {};

      setIsLoading(true);

      try {
        const res = await api.get<UserResponseDTO>("/auth/me");
        const me = res.data;
        setUser(me);

        if (redirectOnAuthChange && isPublicRoute) {
          redirectTo(CLIENT_ROUTES.DEFAULT_AUTHENTICATED_ROUTE);
        }

        return me;
      } catch (err) {
        setUser(null);

        if (redirectOnAuthChange && isProtectedRoute) {
          redirectTo(CLIENT_ROUTES.AUTH_ROUTE);
        }

        const isUnauthorized =
          axios.isAxiosError(err) && err.response?.status === 401;

        if (!isUnauthorized && isProtectedRoute) {
          toast.error("Erro na autenticação tente novamente mais tarde");
          console.error(`❌[CHECK AUTH] Erro na verificação: ${err}`);
        }

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [isProtectedRoute, isPublicRoute, redirectTo]
  );


  useEffect(() => {
    if (isRedirectRoute) {
      redirectTo(CLIENT_ROUTES.AUTH_ROUTE);
      return;
    }

    void checkAuthStatus({ redirectOnAuthChange: true });
  }, [checkAuthStatus, isRedirectRoute, redirectTo]);

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
        console.log("🚀 ~ AuthProvider ~ res:", res);

        if (res.status === 200) {
          await checkAuthStatus({ redirectOnAuthChange: true });
          return true;
        }

        return false;
      } catch (err) {
        toast.error("Erro na APi ao fazer login");
        console.error(err);

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

