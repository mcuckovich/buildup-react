import EmployeeRequest from "./EmployeeRequest";
import RequestedPart from "./RequestedPart";

export default interface Part {
  _id: string;
  pic: string;
  name: string;
  colorCode: number;
  color: string;
  kits: string[];
  partNumber: string;
  quantity: number;
  requests?: RequestedPart[];
  employees?: EmployeeRequest[];
}
