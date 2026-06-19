import type { IceCandidateModel } from "./IceCandidateModel";

export interface WebsocketResponseModel {
    Type: string,
    SDP?: string,
    Data?: IceCandidateModel
}