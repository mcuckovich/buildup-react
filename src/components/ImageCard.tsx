import "./ImageCard.css";

interface Props {
  image: string;
  index?: number;
}

const ImageCard = ({ image, index }: Props) => {
  return (
    <div className="ImageCard" style={{ backgroundImage: `url(${image})` }}>
      {index !== undefined && <p>{index}</p>}
    </div>
  );
};

export default ImageCard;
