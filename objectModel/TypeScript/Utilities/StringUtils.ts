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
     * Capitalizes first letter of the given string.
     * @param str The source string to be capitalized.</param>
     */
    public static capitalizeValue(str: string) : string {
        if (StringUtils.isNullOrWhiteSpace(str)) {
            return "";
        }
        return str[0].toUpperCase() + (str.length > 1 ? str.slice(1) : '');
    }

    /**
     * Replaces in the pattern in the source with the value.
     * @param source The source string
     * @param pattern A pattern in the format {p}. The code will try to find {p} and {P}
     * @param value The value to be replaced instead of the pattern
     */
    public static replace(source: string, pattern: string, value: string): string {
        if (value === undefined) {
            value = '';
        }

        const lowerCasePattern: string = pattern.toLowerCase();
        const upperCasePattern: string = StringUtils.capitalizeValue(pattern);
        const upperCaseValue: string = !StringUtils.isNullOrWhiteSpace(value) ? StringUtils.capitalizeValue(value) : "";

        const result: string = source.replace(`{${lowerCasePattern}}`, value);
        return result.replace(`{${upperCasePattern}}`, upperCaseValue);
    }
}
