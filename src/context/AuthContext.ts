import { createContext } from "react";

interface AuthContextModel {
  authenticated: boolean;
  incorrectPassword: boolean;
  checkPassword: (password: string) => void;
  logout: () => void;
}

const defaultValues: AuthContextModel = {
  authenticated: false,
  incorrectPassword: false,
  checkPassword: () => {},
  logout: () => {},
};

const AuthContext = createContext(defaultValues);

export default AuthContext;
