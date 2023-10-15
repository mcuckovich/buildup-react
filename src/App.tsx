import "./App.css";
import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";
import Header from "./components/Header";
import Requests from "./components/Requests";
import SignIn from "./components/SignIn";
import { useContext } from "react";
import AuthContext from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import Builds from "./components/Builds";

function App() {
  const { authenticated } = useContext(AuthContext);

  return (
    <div className="App">
      {authenticated ? (
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/builds" element={<Builds />} />
            <Route path="/builds/:id" element={<Builds />} />
            <Route path="/requests" element={<Requests />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Router>
      ) : (
        <SignIn />
      )}
    </div>
  );
}

export default App;
