// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export class StringUtils {
    public static equalsWithCase(strA: string, strB: string): boolean {
        return strA === strB;
    }

    public static equalsWithIgnoreCase(strA: string, strB: string): boolean {
        return strA.toLowerCase() === strB.toLowerCase();
    }

    public static isNullOrWhiteSpace(s: string) : boolean {
        return s === null || s === undefined || s.trim() === '';
    }

    /**
     * Replaces in the pattern in the source with the value.
     * @param source The source string
     * @param pattern A pattern in the format {p}. The code will try to find {p} and {P}
     * @param value The value to be replaced instead of the pattern
     */
    public static replace(source: string, pattern: string, value: string): string {
        if (pattern.length > 1) {
            // This exception is just for safety since TS doesn't support char type.
            throw new Error('Pattern should have size 1.')
        }

        if (value === undefined) {
            value = '';
        }

        const lowerCasePattern: string = pattern.toLowerCase();
        const upperCasePattern: string = pattern.toUpperCase();
        let upperCaseValue: string = '';
        
        if (value) {
            upperCaseValue = value[0].toUpperCase() + (value.length > 1 ? value.slice(1) : "");
        }

        const result: string = source.replace(`{${lowerCasePattern}}`, value);
        return result.replace(`{${upperCasePattern}}`, upperCaseValue);
    }
}
