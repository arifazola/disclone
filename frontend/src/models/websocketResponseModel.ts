import type { IceCandidateModel } from "./IceCandidateModel";

export interface WebsocketResponseModel {
    Type: string,
    Sender: string,
    SDP?: string,
    Data?: IceCandidateModel
    Participants: string[]
}