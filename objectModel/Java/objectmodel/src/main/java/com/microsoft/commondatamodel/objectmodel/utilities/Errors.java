// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

import java.util.ArrayList;
import java.util.stream.Collectors;


public class Errors {
    /**
    * Generates a standardized error message describing the missing required fields
    *
    * @param corpusPath      The corpus path for the invalid object.
    * @param missingFields   A list containing the names of the fields that are
    *                        missing.
    * @param onlyOneRequired When true, indicates that only one of the missing
    *                        fields is required, false means all missing fields are
    *                        required. False by default.
    */
    public static String validateErrorString(String corpusPath, ArrayList<String> missingFields, boolean onlyOneRequired) {
        String missingFieldString = String.join(", ", missingFields
        .parallelStream()
        .map((s) -> { 
            return String.format("'%s'", s);
        }).collect(Collectors.toList()));
        if (onlyOneRequired)
            return String.format("Integrity check failed. Reason: The object '%s' is missing the following fields. At least one of the following must be provided: %s", corpusPath, missingFieldString);
        else
            return String.format("Integrity check failed. Reason: The object '%s' is missing the following required fields: %s", corpusPath, missingFieldString);
    }

    public static String validateErrorString(String corpusPath, ArrayList<String> missingFields) {
        return validateErrorString(corpusPath, missingFields, false);
    }
}
