import { FormEvent, useState } from "react";
import Build from "../models/Build";
import "./BuildCard.css";
import { Link } from "react-router-dom";

const kitColors: string[] = [
  "Blue",
  "Red",
  "Yellow",
  "Green",
  "Orange",
  "Purple",
];

interface Props {
  build: Build;
  updateHandler: (id: string, build: Build) => void;
  deleteBuildHandler: (id: string) => void;
}

const BuildCard = ({ build, updateHandler, deleteBuildHandler }: Props) => {
  const [title, setTitle] = useState<string>(build.title || "");
  const [kitColor, setKitColor] = useState<string>(build.kitColor || "");
  const [editBuild, setEditBuild] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    updateHandler(build._id!, { title, kitColor, images: build.images });
    setEditBuild(false);
  };

  return (
    <li className="BuildCard">
      <div>
        <div
          className="img-container"
          style={{
            backgroundImage: `url(${build.images[0]})`,
          }}
        ></div>
        {editBuild ? (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="title">Title: </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div id="kit-color-container">
              <label htmlFor="kitColor">Color: </label>
              <select
                name="kitColor"
                id="kitColor"
                value={kitColor}
                onChange={(e) => setKitColor(e.target.value)}
              >
                <option value=""></option>
                {kitColors.map((color) => (
                  <option value={color} key={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>
            <div className="build-card-button-container">
              <button id="save-build">Save</button>
              <button
                id="delete-build"
                type="button"
                onClick={() => deleteBuildHandler(build._id!)}
              >
                Delete
              </button>
            </div>
          </form>
        ) : (
          <div className="text-container">
            <p>Title: {build.title}</p>
            <p>Color: {build.kitColor}</p>
            <p>Images: {build.images.length}</p>
            <div className="build-card-button-container">
              <button onClick={() => setEditBuild(true)} id="edit-build">
                Edit
              </button>
              <Link
                to={`/builds/${encodeURIComponent(build._id!)}`}
                id="view"
                className="button"
              >
                View
              </Link>
            </div>
          </div>
        )}
      </div>
    </li>
  );
};

export default BuildCard;
