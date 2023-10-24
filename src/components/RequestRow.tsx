import { useState } from "react";
import Part from "../models/Part";
import "./RequestRow.css";
import RequestedPart from "../models/RequestedPart";

interface Props {
  part: Part;
  index: number;
  removeRequestHandler: (id: string, update: RequestedPart) => void;
  removeAllRequestsHandler: (id: string) => void;
  hospital?: string;
}

const RequestRow = ({
  part,
  index,
  removeRequestHandler,
  removeAllRequestsHandler,
  hospital,
}: Props) => {
  const [showInfo, setShowInfo] = useState<boolean>(false);

  return (
    <>
      <tr>
        <td>{index + 1}</td>
        <td>
          <img
            src={`${process.env.PUBLIC_URL}/assets/parts/${part.pic}`}
            alt={part.name}
          />
        </td>
        <td className="visibility name">{part.name}</td>
        <td className="visibility">{part.color}</td>
        <td className="quantity">
          <div className="container">{part.quantity}</div>
        </td>
        <td className="actions">
          <button
            className={part.quantity ? "" : "info-button"}
            disabled={part.quantity === 0}
            onClick={() => setShowInfo((prev) => !prev)}
          >
            Info
          </button>
          <a
            className="button"
            target="_blank"
            rel="noreferrer"
            href={
              part.colorCode
                ? `https://www.bricklink.com/v2/catalog/catalogitem.page?${new URLSearchParams(
                    { P: part.partNumber, C: part.colorCode.toString() }
                  )}`
                : `https://www.bricklink.com/v2/catalog/catalogitem.page?${new URLSearchParams(
                    { S: part.partNumber }
                  )}`
            }
          >
            Bricklink
          </a>
        </td>
      </tr>
      {showInfo && (
        <tr className="request-info">
          <td colSpan={6}>
            <div className="clear-button-container">
              <button onClick={() => removeAllRequestsHandler(part._id)}>
                Remove All
              </button>
            </div>
            {part.hasOwnProperty("requests") && (
              <ul className="request-list">
                {part.requests!.map((request, requestIndex) => (
                  <li key={request.hospital + requestIndex} className="request">
                    <p>Hospital: {request.hospital}</p>
                    <p>Employee: {request.employee}</p>
                    <p>Quantity: {request.quantity}</p>
                    <button
                      onClick={() =>
                        removeRequestHandler(
                          part._id,
                          part.requests![requestIndex]
                        )
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {part.hasOwnProperty("employees") && (
              <ul className="request-list">
                {part.employees!.map((employee, employeeIndex) => (
                  <li key={employee.name + employeeIndex} className="request">
                    <p>Employee: {employee.name}</p>
                    <p>Quantity: {employee.quantity}</p>
                    <button
                      onClick={() =>
                        removeRequestHandler(part._id, {
                          hospital: hospital!,
                          employee: employee.name,
                          quantity: employee.quantity,
                        })
                      }
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </td>
        </tr>
      )}
    </>
  );
};

export default RequestRow;
