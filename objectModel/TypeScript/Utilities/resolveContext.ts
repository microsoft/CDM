import { CdmCorpusContext } from '../Cdm/CdmCorpusContext';
import {
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmObjectBase,
    cdmStatusLevel,
    CdmTraitDefinition,
    EventCallback,
    resolveContextScope,
    resolveOptions
} from '../internal';

export class resolveContext implements CdmCorpusContext {
    public scopeStack: resolveContextScope[];
    public currentScope: resolveContextScope;
    public reportAtLevel: cdmStatusLevel;
    public statusEvent: EventCallback;
    public currentDoc?: CdmDocumentDefinition;
    public relativePath?: string;
    public corpusPathRoot?: string;
    public errors?: number;
    public cache: Map<string, any>;
    public corpus: CdmCorpusDefinition;
    constructor(corpus: CdmCorpusDefinition, statusRpt?: EventCallback, reportAtLevel?: cdmStatusLevel) {
        this.reportAtLevel = reportAtLevel;
        this.statusEvent = statusRpt;
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
