import { useCallback, useEffect, useState } from "react";
import "./RequestTable.css";
import Part from "../models/Part";
import RequestRow from "./RequestRow";
import RequestedPart from "../models/RequestedPart";

interface Props {
  original: Part[];
  removeRequestHandler: (id: string, request: RequestedPart) => void;
  removeAllRequestsHandler: (id: string) => {};
  hospitalView: boolean;
  hospital?: string;
}

const RequestTable = ({
  original,
  removeRequestHandler,
  removeAllRequestsHandler,
  hospitalView,
  hospital,
}: Props) => {
  const [sorted, setSorted] = useState<Part[]>([]);
  const [sortMethod, setSortMethod] = useState<string | null>(null);
  const filterParts = useCallback(async () => {
    setSorted([...original].filter((item) => item.quantity));
  }, [original]);

  const sortAscending = useCallback(
    (property: string) => {
      setSorted([
        ...original.sort((a, b) => {
          return a[property as keyof Part]! < b[property as keyof Part]!
            ? -1
            : a[property as keyof Part]! > b[property as keyof Part]!
            ? 1
            : 0;
        }),
      ]);
    },
    [original]
  );

  const sortDescending = useCallback(
    (property: string) => {
      setSorted([
        ...original.sort((a, b) => {
          return a[property as keyof Part]! < b[property as keyof Part]!
            ? 1
            : a[property as keyof Part]! > b[property as keyof Part]!
            ? -1
            : 0;
        }),
      ]);
    },
    [original]
  );

  const loadParts = useCallback(async () => {
    if (sortMethod === null) {
      setSortMethod("quantity-descending");
    } else if (sortMethod === "name-ascending") {
      sortAscending("name");
    } else if (sortMethod === "name-descending") {
      sortDescending("name");
    } else if (sortMethod === "color-ascending") {
      sortAscending("color");
    } else if (sortMethod === "color-descending") {
      sortDescending("color");
    } else if (sortMethod === "quantity-ascending") {
      sortAscending("quantity");
    } else if (sortMethod === "quantity-descending") {
      sortDescending("quantity");
    } else {
      filterParts();
    }
  }, [sortMethod, filterParts, sortAscending, sortDescending]);

  useEffect(() => {
    loadParts();
  }, [loadParts]);

  return (
    <table className="RequestTable">
      <thead>
        <tr>
          <td>#</td>
          <td>Picture</td>
          <td className="visibility name">
            {sortMethod === "name-ascending" ? (
              <button
                onClick={() => setSortMethod("name-descending")}
                className="active"
              >
                Name ↑
              </button>
            ) : sortMethod === "name-descending" ? (
              <button
                onClick={() => setSortMethod("name-ascending")}
                className="active"
              >
                Name ↓
              </button>
            ) : (
              <button onClick={() => setSortMethod("name-ascending")}>
                Name ⊕
              </button>
            )}
          </td>
          <td className="visibility">
            {sortMethod === "color-ascending" ? (
              <button
                onClick={() => setSortMethod("color-descending")}
                className="active"
              >
                Color ↑
              </button>
            ) : sortMethod === "color-descending" ? (
              <button
                onClick={() => setSortMethod("color-ascending")}
                className="active"
              >
                Color ↓
              </button>
            ) : (
              <button onClick={() => setSortMethod("color-ascending")}>
                Color ⊕
              </button>
            )}
          </td>
          <td className="quantity">
            <div className="container">
              {sortMethod === "quantity-ascending" ? (
                <button
                  onClick={() => setSortMethod("quantity-descending")}
                  className="active"
                >
                  Qty ↑
                </button>
              ) : sortMethod === "quantity-descending" ? (
                hospitalView ? (
                  <button
                    onClick={() => setSortMethod("quantity-ascending")}
                    className="active"
                  >
                    Qty ↓
                  </button>
                ) : (
                  <button
                    onClick={() => setSortMethod("quantity-filter")}
                    className="active"
                  >
                    Qty ↓
                  </button>
                )
              ) : sortMethod === "quantity-filter" ? (
                hospitalView ? (
                  <button
                    onClick={() => setSortMethod("quantity-descending")}
                    className="active"
                  >
                    Qty ↑
                  </button>
                ) : (
                  <button
                    onClick={() => setSortMethod("quantity-ascending")}
                    className="active"
                  >
                    Qty ⌀
                  </button>
                )
              ) : (
                <button onClick={() => setSortMethod("quantity-ascending")}>
                  Qty ⊕
                </button>
              )}
            </div>
          </td>
          <td>Action</td>
        </tr>
      </thead>
      <tbody>
        {sorted.map((item, index) => (
          <RequestRow
            part={item}
            index={index}
            key={item.name + index}
            removeRequestHandler={removeRequestHandler}
            removeAllRequestsHandler={removeAllRequestsHandler}
            hospital={hospital}
          />
        ))}
      </tbody>
    </table>
  );
};

export default RequestTable;
