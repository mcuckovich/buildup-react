import { FormEvent, useState } from "react";
import Build from "../models/Build";
import { storage } from "../firebaseConfig";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import "./BuildForm.css";

const kitColors: string[] = [
  "Blue",
  "Red",
  "Yellow",
  "Green",
  "Orange",
  "Purple",
];

interface Props {
  setLoading: (boolean: boolean) => void;
  setShowForm: (boolean: boolean) => void;
  addBuildHandler: (build: Build) => void;
  currentBuild: Build | undefined;
}

const BuildForm = ({
  setLoading,
  setShowForm,
  addBuildHandler,
  currentBuild,
}: Props) => {
  const [title, setTitle] = useState("");
  const [kitColor, setKitColor] = useState("");
  const [directoryName, setDirectoryName] = useState("");
  const [defaultBuild, setDefaultBuild] = useState(false);
  const [directory, setDirectory] = useState<any>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileList = event.target.files;
    if (fileList) {
      setSelectedFile(fileList[0]);
    }
  };

  const isValidImageFile = (fileType: string) => {
    return (
      fileType === "image/jpeg" ||
      fileType === "image/png" ||
      fileType === "image/svg+xml" ||
      fileType === "image/gif"
    );
  };

  const traverseAndProcessImages = async (directoryHandle: any) => {
    setLoading(true);
    let images: string[] = [];
    const promises = [];
    let namesOfFiles: string[] = [];
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === "file") {
        const fileHandle = await entry.getFile();
        const fileType = fileHandle.type;
        if (isValidImageFile(fileType)) {
          namesOfFiles.push(fileHandle.name);
        }
      }
    }
    for await (const entry of directoryHandle.values()) {
      if (entry.kind === "file") {
        const fileHandle = await entry.getFile();
        const fileType = fileHandle.type;
        if (isValidImageFile(fileType)) {
          let storageRef;
          if (currentBuild) {
            storageRef = ref(
              storage,
              `kits/${currentBuild.kitColor.toLowerCase()}/${currentBuild.title.toLowerCase()}/${fileHandle.name.toLowerCase()}`
            );
          } else {
            storageRef = ref(
              storage,
              `kits/${kitColor.toLowerCase()}/${title.toLowerCase()}/${fileHandle.name.toLowerCase()}`
            );
          }

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

    const sortImagesByOrder = (images: string[], namesOfFiles: string[]) => {
      const sortedFiles = namesOfFiles.sort((a, b) => {
        const regex = /copy/i;
        const copyInA = regex.test(a);
        const copyInB = regex.test(b);

        if (copyInA && !copyInB) {
          return -1;
        } else if (!copyInA && copyInB) {
          return 1;
        } else {
          const numA = parseInt(a.split(".")[0]);
          const numB = parseInt(b.split(".")[0]);

          if (!isNaN(numA) && !isNaN(numB)) {
            return numA - numB;
          } else {
            if (isNaN(numA)) {
              return 1;
            } else if (isNaN(numB)) {
              return -1;
            } else {
              return 0;
            }
          }
        }
      });

      const orderedImages: string[] = [];
      for (const file of sortedFiles) {
        const index = images.findIndex((image) =>
          new RegExp(`%2F${encodeURIComponent(file)}`, "i").test(image)
        );
        if (index !== -1) {
          orderedImages.push(images[index]);
        }
      }

      return orderedImages;
    };

    const sortedImages = sortImagesByOrder(images, namesOfFiles);

    if (currentBuild) {
      await addBuildHandler({
        title: currentBuild.title,
        kitColor: currentBuild.kitColor,
        images: sortedImages,
        default: currentBuild.default,
      });
    } else {
      await addBuildHandler({
        title,
        kitColor,
        images: sortedImages,
        default: defaultBuild,
      });
    }
  };

  const handleDirectoryPicker = async () => {
    try {
      const directoryHandle = await (window as any).showDirectoryPicker();
      setDirectoryName(directoryHandle.name);
      setDirectory(directoryHandle);
    } catch (error) {
      console.error("Error selecting directory:", error);
      setDirectoryName("");
      setDirectory(null);
    }
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    setShowForm(false);
    setLoading(true);
    if (directoryName) {
      await traverseAndProcessImages(directory);
      setDirectoryName("");
      setDirectory(null);
      setLoading(false);
    } else if (selectedFile) {
      const storageRef = ref(
        storage,
        `kits/${currentBuild?.kitColor.toLowerCase()}/${currentBuild?.title.toLowerCase()}/${selectedFile.name.toLowerCase()}`
      );
      const snapshot = await uploadBytes(storageRef, selectedFile);
      const url = await getDownloadURL(snapshot.ref);
      await addBuildHandler({
        title: currentBuild?.title!,
        kitColor: currentBuild?.kitColor!,
        images: [url],
        default: currentBuild?.default!,
      });
      setTitle("");
      setKitColor("");
      setSelectedFile(null);
      setDefaultBuild(false);
      setLoading(false);
    }
  };

  return (
    <div className="BuildForm" onClick={() => setShowForm(false)}>
      <div onClick={(e) => e.stopPropagation()}>
        {currentBuild ? (
          <form onSubmit={handleSubmit}>
            {!directoryName && (
              <input
                type="file"
                onChange={handleFileChange}
                accept=".jpeg,.svg,.png,.gif,.jpg"
                id="single-pic"
              />
            )}
            {!directoryName && !selectedFile && (
              <p style={{ textAlign: "center" }}>or</p>
            )}
            {!selectedFile && (
              <button onClick={handleDirectoryPicker} type="button">
                Multiple Pics
              </button>
            )}
            <span>{directoryName}</span>
            <button id="submit" disabled={!directoryName && !selectedFile}>
              Submit
            </button>
          </form>
        ) : (
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
                  {color}
                </option>
              ))}
            </select>
            <div>
              <label htmlFor="default">Default Build?</label>
              <input
                type="checkbox"
                name="default"
                id="default"
                checked={defaultBuild}
                onChange={(e) => setDefaultBuild(e.target.checked)}
              />
            </div>
            <button onClick={handleDirectoryPicker} type="button">
              Pic Folder
            </button>
            <span>{directoryName}</span>
            <button
              id="submit"
              disabled={!title || !kitColor || !directoryName}
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default BuildForm;
