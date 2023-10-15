import { FormEvent, useState } from "react";
import Build from "../models/Build";
import { storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "./BuildForm.css";

const kitColors: string[] = [
  "blue",
  "red",
  "yellow",
  "green",
  "orange",
  "purple",
];

interface Props {
  setLoading: (boolean: boolean) => void;
  setShowForm: (boolean: boolean) => void;
  addBuildHandler: (build: Build) => void;
}

const BuildForm = ({ setLoading, setShowForm, addBuildHandler }: Props) => {
  const [title, setTitle] = useState("");
  const [kitColor, setKitColor] = useState("");
  const [directoryName, setDirectoryName] = useState("");
  const [directory, setDirectory] = useState<any>(null);

  const isValidImageFile = (fileType: string) => {
    return (
      fileType === "image/jpeg" ||
      fileType === "image/png" ||
      fileType === "image/svg+xml" ||
      fileType === "image/gif"
    );
  };

  const traverseAndProcessImages = async (directoryHandle: any) => {
    let images: string[] = [];
    const promises = [];
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === "file") {
        const fileHandle = await entry.getFile();
        const fileType = fileHandle.type;
        if (isValidImageFile(fileType)) {
          const storageRef = ref(
            storage,
            `kits/${kitColor}/${title.toLowerCase()}/${fileHandle.name}`
          );
          const uploadPromise = uploadBytes(storageRef, fileHandle);
          promises.push(
            uploadPromise.then((snapshot) => {
              return getDownloadURL(snapshot.ref).then((url) => {
                images.push(url);
              });
            })
          );
        } else {
          console.log("Not an image file:", fileHandle.name);
        }
      } else {
        console.log("Not a file:", entry.name);
      }
    }
    await Promise.all(promises);
    await addBuildHandler({ title: title.toLowerCase(), kitColor, images });
  };

  const handleDirectoryPicker = async () => {
    try {
      const directoryHandle = await (window as any).showDirectoryPicker();
      setDirectoryName(directoryHandle.name);
      setDirectory(directoryHandle);
    } catch (error) {
      console.error("Error selecting directory:", error);
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setShowForm(false);
    setLoading(true);
    await traverseAndProcessImages(directory);
    setTitle("");
    setKitColor("");
    setDirectoryName("");
    setDirectory(null);
    setLoading(false);
  };

  return (
    <div className="BuildForm" onClick={() => setShowForm(false)}>
      <div onClick={(e) => e.stopPropagation()}>
        <form onSubmit={handleSubmit}>
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            id="title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label htmlFor="kitColor">Kit Color</label>
          <select
            name="kitColor"
            id="kitColor"
            required
            value={kitColor}
            onChange={(e) => setKitColor(e.target.value)}
          >
            <option value=""></option>
            {kitColors.map((color) => (
              <option value={color} key={color}>
                {color.toUpperCase()}
              </option>
            ))}
          </select>
          <button onClick={handleDirectoryPicker} type="button">
            Pic Folder
          </button>
          <span>{directoryName}</span>
          <button id="submit" disabled={!title || !kitColor || !directoryName}>
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default BuildForm;
