import {
    CdmCorpusContext,
    cdmObjectSimple,
    cdmObjectType,
    copyOptions,
    DocumentImpl,
    friendlyFormatNode,
    ICdmImport,
    ICdmObject,
    Import,
    resolveOptions,
    VisitCallback
} from '../internal';

export class ImportImpl extends cdmObjectSimple implements ICdmImport {
    public corpusPath: string;
    public moniker: string;
    public doc: DocumentImpl;

    constructor(ctx: CdmCorpusContext, corpusPath: string, moniker: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.corpusPath = corpusPath;
            this.moniker = moniker ? moniker : undefined;
            this.objectType = cdmObjectType.import;
        }
        // return p.measure(bodyCode);
    }
    public static instanceFromData(ctx: CdmCorpusContext, object: Import): ImportImpl {
        // let bodyCode = () =>
        {
            let corpusPath: string = object.corpusPath;
            if (!corpusPath) {
                corpusPath = object.uri;
            }

            return new ImportImpl(ctx, corpusPath, object.moniker);
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.import;
        }
        // return p.measure(bodyCode);
    }
    public copyData(resOpt: resolveOptions, options: copyOptions): Import {
        // let bodyCode = () =>
        {
            return { moniker: this.moniker, corpusPath: this.corpusPath };
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt: resolveOptions): ImportImpl {
        // let bodyCode = () =>
        {
            const copy: ImportImpl = new ImportImpl(this.ctx, this.corpusPath, this.moniker);
            copy.doc = this.doc;

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        // let bodyCode = () =>
        {
            return this.corpusPath ? true : false;
        }
        // return p.measure(bodyCode);
    }
    public getFriendlyFormat(): friendlyFormatNode {
        // let bodyCode = () =>
        {
            const ff: friendlyFormatNode = new friendlyFormatNode();
            ff.separator = ' ';
            ff.addChildString('import *');
            ff.addChildString(this.moniker ? `as ${this.moniker}` : undefined);
            ff.addChildString('from');
            ff.addChildString(`${this.corpusPath}`, true);

            return ff;
        }
        // return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            // not much to do
            if (preChildren && preChildren(this, pathFrom)) {
                return false;
            }
            if (postChildren && postChildren(this, pathFrom)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }
}
