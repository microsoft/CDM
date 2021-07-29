// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { cdmLogCode } from 'Enums/cdmLogCode';
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
    /** List of error/warning code which filters out in logs. */
    suppressedLogCodes: Set<cdmLogCode>;
    /** Optional correlation ID to be stamped on all recorded status events. */
    correlationId: string;
}
