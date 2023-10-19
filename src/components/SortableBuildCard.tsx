import Build from "../models/Build";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./SortableBuildCard.css";

interface Props {
  build: Build;
}

const SortableBuildCard = ({ build }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: build._id! });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <li
      className="BuildCard"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <div>
        <div
          className="img-container"
          style={{
            backgroundImage: `url(${build.images[0]})`,
          }}
        ></div>
        <div className="text-container">
          <p>Title: {build.title}</p>
          <p>Color: {build.kitColor}</p>
          <p>Images: {build.images.length}</p>
        </div>
      </div>
    </li>
  );
};

export default SortableBuildCard;
