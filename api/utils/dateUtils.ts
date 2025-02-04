export const convertUnixToDate = (unixTimestamp: number): Date => {
    return new Date(unixTimestamp * 1000); // Convert to milliseconds
};
