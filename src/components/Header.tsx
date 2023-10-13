import "./Header.css";

const Header = () => {
  return (
    <header className="Header">
      <h1>
        <img
          src={process.env.PUBLIC_URL + "assets/images/logo.png"}
          alt="logo"
        />
      </h1>
    </header>
  );
};

export default Header;
