import { BASE_URL } from "../consts/const"
import type { ResponseModel } from "../models/responseModel"

export async function apiGet(url: string) {
    const response = await fetch(url, {
        method: "GET",
        credentials: "include"
    })

    if (response.status === 401) {
        window.location.href = "/login"
    }

    if (response.status === 500) {
        throw new Error("Internal server error. Please try again")
    }

    if (!response.ok) {
        throw new Error("error")
    }

    return response
}

export interface ApiPostParam {
    url: string,
    formData: FormData
}
export async function apiPost(params: ApiPostParam) {
    const response = await fetch(params.url, {
        method: "POST",
        credentials: "include",
        body: params.formData
    })

    if (response.status === 401) {
        window.location.href = "/login"
    }

    if (response.status === 500) {
        throw new Error("Internal server error. Please try again")
    }

    // if (!response.ok) {
    //     throw new Error("error")
    // }

    return response.json() as Promise<ResponseModel<any>>
}