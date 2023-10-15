import axios from "axios";
import Part from "../models/Part";
import RequestedPart from "../models/RequestedPart";

const baseUrl: string = process.env.REACT_APP_API_URL || "";

export const getParts = async (): Promise<Part[]> => {
  return (await axios.get(`${baseUrl}/parts`)).data;
};

export const removeRequest = async (
  id: string,
  requestedPart: RequestedPart
): Promise<Part> => {
  return (
    await axios.put(
      `${baseUrl}/parts/${encodeURIComponent(id)}/delete/request`,
      requestedPart
    )
  ).data;
};

export const removeAllRequests = async (id: string): Promise<Part> => {
  return (
    await axios.put(
      `${baseUrl}/parts/${encodeURIComponent(id)}/delete-all/requests`
    )
  ).data;
};
