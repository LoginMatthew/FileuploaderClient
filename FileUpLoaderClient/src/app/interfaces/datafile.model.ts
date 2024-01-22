export interface DataFile {
    id: string,
    name: string,
    description: string,
    filePath: string,
    uploader: string,
    creationDate: Date,
    fileType: string,
    isPrivate: boolean
}