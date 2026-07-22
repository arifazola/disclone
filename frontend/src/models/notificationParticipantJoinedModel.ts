import type { UserModel } from "./userModel";

export interface NotificationParticipantJoinedModel {
    ChannelID: string,
    User: UserModel
}