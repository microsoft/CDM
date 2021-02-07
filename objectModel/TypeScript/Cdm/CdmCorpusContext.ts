// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    cdmStatusLevel,
    EventCallback,
    EventList
} from '../internal';

export interface CdmCorpusContext {
    reportAtLevel: cdmStatusLevel;
    corpus: CdmCorpusDefinition;
    statusEvent: EventCallback;
    /** Collects events emitted by the SDK. */
    events: EventList;
    /** Optional correlation ID to be stamped on all recorded status events. */
    correlationId: string;
}
