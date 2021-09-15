export interface StandartResponse {
    Status: StandartResponseType
    Payload: any
}
export enum StandartResponseType {
    OK = "OK",
    Patched = "Patched",
    Added = "Added",
    Error = "Error",
    InternalError = "Internal Error",
    Deleted = "Deleted",
}
