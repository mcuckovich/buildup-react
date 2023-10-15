import BuildForm from "./BuildForm";
import { useCallback, useEffect, useState } from "react";
import Build from "../models/Build";
import { addBuild, getBuilds, updateBuild } from "../services/buildService";
import BuildCard from "./BuildCard";
import { Link, useParams } from "react-router-dom";
import ImageCard from "./ImageCard";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import SortableItem from "./SortableItem";
import gif from "../assets/images/loading.gif";
import "./Builds.css";

const Builds = () => {
  const id = useParams().id;
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [edit, setEdit] = useState(false);

  const currentBuild: Build | undefined = builds.find(
    (item) => item._id === id
  );

  const loadBuilds = useCallback(async () => {
    if (!loading) {
      setBuilds(await getBuilds());
    }
  }, [loading]);

  const addBuildHandler = async (build: Build): Promise<void> => {
    console.log(build);
    await addBuild(build);
    loadBuilds();
  };

  useEffect(() => {
    (async () => {
      loadBuilds();
    })();
  }, [loadBuilds]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const currentBuildIndex = builds.findIndex(
        (build) => build._id === currentBuild?._id
      );

      setBuilds((prev) => {
        const prevCopy: Build[] = [...prev];
        const buildCopy = { ...currentBuild! };
        const oldIndex = currentBuild!.images.indexOf(active.id);
        const newIndex = currentBuild!.images.indexOf(over.id);

        buildCopy.images = arrayMove(currentBuild!.images, oldIndex, newIndex);
        prevCopy[currentBuildIndex] = buildCopy;

        return prevCopy;
      });
    }
  };

  const handleUpdateBuilds = async (id: string): Promise<void> => {
    setEdit(false);
    await updateBuild(id, currentBuild!);
    loadBuilds();
  };

  return (
    <div className="Builds">
      <section className="heading-container">
        <div>
          <h2>{currentBuild ? currentBuild.title.toUpperCase() : "Builds"}</h2>
        </div>
        {!id && (
          <button onClick={() => setShowForm(true)} className="button">
            Add Build
          </button>
        )}
      </section>
      {currentBuild ? (
        <>
          <div id="links">
            <Link to="/builds" className="button" id="back">
              ← Builds
            </Link>
            <div>
              {edit ? (
                <button
                  onClick={() => handleUpdateBuilds(currentBuild._id!)}
                  id="save"
                >
                  Save
                </button>
              ) : (
                <button onClick={() => setEdit(true)} id="edit">
                  Edit
                </button>
              )}
            </div>
          </div>
          {edit ? (
            <div className="gallery">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={currentBuild.images}
                  strategy={rectSortingStrategy}
                >
                  {currentBuild.images.map((image, index) => (
                    <SortableItem key={image} image={image} index={index} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <ul className="gallery">
              {currentBuild.images.map((image) => (
                <li key={image}>
                  <ImageCard image={image} />
                </li>
              ))}
            </ul>
          )}
        </>
      ) : (
        <>
          {showForm && (
            <BuildForm
              setLoading={setLoading}
              setShowForm={setShowForm}
              addBuildHandler={addBuildHandler}
            />
          )}
          {loading ? (
            <div className="loading-gif-container">
              <img src={gif} alt="lego loading" />
            </div>
          ) : (
            <ul id="card-container">
              {builds.map((build) => (
                <BuildCard build={build} key={build._id} />
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default Builds;
