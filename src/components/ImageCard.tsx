import "./ImageCard.css";

interface Props {
  image: string;
  index?: number;
  deleteImage?: () => void;
}

const ImageCard = ({ image, index, deleteImage }: Props) => {
  return (
    <div className="ImageCard" style={{ backgroundImage: `url(${image})` }}>
      {index !== undefined && <p>{index + 1}</p>}
      {index !== undefined && <button onClick={deleteImage}>X</button>}
    </div>
  );
};

export default ImageCard;
