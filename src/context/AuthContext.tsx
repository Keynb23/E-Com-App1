import { createContext, useState, useEffect, type ReactNode, useContext } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {auth} from "../lib/firebase/firebase"

interface AuthContextType {
  user: null | User,
  setUser: (user:User) => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth  = (): AuthContextType => {
  return useContext(AuthContext);
};

export default AuthContext;