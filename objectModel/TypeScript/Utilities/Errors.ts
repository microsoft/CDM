// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export class Errors {
    /**
     * Generates a standardized error message describing the missing required fields
     * @param corpusPath The corpus path for the invalid object.
     * @param missingFields A list containing the names of the fields that are missing.
     * @param onlyOneRequired When true, indicates that only one of the missing fields
     * is required, false means all missing fields are required. False by default.
     */
    public static validateErrorString(corpusPath: string, missingFields: string[], onlyOneRequired: boolean = false): string {
        const missingFieldString: string = missingFields.map((s: string) => `'${s}'`)
            .join(', ');
        if (onlyOneRequired) {
            return `Integrity check failed. Reason: The object '${corpusPath}' is missing the following fields. At least one of the following must be provided: ${missingFieldString}`;
        } else {
            return `Integrity check failed. Reason: The object '${corpusPath}' is missing the following required fields: ${missingFieldString}`;
        }
    }
}
