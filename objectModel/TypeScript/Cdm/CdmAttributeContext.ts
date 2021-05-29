// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContextReference,
    cdmAttributeContextType,
    CdmCollection,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinitionBase,
    CdmObjectReference,
    CdmObjectReferenceBase,
    cdmObjectType,
    CdmTraitReference,
    cdmLogCode,
    Logger,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    StringUtils,
    VisitCallback
} from '../internal';

export class CdmAttributeContext extends CdmObjectDefinitionBase {
    private TAG: string = CdmAttributeContext.name;

    public type: cdmAttributeContextType;
    public parent?: CdmObjectReference;
    public definition?: CdmObjectReference;
    public contents?: CdmCollection<CdmObject>;
    public lineage?: CdmCollection<CdmAttributeContextReference>;
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
            // For attribute context we don't follow standard path calculation behavior
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
            const resOptCopy: resolveOptions = resOpt.copy();
            resOptCopy.saveResolutionsOnCopy = true;

            let definition: CdmObjectReference;
            let rtsApplied: ResolvedTraitSet;
            // get a simple reference to definition object to avoid getting the traits that might be part of this ref
            // included in the link to the definition.
            if (acp.regarding) {
                // make a portable reference. this MUST be fixed up when the context node lands in the final document
                definition = (acp.regarding as CdmObjectBase).createPortableReference(resOptCopy);
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

            if (resOptCopy.mapOldCtxToNewCtx) {
                resOptCopy.mapOldCtxToNewCtx.set(underChild, underChild); // so we can find every node, not only the replaced ones
            }

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
            if (this.parent) {
                copy.parent = new CdmAttributeContextReference(this.ctx, undefined);
                copy.parent.explicitReference = this.parent.explicitReference; // yes, just take the old pointer, will fix all later
            }

            if (this.definition) {
                copy.definition = this.definition.copy(resOpt) as CdmObjectReference;
                copy.definition.owner = this.definition.owner;
            }
            // make space for content, but no copy, done by caller
            copy.contents = new CdmCollection<CdmObject>(this.ctx, copy, cdmObjectType.attributeRef);

            if (this.lineage && this.lineage.length > 0) {
                // trying to not allocate lineage collection unless needed
                for (const child of this.lineage) {
                    copy.addLineage(child.explicitReference, false);
                }
            }

            if (resOpt.mapOldCtxToNewCtx) {
                resOpt.mapOldCtxToNewCtx.set(copy, copy); // so we can find every node, not only the replaced ones
            }

            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     * clears any existing lineage and sets it to the provided context reference (or a reference to the context object is one is given instead)
     */
    public setLineage(objLineage: CdmObject): CdmAttributeContextReference {
        this.lineage = new CdmCollection<CdmAttributeContextReference>(this.ctx, this, cdmObjectType.attributeContextRef);
        return this.addLineage(objLineage);
    }

    /**
     * @internal
     * add to the lineage array the provided context reference (or a reference to the context object is one is given instead)
     */
    public addLineage(objLineage: CdmObject, validate: boolean = true): CdmAttributeContextReference {
        // sort out which is the ref and which is the object.
        // attCtxRef object are special in that they don't support an inline definition but they do hold a pointer to the
        // actual context object in the explicit reference member
        let refLineage: CdmAttributeContextReference;
        if (objLineage.objectType === cdmObjectType.attributeContextRef) {
            refLineage = objLineage as CdmAttributeContextReference;
            objLineage = refLineage.explicitReference;
        } else if (objLineage.objectType === cdmObjectType.attributeContextDef) {
            var acLin = objLineage as CdmAttributeContext;
            refLineage = this.ctx.corpus.MakeObject<CdmAttributeContextReference>(cdmObjectType.attributeContextRef, acLin.atCorpusPath, true);
            refLineage.explicitReference = acLin;
        } else {
            // programming error
            return undefined;
        }
        if (!this.lineage) {
            // not allocated by default
            this.lineage = new CdmCollection<CdmAttributeContextReference>(this.ctx, this, cdmObjectType.attributeContextRef);
        }
        if (refLineage.explicitReference.ID === this.ID) {
            // why do that?
            return undefined;
        }
        this.lineage.push(refLineage);

        // debugging. get the parent of the context tree and validate that this node is in that tree
        // if (validate == true) {
        //     CdmAttributeContext trace = refLineage.explicitReference as CdmAttributeContext;
        //     while (trace.parent != null) {
        //         trace = trace.parent.explicitReference as CdmAttributeContext;
        //     }
        //     trace.validateLineage(null);
        // }

        return refLineage;
    }

    public static prepareOptionsForResolveAttributes(resOptSource: resolveOptions): resolveOptions {
        const resOptCopy: resolveOptions = resOptSource.copy();
        // use this whenever we need to keep references pointing at things that were already found. used when 'fixing' references by localizing to a new document
        resOptCopy.saveResolutionsOnCopy = true;
        // for debugging help
        // if (resOptCopy.mapOldCtxToNewCtx != null) {
        //     return undefined;
        // }
        resOptCopy.mapOldCtxToNewCtx = new Map<CdmAttributeContext, CdmAttributeContext>();
        return resOptCopy;
    }

    /**
     * @internal
     */
    public static getUnderContextForCacheContext(resOpt: resolveOptions, ctx: CdmCorpusContext, acpUsed: AttributeContextParameters): CdmAttributeContext {
        // a new context node is needed for these attributes, 
        // this tree will go into the cache, so we hang it off a placeholder parent
        // when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
        // put into the 'receiving' tree
        if (acpUsed) {
            const acpCache: AttributeContextParameters = {
                under: acpUsed.under,
                type: acpUsed.type,
                name: acpUsed.name,
                regarding: acpUsed.regarding,
                includeTraits: acpUsed.includeTraits
            };
            const parentCtxForCache: CdmAttributeContext = new CdmAttributeContext(ctx, "cacheHolder");
            parentCtxForCache.type = cdmAttributeContextType.passThrough;
            acpCache.under = parentCtxForCache;
            return CdmAttributeContext.createChildUnder(resOpt, acpCache);
        }
        return undefined;
    }

    /**
     * @internal
     */
    public getUnderContextFromCacheContext(resOpt: resolveOptions, acpUsed: AttributeContextParameters): CdmAttributeContext {
        // tree is found in cache, need a replacement tree node to put the sub-tree into. this replacement
        // needs to be build from the acp of the destination tree
        if (acpUsed) {
            return CdmAttributeContext.createChildUnder(resOpt, acpUsed);
        }
        return undefined;
    }

    /**
     * @internal
     */
    public associateTreeCopyWithAttributes(resOpt: resolveOptions, ras: ResolvedAttributeSet): boolean {
        // deep copy the tree. while doing this also collect a map from old attCtx to new equivalent
        // this is where the returned tree fits in
        const cachedCtx = ras.attributeContext;
        if (!cachedCtx.copyAttributeContextTree(resOpt, this)) {
            return false;
        }
        ras.attributeContext = this;

        // run over the resolved attributes in the copy and use the map to swap the old ctx for the new version
        const fixResolveAttributeCtx: (rasSub: ResolvedAttributeSet) => void
            = (rasSub: ResolvedAttributeSet): void => {
                for (const ra of rasSub.set) {
                    ra.attCtx = resOpt.mapOldCtxToNewCtx.get(ra.attCtx);
                    // the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
                    if (ra.target instanceof ResolvedAttributeSet) {
                        (ra.target as ResolvedAttributeSet).attributeContext = ra.attCtx;
                        fixResolveAttributeCtx(ra.target as ResolvedAttributeSet);
                    }
                }
            };
        fixResolveAttributeCtx(ras);

        // now fix any lineage references 
        const fixAttCtxNodeLineage: (ac: CdmAttributeContext, acParent: CdmAttributeContext) => void
            = (ac: CdmAttributeContext, acParent: CdmAttributeContext): void => {
                if (!ac) {
                    return;
                }
                if (acParent && ac.parent && ac.parent.explicitReference) {
                    ac.parent.explicitReference = acParent;
                }
                if (ac.lineage && ac.lineage.length > 0) {
                    // fix lineage
                    for (const lin of ac.lineage) {
                        if (lin.explicitReference) {
                            // swap the actual object for the one in the new tree
                            lin.explicitReference = resOpt.mapOldCtxToNewCtx.get(lin.explicitReference as CdmAttributeContext);
                        }
                    }
                }

                if (!ac.contents || ac.contents.length === 0) {
                    return;
                }
                // look at all children
                for (const subSub of ac.contents) {
                    fixAttCtxNodeLineage(subSub as CdmAttributeContext, ac);
                }
            };
        fixAttCtxNodeLineage(this, undefined);

        return true;
    }

    /**
     * @internal
     */
    public finalizeAttributeContext(resOpt: resolveOptions, pathStart: string, docHome: CdmDocumentDefinition, docFrom: CdmDocumentDefinition, monikerForDocFrom: string, finished: boolean = false): boolean {
        // run over the attCtx tree again and 'fix it' fix means replace the parent and lineage reference path strings with
        // final values from new home and set the inDocument and fix any references to definitions

        // keep track of the paths to documents for fixing symbol refs. expensive to compute
        const foundDocPaths: Map<CdmDocumentDefinition, string> = new Map<CdmDocumentDefinition, string>();

        if (monikerForDocFrom) {
            monikerForDocFrom = `${monikerForDocFrom}/`;
        }

        // first step makes sure every node in the tree has a good path for itself and a good document
        // second pass uses the paths from nodes to fix references to other nodes
        const fixAttCtxNodePaths: (subItem: CdmObject, pathFrom: string) => void
            = (subItem: CdmObject, pathFrom: string): void => {
                const ac: CdmAttributeContext = subItem as CdmAttributeContext;
                if (!ac) {
                    return;
                }
                ac.inDocument = docHome;

                // fix up the reference to defintion. need to get path from this document to the 
                // add moniker if this is a reference
                if (ac.definition) {
                    ac.definition.inDocument = docHome;

                    if (ac.definition && ac.definition.namedReference) {
                        // need the real path to this thing from the explicitRef held in the portable reference
                        // the real path is {monikerFrom/}{path from 'from' document to document holding the explicit ref/{declaredPath of explicitRef}}
                        // if we have never looked up the path between docs, do that now
                        const docFromDef: CdmDocumentDefinition = (ac.definition as CdmObjectReferenceBase).portableReference.inDocument; // if all parts not set, this is a broken portal ref!
                        let pathBetweenDocs: string = foundDocPaths.get(docFromDef);
                        if (!pathBetweenDocs) {
                            pathBetweenDocs = docFrom.importPathToDoc(docFromDef);
                            if (!pathBetweenDocs) {
                                // hmm. hmm.
                                pathBetweenDocs = '';
                            }
                            foundDocPaths.set(docFrom, pathBetweenDocs);
                        }

                        (ac.definition as CdmObjectReferenceBase).localizePortableReference(`${monikerForDocFrom}${pathBetweenDocs}`);
                    }
                }
                // doc of parent ref
                if (ac.parent) {
                    ac.parent.inDocument = docHome;
                }
                // doc of lineage refs
                if (ac.lineage && ac.lineage.length > 0) {
                    for (const lin of ac.lineage) {
                        lin.inDocument = docHome;
                    }
                }

                const divider: string = (!ac.atCorpusPath || !pathFrom.endsWith('/')) ? '/' : '';
                ac.atCorpusPath = `${pathFrom}${divider}${ac.name}`;

                if (!ac.contents || ac.contents.length === 0) {
                    return;
                }
                // look at all children
                for (const subSub of ac.contents) {
                    if (subSub.objectType === cdmObjectType.attributeContextDef) {
                        fixAttCtxNodePaths(subSub, ac.atCorpusPath);
                    }
                }
            };
        fixAttCtxNodePaths(this, pathStart);

        // now fix any lineage and parent references 
        const fixAttCtxNodeLineage: (subItem: CdmObject) => void = (subItem: CdmObject): void => {
            const ac: CdmAttributeContext = subItem as CdmAttributeContext;
            if (!ac) {
                return;
            }
            // for debugLineage, write id
            //ac.name = `${ac.name}(${ac.Id})`;

            // parent ref
            if (ac.parent && ac.parent.explicitReference) {
                ac.parent.namedReference = (ac.parent.explicitReference as CdmAttributeContext).atCorpusPath;
                // for debugLineage, write id
                //ac.parent.namedReference = `${(ac.parent.explicitReference as CdmAttributeContext).atCorpusPath}(${ac.parent.explicitReference.id})`;
            }

            // fix lineage
            if (ac.lineage && ac.lineage.length > 0) {
                for (const lin of ac.lineage) {
                    if (lin.explicitReference) {
                        // use the new path as the ref
                        lin.namedReference = (lin.explicitReference as CdmAttributeContext).atCorpusPath;
                        // for debugLineage, write id
                        //lin.namedReference = `${(lin.explicitReference as CdmAttributeContext).atCorpusPath}(${lin.explicitReference.id})`;
                    }
                }
            }

            if (!ac.contents || ac.contents.length === 0) {
                return;
            }
            // look at all children
            for (const subSub of ac.contents) {
                fixAttCtxNodeLineage(subSub);
            }
        };
        fixAttCtxNodeLineage(this);

        if (finished) {
            resOpt.saveResolutionsOnCopy = false;
            resOpt.mapOldCtxToNewCtx = undefined;
        }

        return true;
    }

    /**
     * @internal
     */
    public collectContextFromAtts(rasSub: ResolvedAttributeSet, collected: Set<CdmAttributeContext>): void {
        rasSub.set.forEach(ra => {
            const raCtx: CdmAttributeContext = ra.attCtx;
            collected.add(raCtx);

            // the target for a resolved att can be a TypeAttribute OR it can be another ResolvedAttributeSet (meaning a group)
            if (ra.target instanceof ResolvedAttributeSet) {
                // a group
                this.collectContextFromAtts(ra.target as ResolvedAttributeSet, collected);
            }
        });
    }

    /**
     * @internal
     */
    public pruneToScope(scopeSet: Set<CdmAttributeContext>): boolean {
        // run over the whole tree and make a set of the nodes that should be saved for sure. This is anything NOT under a generated set 
        // (so base entity chains, entity attributes entity definitions)

        // for testing, don't delete this
        // const countNodes = (subItem) => {
        //    if (subItem instanceof CdmAttributeContext) {
        //        return 1;
        //    }
        //    const ac: CdmAttributeContext = subItem as CdmAttributeContext;
        //    if (ac.contents === undefined || ac.contents.length === 0) {
        //        return 1;
        //    }
        //    // look at all children
        //    let total: number = 0;
        //    for (const subSub of ac.contents) {
        //        total += countNodes(subSub);
        //    }
        //    return 1 + total;
        // };
        // console.log(`Pre Prune ${countNodes(this)}`);


        // so ... the change from the old behavior is to depend on the lineage pointers to save the attribute defs
        // in the 'structure' part of the tree that might matter. keep all of the other structure info and keep some 
        // special nodes (like the ones that have removed attributes) that won't get found from lineage trace but that are
        // needed to understand what took place in resolution
        const nodesToSave = new Set<CdmAttributeContext>();

        // helper that save the passed node and anything up the parent chain 
        const saveParentNodes = (currNode: CdmAttributeContext) => {
            if (nodesToSave.has(currNode)) {
                return true;
            }
            nodesToSave.add(currNode);
            // get the parent 
            if (currNode.parent?.explicitReference) {
                return saveParentNodes(currNode.parent.explicitReference as CdmAttributeContext);
            }
            return true;
        };

        // helper that saves the current node (and parents) plus anything in the lineage (with their parents)
        const saveLineageNodes = (currNode: CdmAttributeContext) => {
            if (!saveParentNodes(currNode)) {
                return false;
            }
            if (currNode.lineage && currNode.lineage.length > 0) {
                for (const lin of currNode.lineage) {
                    if (lin.explicitReference) {
                        if (!saveLineageNodes(lin.explicitReference as CdmAttributeContext)) {
                            return false;
                        }
                    }
                }
            }
            return true;
        };


        const saveStructureNodes = (subItem: CdmObject, inGenerated: boolean, inProjection: boolean, inRemove: boolean) => {
            if (!(subItem instanceof CdmAttributeContext)) {
                return true;
            }

            const ac: CdmAttributeContext = subItem as CdmAttributeContext;
            if (ac.type === cdmAttributeContextType.generatedSet) {
                inGenerated = true; // special mode where we hate everything except the removed att notes
            }

            if (inGenerated && (ac.type === cdmAttributeContextType.operationExcludeAttributes || ac.type === cdmAttributeContextType.operationIncludeAttributes)) {
                inRemove = true; // triggers us to know what to do in the next code block.
            }
            let removedAttribute: boolean = false;
            if (ac.type == cdmAttributeContextType.attributeDefinition) {
                // empty attribute nodes are descriptions of source attributes that may or may not be needed. lineage will sort it out.
                // the exception is for attribute descriptions under a remove attributes operation. they are gone from the resolved att set, so
                // no history would remain 
                if (inRemove) {
                    removedAttribute = true;
                } else if (!ac.contents || ac.contents.length === 0) {
                    return true;
                }
            }

            if (!inGenerated || removedAttribute) {
                // mark this as something worth saving, sometimes 
                // these get discovered at the leaf of a tree that we want to mostly ignore, so can cause a
                // discontinuity in the 'save' chains, so fix that
                saveLineageNodes(ac);
            }

            if (ac.type === cdmAttributeContextType.projection) {
                inProjection = true; // track this so we can do the next thing ...
            }
            if (ac.type === cdmAttributeContextType.entity && inProjection) {
                // this is far enough, the entity that is somewhere under a projection chain
                // things under this might get saved through lineage, but down to this point will get in for sure
                return true;
            }

            if (!ac.contents|| ac.contents.length === 0) {
                return true;
            }
            // look at all children
            for (const subSub of ac.contents) {
                if (!saveStructureNodes(subSub, inGenerated, inProjection, inRemove)) {
                    return false;
                }
            }
            return true;
        };

        if (!saveStructureNodes(this, false, false, false)) {
            return false;
        }

        // next, look at the attCtx for every resolved attribute. follow the lineage chain and mark all of those nodes as ones to save
        // also mark any parents of those as savers


        // so, do that ^^^ for every primary context found earlier
        for (const primCtx of scopeSet) {
            if (!saveLineageNodes(primCtx)) {
                return false;
            }
        }

        // now the cleanup, we have a set of the nodes that should be saved
        // run over the tree and re-build the contents collection with only the things to save
        const cleanSubGroup = (subItem: CdmObject) => {
            if (subItem.objectType === cdmObjectType.attributeRef) {
                return true; // not empty
            }

            const ac: CdmAttributeContext = subItem as CdmAttributeContext;

            if (!nodesToSave.has(ac)) {
                return false; // don't even look at content, this all goes away
            }

            if (ac.contents && ac.contents.length > 0) {
                // need to clean up the content array without triggering the code that fixes in document or paths
                const newContent: CdmObject[] = [];
                for (const sub of ac.contents) {
                    // true means keep this as a child
                    if (cleanSubGroup(sub)) {
                        newContent.push(sub);
                    }
                }
                // clear the old content and replace
                ac.contents.clear();
                ac.contents.allItems.push(...newContent);
            }

            return true;
        };
        cleanSubGroup(this);

        // console.log(`Post Prune ${countNodes(this)}`);

        return true;
    }

    /**
     * @internal
     */
    public validateLineage(resOpt: resolveOptions): boolean {
        // run over the attCtx tree and validate that it is self consistent on lineage
        // collect all nodes in the tree
        const attCtxInTree: Set<CdmAttributeContext> = new Set<CdmAttributeContext>();
        const collectAllNodes: (subItem: CdmObject) => void = (subItem: CdmObject): void => {
            const ac: CdmAttributeContext = subItem as CdmAttributeContext;
            if (!ac) {
                return;
            }
            attCtxInTree.add(ac);
            if (!ac.contents || ac.contents.length === 0) {
                return;
            }
            // look at all children
            for (const subSub of ac.contents) {
                if (subSub.objectType === cdmObjectType.attributeContextDef) {
                    collectAllNodes(subSub);
                }
            }
        };
        collectAllNodes(this);

        // now make sure every lineage ref is in that set
        const checkLineage: (subItem: CdmObject) => boolean = (subItem): boolean => {
            const ac: CdmAttributeContext = subItem as CdmAttributeContext;
            if (!ac) {
                return true;
            }

            if (ac.lineage && ac.lineage.length > 0) {
                for (const lin of ac.lineage) {
                    if (!attCtxInTree.has(lin.explicitReference as CdmAttributeContext)) {
                        return false;
                    }
                    //if (!resOpt.mapOldCtxToNewCtx.has(lin.explicitReference as CdmAttributeContext)) {
                    //return false;
                    //}

                }
            }

            if (!ac.contents || ac.contents.length === 0) {
                return true;
            }
            // look at all children
            for (const subSub of ac.contents)
            {
                if (subSub.objectType === cdmObjectType.attributeContextDef) {
                    if (!checkLineage(subSub)) {
                        return false;
                    }
                }
            }
            return true;
        };
        checkLineage(this);

        return true;
    }

    /**
     * @internal
     */
    public copyAttributeContextTree(
        resOpt: resolveOptions,
        newNode: CdmAttributeContext,
        attCtxSet?: Set<CdmAttributeContext>): CdmAttributeContext {
        // remember which node in the new tree replaces which node in the old tree
        // the caller MUST use this to replace the explicit references held in the lineage and parent reference objects
        // and to change the context node that any associated resolved attributes will be pointing at
        resOpt.mapOldCtxToNewCtx.set(this, newNode) // so we can see the replacement for a copied node

        // now copy the children
        for (const child of this.contents.allItems) {
            if (child instanceof CdmAttributeContext) {

                if (newNode) {
                    const newChild: CdmAttributeContext = child.copyNode(resOpt) as CdmAttributeContext;
                    newNode.contents.allItems.push(newChild); // need to NOT trigger the collection fix up and parent code
                    child.copyAttributeContextTree(resOpt, newChild);
                }
            }
        }

        return newNode;
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
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

        if (this.lineage) {
            // trying to not allocate lineage collection unless needed
            for (const child of this.lineage) {
                copy.addLineage(child.explicitReference.copy(resOpt))
            }
        }

        return copy;
    }

    public validate(): boolean {
        const missingFields: string[] = [];
        if (!this.name) {
            missingFields.push('name');
        }
        if (this.type === undefined) {
            missingFields.push('type');
        }

        if (missingFields.length > 0) {
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, this.atCorpusPath, missingFields.map((s: string) => `'${s}'`).join(', '));

            return false;
        }

        return true;
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
            if (this.lineage) {
                if (CdmObjectBase.visitArray(this.lineage, `${path}/lineage/`, preChildren, postChildren)) {
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
