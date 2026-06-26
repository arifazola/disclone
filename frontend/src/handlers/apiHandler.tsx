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