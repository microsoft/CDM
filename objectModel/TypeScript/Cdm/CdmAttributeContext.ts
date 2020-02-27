// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    cdmAttributeContextType,
    CdmCollection,
    CdmCorpusContext,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinitionBase,
    CdmObjectReference,
    CdmObjectReferenceBase,
    cdmObjectType,
    CdmTraitReference,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmAttributeContext extends CdmObjectDefinitionBase {
    public type: cdmAttributeContextType;
    public parent?: CdmObjectReference;
    public definition?: CdmObjectReference;
    public contents?: CdmCollection<CdmObject>;
    public get atCorpusPath(): string {
        return this._atCorpusPath;
    }
    public set atCorpusPath(val: string) {
        this._atCorpusPath = val;
    }
    public name: string;
    /**
     * @internal
     */
    public lowestOrder: number;
    private _atCorpusPath: string;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.attributeContextDef;
    }

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.attributeContextDef;
            this.name = name;
            // this will get overwritten when parent set
            this.atCorpusPath = name;
            this.contents = new CdmCollection<CdmObjectReference | CdmAttributeContext>(ctx, this, cdmObjectType.attributeRef);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public static createChildUnder(resOpt: resolveOptions, acp: AttributeContextParameters): CdmAttributeContext {
        // let bodyCode = () =>
        {
            if (!acp) {
                return undefined;
            }

            if (acp.type === cdmAttributeContextType.passThrough) {
                return acp.under;
            }

            // this flag makes sure we hold on to any resolved object refs when things get copied
            const resOptCopy: resolveOptions = CdmObjectBase.copyResolveOptions(resOpt);
            resOptCopy.saveResolutionsOnCopy = true;

            let definition: CdmObjectReference;
            let rtsApplied: ResolvedTraitSet;
            // get a simple reference to definition object to avoid getting the traits that might be part of this ref
            // included in the link to the definition.
            if (acp.regarding) {
                definition = acp.regarding.createSimpleReference(resOptCopy);
                definition.inDocument = acp.under.inDocument; // ref is in same doc as context
                // now get the traits applied at this reference (applied only, not the ones that are part of the definition of the object)
                // and make them the traits for this context
                if (acp.includeTraits) {
                    rtsApplied = acp.regarding.fetchResolvedTraits(resOptCopy);
                }
            }

            const underChild: CdmAttributeContext = acp.under.ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, acp.name);
            // need context to make this a 'live' object
            underChild.ctx = acp.under.ctx;
            underChild.inDocument = acp.under.inDocument;
            underChild.type = acp.type;
            underChild.definition = definition;
            // add traits if there are any
            if (rtsApplied && rtsApplied.set) {
                rtsApplied.set.forEach((rt: ResolvedTrait) => {
                    const traitRef: CdmTraitReference = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
                    underChild.exhibitsTraits.push(traitRef, typeof (traitRef) === 'string');
                });
            }

            // add to parent
            underChild.setParent(resOptCopy, acp.under);

            return underChild;
        }
        // return p.measure(bodyCode);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.attributeContextDef;
        }
        // return p.measure(bodyCode);
    }

    public copyNode(resOpt: resolveOptions): CdmObject {
        // let bodyCode = () =>
        {
            // instead of copying the entire context tree, just the current node
            const copy: CdmAttributeContext = new CdmAttributeContext(this.ctx, this.name);
            copy.type = this.type;
            copy.inDocument = resOpt.wrtDoc;
            if (this.definition) {
                copy.definition = this.definition.copy(resOpt) as CdmObjectReference;
            }
            copy.contents = new CdmCollection<CdmObject>(this.ctx, copy, cdmObjectType.attributeRef);

            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public copyAttributeContextTree(
        resOpt: resolveOptions,
        newNode: CdmAttributeContext,
        ras: ResolvedAttributeSet,
        attCtxSet?: Set<CdmAttributeContext>,
        moniker?: string): CdmAttributeContext {
        const ra: ResolvedAttribute = ras.attCtx2ra.get(this);
        if (ra) {
            ras.cacheAttributeContext(newNode, ra);
        }

        // add context to set
        if (attCtxSet) {
            attCtxSet.add(newNode);
        }

        // add moniker if this is a reference
        if (moniker && newNode.definition && newNode.definition.namedReference) {
            newNode.definition.namedReference = `${moniker}/${newNode.definition.namedReference}`;
        }

        // now copy the children
        for (const child of this.contents.allItems) {
            let newChild: CdmAttributeContext;
            if (child instanceof CdmAttributeContext) {
                newChild = child.copyNode(resOpt) as CdmAttributeContext;

                if (newNode) {
                    newChild.setParent(resOpt, newNode);
                }
                let currentRas: ResolvedAttributeSet = ras;
                if (ra && ra.target instanceof ResolvedAttributeSet) {
                    currentRas = ra.target;
                }
                child.copyAttributeContextTree(resOpt, newChild, currentRas, attCtxSet, moniker);
            }
        }

        return newNode;
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        let copy: CdmAttributeContext;
        if (!host) {
            copy = this.copyNode(resOpt) as CdmAttributeContext;
        } else {
            copy = host as CdmAttributeContext;
            copy.ctx = this.ctx;
            copy.name = this.getName();
            copy.contents.clear();
        }
        if (this.parent) {
            copy.parent = this.parent.copy(resOpt) as CdmObjectReference;
        }
        if (this.contents && this.contents.length > 0) {
            for (const child of this.contents.allItems) {
                copy.contents.push(child.copy(resOpt) as (CdmAttributeContext | CdmObjectReference));
            }
        }

        return copy;
    }

    public validate(): boolean {
        return this.name && this.type !== undefined;
    }

    public getName(): string {
        // let bodyCode = () =>
        {
            return this.name;
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
                    path = pathFrom + this.name;
                    this.declaredPath = path;
                }
            }

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.parent) {
                if (this.parent.visit(`${path}/parent/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.definition) {
                if (this.definition.visit(`${path}/definition/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.contents) {
                if (CdmObjectBase.visitArray(this.contents, `${path}/`, preChildren, postChildren)) {
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

    public isDerivedFrom(baseDef: string, resOpt?: resolveOptions): boolean {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this);
            }

            return false;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
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

    /**
     * @internal
     */
    public setParent(resOpt: resolveOptions, parent: CdmAttributeContext): void {
        // let bodyCode = () =>
        {
            // will need a working reference to this as the parent
            const parentRef: CdmObjectReferenceBase = this.ctx.corpus.MakeObject<CdmObjectReferenceBase>(
                cdmObjectType.attributeContextRef,
                parent.atCorpusPath,
                true);
            if (this.name) {
                this.atCorpusPath = `${parent.atCorpusPath}/${this.name}`;
            }
            parentRef.explicitReference = parent;
            // setting this will let the 'localize references' code trace from any document back to where the parent is defined
            parentRef.inDocument = parent.inDocument;
            const parentContents: CdmCollection<CdmObject> = parent.contents;
            parentContents.push(this);
            this.parent = parentRef;
        }
        // return p.measure(bodyCode);
    }
}
