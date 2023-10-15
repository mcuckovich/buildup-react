import { useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";
import "./Header.css";

const Header = () => {
  const { logout } = useContext(AuthContext);

  return (
    <header className="Header">
      <Link to="/">
        <h1>
          <img src={logo} alt="Buildup STEAM" />
        </h1>
      </Link>
      <button onClick={logout}>Logout</button>
    </header>
  );
};

export default Header;
