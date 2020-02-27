// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    cdmStatusLevel,
    EventCallback
} from '../internal';

export interface CdmCorpusContext {
    reportAtLevel: cdmStatusLevel;
    corpus: CdmCorpusDefinition;
    statusEvent: EventCallback;
}
