import { FormEvent, useContext, useState } from "react";
import "./SignIn.css";
import AuthContext from "../context/AuthContext";
import logo from "../assets/images/logo.png";

const SignIn = () => {
  const { checkPassword, incorrectPassword } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const handleSubmit = (e: FormEvent): void => {
    e.preventDefault();
    checkPassword(password);
  };
  return (
    <div className="SignIn">
      <form onSubmit={(e) => handleSubmit(e)}>
        <h1>
          <img src={logo} alt="Buildup STEAM" />
        </h1>
        {incorrectPassword && <p className="fail">Try Again</p>}
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default SignIn;
