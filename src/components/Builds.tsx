import BuildForm from "./BuildForm";
import { useEffect, useMemo, useState } from "react";
import Build from "../models/Build";
import {
  addBuild,
  deleteBuild,
  getBuilds,
  updateBuild,
  updateOrderOfBuilds,
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
import SortableBuildCard from "./SortableBuildCard";

const Builds = () => {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [builds, setBuilds] = useState<Build[]>([]);
  const [edit, setEdit] = useState(false);
  const [modalIndex, setModalIndex] = useState<number | null>(null);
  const [orderBuilds, setOrderBuilds] = useState(false);

  useEffect(() => {
    const loadBuilds = async () => {
      const fetchedBuilds = await getBuilds();
      setBuilds(fetchedBuilds);
      setLoading(false);
    };
    loadBuilds();
  }, []);

  const { currentBuild, currentBuildIndex } = useMemo(() => {
    const foundBuild = builds.find((item) => item._id === id);
    const currentIndex = builds.findIndex((item) => item._id === id);
    return { currentBuild: foundBuild, currentBuildIndex: currentIndex };
  }, [builds, id]);

  const addBuildHandler = async (build: Build): Promise<void> => {
    try {
      const existingBuild = builds.find(
        (b) => b.title === build.title && b.kitColor === build.kitColor
      );
      if (existingBuild) {
        const updatedBuilds = builds.map((b) =>
          b.title === build.title && b.kitColor === build.kitColor
            ? { ...b, images: [...b.images, ...build.images] }
            : b
        );
        await addBuild(build);
        setBuilds(updatedBuilds);
      } else {
        const newBuild: Build = await addBuild(build);
        setBuilds((prevBuilds) => [...prevBuilds, newBuild]);
      }
    } catch (error) {
      // Handle any potential errors
      console.error("Error adding build:", error);
    }
  };

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

  const handleBuildDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = builds.findIndex((build) => build._id === active.id);
      const newIndex = builds.findIndex((build) => build._id === over.id);
      const updatedBuilds = arrayMove(builds, oldIndex, newIndex);
      setBuilds(updatedBuilds);
    }
  };

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
    try {
      setLoading(true);
      const updatedBuild: Build = await updateBuild(id, build);
      setBuilds((prevBuilds) =>
        prevBuilds.map((prevBuild) =>
          prevBuild._id === id ? updatedBuild : prevBuild
        )
      );
      setLoading(false);
      setEdit(false);
    } catch (error) {
      // Handle any potential errors
      console.error("Error updating build:", error);
    }
  };

  const deleteBuildHandler = async (id: string): Promise<void> => {
    try {
      setLoading(true);
      await deleteBuild(id);
      setBuilds((prevBuilds) =>
        prevBuilds.filter((prevBuild) => prevBuild._id !== id)
      );
      setLoading(false);
    } catch (error) {
      // Handle any potential errors
      console.error("Error deleting build:", error);
      setLoading(false);
    }
  };

  const updateOrderOfBuildsHandler = async (builds: Build[]): Promise<void> => {
    setLoading(true);
    await updateOrderOfBuilds(builds);
    setBuilds(await getBuilds());
    setOrderBuilds(false);
    setLoading(false);
  };

  const cancel = async () => {
    setEdit(false);
    setLoading(true);
    setOrderBuilds(false);
    setBuilds(await getBuilds());
    setLoading(false);
  };

  const increaseIndex = (e: any) => {
    e.stopPropagation();
    if (modalIndex! < currentBuild!.images.length - 1) {
      setModalIndex((prev) => prev! + 1);
    } else {
      setModalIndex(0);
    }
  };

  const decreaseIndex = (e: any) => {
    console.dir(e);
    e.stopPropagation();
    if (modalIndex! === 0) {
      setModalIndex(currentBuild!.images!.length - 1);
    } else {
      setModalIndex((prev) => prev! - 1);
    }
  };

  return (
    <div className="Builds">
      <section className="heading-container">
        <div>
          <h2>{currentBuild ? currentBuild.title : "Builds"}</h2>
        </div>
        {!id && (
          <>
            {orderBuilds ? (
              <div>
                <button onClick={cancel} id="cancel-order">
                  Cancel
                </button>
                <button
                  id="save-order"
                  onClick={() => updateOrderOfBuildsHandler(builds)}
                >
                  Save
                </button>
              </div>
            ) : (
              <div>
                <button onClick={() => setOrderBuilds(true)} id="order">
                  Order
                </button>
                <button
                  onClick={() => setShowForm(true)}
                  className="button"
                  id="add-build"
                >
                  Add Build
                </button>
              </div>
            )}
          </>
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
          >
            <button id="left" onClick={decreaseIndex}>
              ←
            </button>
            <button id="right" onClick={increaseIndex}>
              →
            </button>
          </div>
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
                        <div
                          key={image + index}
                          onClick={() => setModalIndex(index)}
                        >
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
                    <li
                      key={image + index}
                      onClick={() => setModalIndex(index)}
                    >
                      <ImageCard image={image} />
                    </li>
                  ))}
                </ul>
              )}
            </>
          ) : (
            <>
              {builds.length ? (
                <>
                  {orderBuilds ? (
                    // sortable build cards
                    <ul className="card-container">
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleBuildDragEnd}
                      >
                        <SortableContext
                          items={builds.map((build) => build._id!)}
                          strategy={rectSortingStrategy}
                          {...sortableKeyboardCoordinates}
                        >
                          {builds.map((build) => (
                            <SortableBuildCard build={build} key={build._id} />
                          ))}
                        </SortableContext>
                      </DndContext>
                    </ul>
                  ) : (
                    <ul className="card-container">
                      {builds.map((build) => (
                        <BuildCard
                          build={build}
                          key={build._id}
                          updateHandler={updateHandler}
                          deleteBuildHandler={deleteBuildHandler}
                        />
                      ))}
                    </ul>
                  )}
                </>
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
