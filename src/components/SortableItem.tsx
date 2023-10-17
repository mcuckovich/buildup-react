import "./SortableItem.css";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import ImageCard from "./ImageCard";

interface Props {
  image: string;
  index: number;
  deleteImage: () => void;
}

const SortableItem = ({ image, index, deleteImage }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: image });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ImageCard image={image} index={index} deleteImage={deleteImage} />
    </div>
  );
};

export default SortableItem;
