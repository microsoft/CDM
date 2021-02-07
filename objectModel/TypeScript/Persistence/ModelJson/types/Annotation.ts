// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Non essential contextual information (key/value pairs) that can be used to store additional
 * context about a properties in the model file. Annotations can be applied at multiple levels
 * including to entities and attributes. Producers can add a prefix, such as “contonso.com:MappingDisplayHint”
 * where “contonso.com:” is the prefix, when annotations are not necessarily relevant to other consumers.
 */
export class Annotation {
    public name : string;
    public value : string;
}
