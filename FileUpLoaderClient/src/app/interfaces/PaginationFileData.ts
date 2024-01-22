import { Summary } from "./Summary";
import { DataFile } from "./datafile.model";

export interface PaginationData{
    summary: Summary,
    listOfData: DataFile[]
}