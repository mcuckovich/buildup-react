import "./ImageCard.css";

interface Props {
  image: string;
  index?: number;
  deleteImage?: () => void;
}

const ImageCard = ({ image, index, deleteImage }: Props) => {
  const deleteImageHandler = (e: any) => {
    e.stopPropagation();
    deleteImage!();
  };

  return (
    <div className="ImageCard" style={{ backgroundImage: `url(${image})` }}>
      {index !== undefined && <p>{index + 1}</p>}
      {index !== undefined && <button onClick={deleteImageHandler}>X</button>}
    </div>
  );
};

export default ImageCard;
