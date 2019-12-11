/**
 * @internal
 */
export function getFormattedDateString(date: Date): string {
    return date ? date.toISOString() : undefined;
}

/**
 * @internal
 */
export function maxTime(first: Date, second: Date): Date {
    if (!first || !second) {
        return first ? first : second;
    }

    return first > second ? first : second;
}
