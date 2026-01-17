import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { login as apiLogin, logout as apiLogout } from "../api/auth";

type AuthContextType = {
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const TOKEN_KEY = "auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    // ✅ hydrate from localStorage on first load
    return Boolean(localStorage.getItem(TOKEN_KEY));
  });

  async function login(username: string, password: string) {
    await apiLogin(username, password);
    setIsAuthenticated(true);
  }

  function logout() {
    apiLogout();
    setIsAuthenticated(false);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
