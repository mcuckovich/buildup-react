import { ReactNode, useState } from "react";
import AuthContext from "./AuthContext";

interface Props {
  children: ReactNode;
}
const password: string = process.env.REACT_APP_PASSWORD || "";

const AuthContextProvider = ({ children }: Props) => {
  const [authenticated, setAuthenticated] = useState(false);
  const [incorrectPassword, setIncorrectPassword] = useState(false);

  const checkPassword = (attempt: string): void => {
    if (attempt === password) {
      setAuthenticated(true);
      setIncorrectPassword(false);
    } else {
      setIncorrectPassword(true);
    }
  };

  const logout = () => {
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ authenticated, checkPassword, logout, incorrectPassword }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
