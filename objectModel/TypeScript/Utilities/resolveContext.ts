// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusContext } from '../Cdm/CdmCorpusContext';
import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    cdmLogCode,
    CdmObjectBase,
    cdmStatusLevel,
    CdmTraitDefinition,
    EventCallback,
    resolveContextScope,
    resolveOptions
} from '../internal';
import { EventList } from './Logging/EventList';

export class resolveContext implements CdmCorpusContext {
    /**
     * @internal
     */
    public scopeStack: resolveContextScope[];
    /**
     * @internal
     */
    public currentScope: resolveContextScope;
    public reportAtLevel: cdmStatusLevel;
    public statusEvent: EventCallback;
    public events: EventList;
    public suppressedLogCodes: Set<cdmLogCode>;
    public correlationId: string;
    public currentDoc?: CdmDocumentDefinition;
    /**
     * @internal
     */
    public relativePath?: string;
    public corpusPathRoot?: string;
    /**
     * @internal
     */
    public cache: Map<string, any>;
    public corpus: CdmCorpusDefinition;
    constructor(corpus: CdmCorpusDefinition, statusEvent?: EventCallback, reportAtLevel?: cdmStatusLevel) {
        this.reportAtLevel = reportAtLevel !== undefined ? reportAtLevel : cdmStatusLevel.warning;
        this.statusEvent = statusEvent;
        this.events = new EventList();
        this.suppressedLogCodes = new Set<cdmLogCode>();
        this.cache = new Map<string, any>();
        this.corpus = corpus;
    }

    public setDocumentContext(currentDoc?: CdmDocumentDefinition, corpusPathRoot?: string): void {
        // let bodyCode = () =>
        {
            if (currentDoc) {
                this.currentDoc = currentDoc;
            }
            if (corpusPathRoot) {
                this.corpusPathRoot = corpusPathRoot;
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public pushScope(currentTrait?: CdmTraitDefinition): void {
        // let bodyCode = () =>
        {
            if (!this.scopeStack) {
                this.scopeStack = [];
            }

            const ctxNew: resolveContextScope = {
                currentTrait: currentTrait ? currentTrait : (this.currentScope ? this.currentScope.currentTrait : undefined),
                currentParameter: 0
            };
            this.currentScope = ctxNew;
            this.scopeStack.push(ctxNew);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public popScope(): void {
        // let bodyCode = () =>
        {
            this.scopeStack.pop();
            this.currentScope = this.scopeStack.length ? this.scopeStack[this.scopeStack.length - 1] : undefined;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public fetchCache(forObj: CdmObjectBase, resOpt: resolveOptions, kind: string): any {
        // let bodyCode = () =>
        {
            const key: string = `${forObj.ID.toString()}_${resOpt && resOpt.wrtDoc ? resOpt.wrtDoc.ID.toString() : 'NULL'}_${kind}`;

            return this.cache.get(key);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public updateCache(forObj: CdmObjectBase, resOpt: resolveOptions, kind: string, value: any): void {
        // let bodyCode = () =>
        {
            const key: string = `${forObj.ID.toString()}_${resOpt && resOpt.wrtDoc ? resOpt.wrtDoc.ID.toString() : 'NULL'}_${kind}`;
            this.cache.set(key, value);
        }
        // return p.measure(bodyCode);
    }

}
