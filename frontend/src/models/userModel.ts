export interface UserModel {
    ID: string
    Email: string
    Username: string
    Password: string
    ProfilePricture?: string | ProfilePicture
    JoinedDate: number
}

interface ProfilePicture {
    String: string,
    Valid: boolean
}