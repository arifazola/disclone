import type { UserModel } from "./userModel";

export interface Participants {
    Participants: Record<string, UserModel[]>
}