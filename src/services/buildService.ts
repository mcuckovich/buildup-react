import axios from "axios";
import Build from "../models/Build";

const baseUrl: string = process.env.REACT_APP_API_URL || "";

export const getBuilds = async (): Promise<Build[]> => {
  return (await axios.get(`${baseUrl}/builds`)).data;
};

export const addBuild = async (build: Build): Promise<Build> => {
  return (await axios.post(`${baseUrl}/builds`, build)).data;
};

export const updateBuild = async (id: string, build: Build): Promise<Build> => {
  return (await axios.put(`${baseUrl}/builds/${encodeURIComponent(id)}`, build))
    .data;
};

export const updateOrderOfBuilds = async (
  builds: Build[]
): Promise<Build[]> => {
  return (await axios.put(`${baseUrl}/builds`, builds)).data;
};

export const deleteBuild = async (id: string): Promise<void> => {
  await axios.delete(`${baseUrl}/builds/${encodeURIComponent(id)}`);
};
