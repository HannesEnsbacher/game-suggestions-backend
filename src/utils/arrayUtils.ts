export function checkAllMembers<T>(
    array: T[],
    predicate: (value: T) => boolean,
): boolean {
    return array.every(predicate);
}
