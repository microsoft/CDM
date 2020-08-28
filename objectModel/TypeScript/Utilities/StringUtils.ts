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
}
