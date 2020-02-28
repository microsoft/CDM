// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CsvFormatSettings } from './CsvFormatSettings';
import { DataObject, dataObjectBaseProperties } from './DataObject';

/**
 * Represents the name and location of the actual data
 * files corresponding to the entity definition.
 */
export abstract class Partition extends DataObject {
    public refreshTime? : Date;
    public location : string;
    public fileFormatSettings : CsvFormatSettings;
    public 'cdm:lastFileStatusCheckTime'? : string;
    public 'cdm:lastFileModifiedTime' ? : string;
}

export const partitionBaseProperties: string[] = [
    ...dataObjectBaseProperties,
    'refreshTime',
    'location',
    'fileFormatSettings',
    'cdm:lastFileStatusCheckTime',
    'cdm:lastFileModifiedTime'
];
