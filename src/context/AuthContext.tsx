import { createContext, useState, useEffect, type ReactNode, useContext } from "react";
import { onAuthStateChanged, type User } from "firebase/auth";
import {auth} from "../lib/firebase/firebase"

interface AuthContextType {
  user: null | User,
  setUser: (user:User) => void;
}

// AuthContext
const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
});
// This creates a React Context specifically for managing and sharing user authentication status throughout the application's component tree.

// AuthProvider
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
// This component acts as a provider for the authentication context. It sets up an effect to listen for changes in Firebase authentication state (e.g., user login/logout) and updates the internal `user` state accordingly, making it available to all descendant components.

// useAuth
export const useAuth  = (): AuthContextType => {
  return useContext(AuthContext);
};
// This is a custom hook that provides a convenient way for any functional component to access the current authentication context, including the `user` object and the `setUser` function.

export default AuthContext;