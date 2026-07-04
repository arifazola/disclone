export function unixSecondTimeStampToDate(unixTime: number | undefined): Date {
    if (unixTime === undefined) {
        return new Date(0)
    }

    return new Date(unixTime * 1000)
}