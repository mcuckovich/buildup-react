import { Link } from "react-router-dom";
import builds from "../assets/images/builds.png";
import part from "../assets/parts/3010.orange.png";
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="Dashboard">
      <section className="heading-container">
        <h2>Dashboard</h2>
      </section>

      <ul>
        <div>
          <h3>Builds</h3>
          <Link to="/builds">
            <li id="builds" style={{ backgroundImage: `url(${builds})` }}></li>
          </Link>
        </div>

        <div>
          <h3>Requests</h3>
          <Link to="/requests">
            <li id="requests" style={{ backgroundImage: `url(${part})` }}></li>
          </Link>
        </div>
      </ul>
    </div>
  );
};

export default Dashboard;
