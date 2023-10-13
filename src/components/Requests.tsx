import { useEffect, useState } from "react";
import "./Requests.css";
import Part from "../models/Part";
import {
  getParts,
  removeAllRequests,
  removeRequest,
} from "../services/buildupService";
import RequestedPart from "../models/RequestedPart";
import RequestTable from "./RequestTable";
import HospitalRequest from "../models/HospitalRequest";

const Requests = () => {
  const [original, setOriginal] = useState<Part[]>([]);
  const [requestsByHospital, setRequestsByHospital] = useState<
    HospitalRequest[]
  >([]);
  const [hospitalView, setHospitalView] = useState(false);

  const removeRequestHandler = async (
    id: string,
    requestedPart: RequestedPart
  ): Promise<void> => {
    await removeRequest(id, requestedPart);
    setOriginal(await getParts());
  };

  const removeAllRequestsHandler = async (id: string): Promise<void> => {
    await removeAllRequests(id);
    setOriginal(await getParts());
  };

  useEffect(() => {
    const filtered: Part[] = original.filter((item) => item.quantity);
    if (filtered.length) {
      const transformedData: any = {};
      filtered.forEach((item) => {
        item.requests!.forEach((request) => {
          const hospital = request.hospital;
          const partData = {
            _id: item._id,
            pic: item.pic,
            name: item.name,
            colorCode: item.colorCode,
            partNumber: item.partNumber,
            color: item.color,
            quantity: request.quantity,
            employees: [{ name: request.employee, quantity: request.quantity }],
          };

          if (!transformedData[hospital]) {
            transformedData[hospital] = [];
          }

          // Check if the part already exists for the hospital
          const existingPartIndex = transformedData[hospital].findIndex(
            (part: any) => part._id === item._id
          );
          if (existingPartIndex !== -1) {
            // If it exists, update the quantity and employees
            transformedData[hospital][existingPartIndex].quantity +=
              request.quantity;
            transformedData[hospital][existingPartIndex].employees.push({
              name: request.employee,
              quantity: request.quantity,
            });
          } else {
            // If it doesn't exist, add it to the hospital's parts array
            transformedData[hospital].push(partData);
          }
        });
      });

      // Convert the transformed data into the final format
      const resultArray: any[] = Object.entries(transformedData).map(
        ([hospital, parts]) => ({
          hospital,
          parts,
        })
      );

      setRequestsByHospital(resultArray);
    } else {
      setRequestsByHospital([]);
    }
  }, [original]);

  useEffect(() => {
    (async () => {
      setOriginal(await getParts());
    })();
  }, []);

  return (
    <div className="Requests">
      <section className="heading-container">
        <h2>Part Requests</h2>
        {hospitalView ? (
          <button onClick={() => setHospitalView(false)}>List by part</button>
        ) : (
          <button onClick={() => setHospitalView(true)}>
            List by hospital
          </button>
        )}
      </section>
      {hospitalView ? (
        <div>
          <ul className="hospitals-container">
            {requestsByHospital.map((hospital, index) => (
              <li key={hospital.hospital + index}>
                <h2>{hospital.hospital}</h2>
                <RequestTable
                  original={requestsByHospital[index].parts}
                  removeRequestHandler={removeRequestHandler}
                  removeAllRequestsHandler={removeAllRequestsHandler}
                  hospitalView={hospitalView}
                  hospital={hospital.hospital}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <RequestTable
          original={original}
          removeRequestHandler={removeRequestHandler}
          removeAllRequestsHandler={removeAllRequestsHandler}
          hospitalView={hospitalView}
        />
      )}
    </div>
  );
};

export default Requests;
