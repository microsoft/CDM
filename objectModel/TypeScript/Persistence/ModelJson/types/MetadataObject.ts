// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmJsonType } from '../../CdmFolder/types';
import { Annotation } from './Annotation';

/**
 * Represents a base class for a metadata object.
 */
export abstract class MetadataObject {
    public name : string;
    public description : string;
    public annotations : Annotation[];
    public 'cdm:traits' : CdmJsonType[];
}

export const metadataObjectBaseProperties: string[] = [
    'name',
    'description',
    'annotations',
    'cdm:traits'
];
