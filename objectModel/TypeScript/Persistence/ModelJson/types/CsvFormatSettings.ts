// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { FileFormatSettings } from './FileFormatSettings';

export abstract class CsvFormatSettings extends FileFormatSettings {
    public columnHeaders? : boolean | string;
    public csvStyle : string;
    public delimiter : string;
    public quoteStyle : string;
    public encoding: string;
}
