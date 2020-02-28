// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmDocumentDefinition } from '../internal';

/**
 * @internal
 */
export interface docsResult {
    newSymbol?: string;
    docBest?: CdmDocumentDefinition;
    docList?: CdmDocumentDefinition[];
}
