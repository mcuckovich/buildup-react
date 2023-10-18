import BuildForm from "./BuildForm";
import { useCallback, useEffect, useState } from "react";
import Build from "../models/Build";
import {
  addBuild,
  deleteBuild,
  getBuilds,
  updateBuild,
} from "../services/buildService";
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
  MouseSensor,
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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [edit, setEdit] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);

  const currentBuild: Build | undefined = builds.find(
    (item) => item._id === id
  );
  const currentBuildIndex: number = builds.findIndex((item) => item._id === id);

  const loadBuilds = useCallback(async () => {
    setBuilds(await getBuilds());
    setLoading(false);
  }, []);

  const addBuildHandler = async (build: Build): Promise<void> => {
    await addBuild(build);
    loadBuilds();
  };

  useEffect(() => {
    (async () => {
      loadBuilds();
    })();
  }, [loadBuilds]);

  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const keyboardSensor = useSensor(KeyboardSensor);
  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const sensors = useSensors(pointerSensor, mouseSensor, keyboardSensor);

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

  const deleteImage = (index: number) => {
    setBuilds((prev) => {
      const prevCopy = [...prev];
      const currentBuildCopy = { ...prevCopy[currentBuildIndex] };
      currentBuildCopy.images.splice(index, 1);
      prevCopy[currentBuildIndex] = currentBuildCopy;
      return prevCopy;
    });
  };

  const updateHandler = async (id: string, build: Build): Promise<void> => {
    setEdit(false);
    await updateBuild(id, build);
    loadBuilds();
  };

  const deleteBuildHandler = async (id: string): Promise<void> => {
    setLoading(true);
    await deleteBuild(id);
    loadBuilds();
    setLoading(false);
  };

  const cancel = () => {
    setEdit(false);
    loadBuilds();
  };

  return (
    <div className="Builds">
      <section className="heading-container">
        <div>
          <h2>{currentBuild ? currentBuild.title : "Builds"}</h2>
        </div>
        {!id && (
          <button onClick={() => setShowForm(true)} className="button">
            Add Build
          </button>
        )}
      </section>
      {showForm && (
        <BuildForm
          setLoading={setLoading}
          setShowForm={setShowForm}
          addBuildHandler={addBuildHandler}
          currentBuild={currentBuild}
        />
      )}
      {modalIndex !== null && (
        <div id="image-modal" onClick={() => setModalIndex(null)}>
          <div
            id="image-modal-content"
            style={{
              backgroundImage: `url(${currentBuild?.images[modalIndex]})`,
            }}
          ></div>
        </div>
      )}
      {loading ? (
        <div className="loading-gif-container">
          <img src={gif} alt="lego loading" />
        </div>
      ) : (
        <>
          {currentBuild ? (
            <>
              <div id="links">
                <Link
                  to="/builds"
                  className="button"
                  id="back"
                  onClick={cancel}
                >
                  ← Builds
                </Link>

                <>
                  {edit ? (
                    <div className="btn-container">
                      <button id="more" onClick={() => setShowForm(true)}>
                        ➕
                      </button>
                      <button onClick={cancel} id="cancel">
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          updateHandler(currentBuild._id!, currentBuild)
                        }
                        id="save"
                      >
                        Save
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setEdit(true)} id="edit">
                      Edit
                    </button>
                  )}
                </>
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
                      {...sortableKeyboardCoordinates}
                    >
                      {currentBuild.images.map((image, index) => (
                        <div key={image} onClick={() => setModalIndex(index)}>
                          <SortableItem
                            image={image}
                            index={index}
                            deleteImage={() => deleteImage(index)}
                          />
                        </div>
                      ))}
                    </SortableContext>
                  </DndContext>
                </div>
              ) : (
                <ul className="gallery">
                  {currentBuild.images.map((image, index) => (
                    <li key={image}>
                      <ImageCard image={image} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              {builds.length ? (
                <ul id="card-container">
                  {builds.map((build) => (
                    <BuildCard
                      build={build}
                      key={build._id}
                      updateHandler={updateHandler}
                      deleteBuildHandler={deleteBuildHandler}
                    />
                  ))}
                </ul>
              ) : (
                <p className="no-data">No builds yet</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Builds;
