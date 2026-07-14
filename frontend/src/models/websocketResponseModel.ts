import type { IceCandidateModel } from "./IceCandidateModel";
import type { UserModel } from "./userModel";

export interface WebsocketResponseModel {
    Type: string,
    Sender: string,
    SDP?: string,
    Data?: IceCandidateModel
    Participants: UserModel[]
}