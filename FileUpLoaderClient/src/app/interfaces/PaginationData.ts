import { Summary } from "./Summary";
import { DataFile } from "./datafile.model";

export interface PaginationFileData{
    summary: Summary,
    listOfData: DataFile[]
}