// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext } from '../Cdm/CdmCorpusContext';
import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    cdmLogCode,
    cdmStatusLevel,
    EventCallback,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSet
} from '../internal';
import { EventList } from './Logging/EventList';

export class resolveContext implements CdmCorpusContext {
    public reportAtLevel: cdmStatusLevel;
    public statusEvent: EventCallback;
    public events: EventList;
    public suppressedLogCodes: Set<cdmLogCode>;
    public correlationId: string;
    /**
     * @internal
     */
    public relativePath?: string;
    /**
     * @internal
     */
    public attributeCache: Map<string, ResolvedAttributeSetBuilder>;
    /**
     * @internal
     */
     public traitCache: Map<string, ResolvedTraitSet>;
    
    public corpus: CdmCorpusDefinition;
    constructor(corpus: CdmCorpusDefinition, statusEvent?: EventCallback, reportAtLevel?: cdmStatusLevel) {
        this.reportAtLevel = reportAtLevel !== undefined ? reportAtLevel : cdmStatusLevel.warning;
        this.statusEvent = statusEvent;
        this.events = new EventList();
        this.suppressedLogCodes = new Set<cdmLogCode>();
        this.attributeCache = new Map<string, ResolvedAttributeSetBuilder>();
        this.traitCache = new Map<string, ResolvedTraitSet>();
        this.corpus = corpus;
    }
}
