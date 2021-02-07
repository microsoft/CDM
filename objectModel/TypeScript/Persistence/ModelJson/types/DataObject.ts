// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { MetadataObject, metadataObjectBaseProperties } from './MetadataObject';

/**
 * Defines a base class for a data object.
 */
export abstract class DataObject extends MetadataObject {
    public isHidden?: boolean;
}

export const dataObjectBaseProperties: string[] = [
    ...metadataObjectBaseProperties,
    'isHidden'
];
