import {
    cdmObject,
    cdmStatusLevel,
    CorpusImpl,
    DocumentImpl,
    ICdmTraitDef,
    resolveContextScope,
    resolveOptions,
    RptCallback
} from '../internal';

export class resolveContext {
    public scopeStack: resolveContextScope[];
    public currentScope: resolveContextScope;
    public reportAtLevel: cdmStatusLevel;
    public errorAtLevel: cdmStatusLevel;
    public statusRpt: RptCallback;
    public currentDoc?: DocumentImpl;
    public relativePath?: string;
    public corpusPathRoot?: string;
    public errors?: number;
    public cache: Map<string, any>;
    public corpus: CorpusImpl;
    constructor(corpus: CorpusImpl, statusRpt?: RptCallback, reportAtLevel?: cdmStatusLevel, errorAtLevel?: cdmStatusLevel) {
        this.reportAtLevel = reportAtLevel;
        this.errorAtLevel = errorAtLevel;
        this.statusRpt = statusRpt;
        this.cache = new Map<string, any>();
        this.corpus = corpus;
    }

    public setDocumentContext(currentDoc?: DocumentImpl, corpusPathRoot?: string): void {
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
    public pushScope(currentTrait?: ICdmTraitDef): void {
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

    public popScope(): void {
        // let bodyCode = () =>
        {
            this.scopeStack.pop();
            this.currentScope = this.scopeStack.length ? this.scopeStack[this.scopeStack.length - 1] : undefined;
        }
        // return p.measure(bodyCode);
    }

    public getCache(forObj: cdmObject, resOpt: resolveOptions, kind: string): any {
        // let bodyCode = () =>
        {
            const key: string = `${forObj.ID.toString()}_${resOpt && resOpt.wrtDoc ? resOpt.wrtDoc.ID.toString() : 'NULL'}_${kind}`;

            return this.cache.get(key);
        }
        // return p.measure(bodyCode);
    }

    public setCache(forObj: cdmObject, resOpt: resolveOptions, kind: string, value: any): void {
        // let bodyCode = () =>
        {
            const key: string = `${forObj.ID.toString()}_${resOpt && resOpt.wrtDoc ? resOpt.wrtDoc.ID.toString() : 'NULL'}_${kind}`;
            this.cache.set(key, value);
        }
        // return p.measure(bodyCode);
    }

}
