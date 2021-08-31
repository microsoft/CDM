// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmObjectReference,
    CdmObjectReferenceBase,
    CdmTraitCollection,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';

export abstract class CdmObjectDefinitionBase extends CdmObjectBase implements CdmObjectDefinition {
    public explanation: string;
    public readonly exhibitsTraits: CdmTraitCollection;
    // baseCache : Set<string>;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.exhibitsTraits = new CdmTraitCollection(this.ctx, this);
    }

    public abstract getName(): string;
    public abstract isDerivedFrom(base: string, resOpt?: resolveOptions): boolean;
    /**
     * @internal
     */
    public copyDef(resOpt: resolveOptions, copy: CdmObjectDefinitionBase): void {
        // let bodyCode = () =>
        {
            copy.ctx = this.ctx;
            copy.declaredPath = this.declaredPath;
            copy.explanation = this.explanation;
            copy.exhibitsTraits.clear();
            for (const trait of this.exhibitsTraits) {
                copy.exhibitsTraits.push(trait);
            }
            copy.inDocument = this.inDocument; // if gets put into a new document, this will change. until, use the source
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     * Creates a 'portable' reference object to this object. portable means there is no symbolic name set until this reference is placed 
     * into some final document. 
     */
    public createPortableReference(resOpt: resolveOptions): CdmObjectReference {
        const cdmObjectRef: CdmObjectReferenceBase = this.ctx.corpus.MakeObject<CdmObjectReferenceBase>(CdmCorpusDefinition.mapReferenceType(this.objectType), 'portable', true) as CdmObjectReferenceBase;
        cdmObjectRef.portableReference = this;
        cdmObjectRef.inDocument = this.inDocument; // where it started life
        cdmObjectRef.owner = this.owner;

        return cdmObjectRef;
    }

    public fetchObjectDefinitionName(): string {
        // let bodyCode = () =>
        {
            return this.getName();
        }
        // return p.measure(bodyCode);
    }

    public fetchObjectDefinition<T extends CdmObjectDefinition>(resOpt?: resolveOptions): T {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }
            resOpt.fromMoniker = undefined;

            return this as unknown as T;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public visitDef(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            if (this.exhibitsTraits) {
                if (this.exhibitsTraits.visitArray(`${pathFrom}/exhibitsTraits/`, preChildren, postChildren)) {
                    return true;
                }
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public isDerivedFromDef(resOpt: resolveOptions, baseCdmObjectRef: CdmObjectReference, name: string, seek: string): boolean {
        // let bodyCode = () =>
        {
            if (seek === name) {
                return true;
            }

            const def: CdmObjectDefinition = baseCdmObjectRef ? baseCdmObjectRef.fetchObjectDefinition(resOpt) : undefined;
            if (def) {
                return def.isDerivedFrom(seek, resOpt);
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraitsDef(baseCdmObjectRef: CdmObjectReference, rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // get from base class first, then see if some are applied to base class on ref then add any traits exhibited by this def
            if (baseCdmObjectRef) {
                // merge in all from base class
                rtsb.mergeTraits(baseCdmObjectRef.fetchResolvedTraits(resOpt));
            }
            // merge in any that are exhibited by this class
            if (this.exhibitsTraits) {
                for (const et of this.exhibitsTraits) {
                    rtsb.mergeTraits(et.fetchResolvedTraits(resOpt));
                }
            }
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public getObjectPath(): string {
        // let bodyCode = () =>
        {
            return this.atCorpusPath;
        }
        // return p.measure(bodyCode);
    }

    public createSimpleReference(resOpt?: resolveOptions): CdmObjectReference {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        let name: string;
        if (this.declaredPath) {
            name = this.declaredPath;
        } else {
            name = this.getName();
        }

        const cdmObjectRef: CdmObjectReferenceBase =
            this.ctx.corpus.MakeObject<CdmObjectReferenceBase>(CdmCorpusDefinition.mapReferenceType(this.objectType), name, true);
        if (resOpt.saveResolutionsOnCopy) {
            // used to localize references between documents
            cdmObjectRef.explicitReference = this;
            cdmObjectRef.inDocument = this.inDocument;
        }

        return cdmObjectRef;
    }
}
