import {
    CdmAttributeContext,
    CdmCorpusContext,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    CdmPurposeReference,
    ResolvedAttributeSetBuilder,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmPurposeDefinition extends CdmObjectDefinitionBase {
    public purposeName: string;
    public extendsPurpose?: CdmPurposeReference;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.purposeDef;
    }

    constructor(ctx: CdmCorpusContext, purposeName: string, extendsPurpose: CdmPurposeReference) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.purposeDef;
            this.purposeName = purposeName;
            if (extendsPurpose) {
                this.extendsPurpose = extendsPurpose;
            }
        }
        // return p.measure(bodyCode);
    }
    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.purposeDef;
        }
        // return p.measure(bodyCode);
    }
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            let copy: CdmPurposeDefinition;
            if (!host) {
                copy = new CdmPurposeDefinition(this.ctx, this.purposeName, undefined);
            } else {
                copy = host as CdmPurposeDefinition;
                copy.ctx = this.ctx;
                copy.purposeName = this.purposeName;
            }
            copy.extendsPurpose = this.extendsPurpose
                ? <CdmPurposeReference>this.extendsPurpose.copy(resOpt)
                : undefined;
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }
    public validate(): boolean {
        return this.purposeName ? true : false;
    }

    public getName(): string {
        // let bodyCode = () =>
        {
            return this.purposeName;
        }
        // return p.measure(bodyCode);
    }
    /**
     * @internal
     */
    public extendsPurposeRef(): CdmPurposeReference {
        // let bodyCode = () =>
        {
            return this.extendsPurpose;
        }
        // return p.measure(bodyCode);
    }
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            let path: string = '';
            if (!this.ctx.corpus.blockDeclaredPathChanges) {
                path = this.declaredPath;
                if (!path) {
                    path = pathFrom + this.purposeName;
                    this.declaredPath = path;
                }
            }

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.extendsPurpose) {
                if (this.extendsPurpose.visit(`${path}/extendsPurpose/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.visitDef(path, preChildren, postChildren)) {
                return true;
            }
            if (postChildren && postChildren(this, path)) {
                return true;
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            return this.isDerivedFromDef(resOpt, this.extendsPurposeRef(), this.getName(), base);
        }
        // return p.measure(bodyCode);
    }
    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            this.constructResolvedTraitsDef(this.extendsPurposeRef(), rtsb, resOpt);
            // rtsb.cleanUp();
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            return undefined;
        }
        // return p.measure(bodyCode);
    }
}
