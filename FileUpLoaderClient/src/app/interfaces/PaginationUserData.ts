import { Summary } from "./Summary";
import { UserModel } from "./user.model";

export interface PaginationUserData
{
    summary: Summary,
    listOfData: UserModel[]
}