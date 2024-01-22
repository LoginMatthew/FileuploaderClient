export interface DataFileToCreate {
    name: string,
    description: string,
    filePath: string,
    uploader: string,
    creationDate: Date,
    fileType: string,
    isPrivate: boolean
}