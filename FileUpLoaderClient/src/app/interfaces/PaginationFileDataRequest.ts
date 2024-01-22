export interface PaginationDataRequest{
    page : number, 
    pageSize: number, 
    selectedType: string, 
    isDescendingOrder : boolean, 
    filterNameSearch: string,
    isAdmin: boolean,
    uploader: string
}