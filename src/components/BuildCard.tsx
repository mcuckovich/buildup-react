import Build from "../models/Build";
import "./BuildCard.css";
import { Link } from "react-router-dom";

interface Props {
  build: Build;
}

const BuildCard = ({ build }: Props) => {
  return (
    <li className="BuildCard">
      <div>
        <div
          id="img-container"
          style={{
            backgroundImage: `url(${build.images[1]})`,
          }}
        ></div>
        <div id="text-container">
          <p>
            <span>Title: </span>
            {build.title.toUpperCase()}
          </p>
          <p>
            <span>Color: </span>
            {build.kitColor.toUpperCase()}
          </p>
          <p>
            <span>Images: </span>
            {build.images.length}
          </p>
          <Link
            to={`/builds/${encodeURIComponent(build._id!)}`}
            id="view"
            className="button"
          >
            View Build
          </Link>
        </div>
      </div>
    </li>
  );
};

export default BuildCard;
