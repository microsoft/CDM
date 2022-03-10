// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    ArgumentValue,
    AttributeContextParameters,
    AttributeResolutionContext,
    AttributeResolutionDirectiveSet,
    CdmArgumentDefinition,
    CdmAttribute,
    CdmAttributeContext,
    CdmAttributeContextReference,
    cdmAttributeContextType,
    CdmAttributeGroupDefinition,
    CdmAttributeGroupReference,
    CdmAttributeItem,
    CdmAttributeReference,
    CdmAttributeResolutionGuidance,
    CdmCollection,
    CdmConstantEntityDefinition,
    CdmCorpusContext,
    cdmDataFormat,
    CdmDocumentDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    CdmObject,
    CdmObjectBase,
    CdmObjectDefinition,
    CdmObjectDefinitionBase,
    CdmObjectReference,
    CdmObjectReferenceBase,
    cdmObjectType,
    CdmProjection,
    CdmTraitCollection,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
    cdmLogCode,
    Logger,
    ProjectionContext,
    ProjectionDirective,
    resolveContext,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedAttributeSetBuilder,
    ResolvedEntity,
    ResolvedEntityReference,
    ResolvedEntityReferenceSet,
    ResolvedTrait,
    ResolvedTraitSet,
    ResolvedTraitSetBuilder,
    resolveOptions,
    StringUtils,
    TraitSpec,
    traitToPropertyMap,
    VisitCallback,
    CdmTraitReferenceBase
} from '../internal';
import { isAttributeReference, isEntityAttributeDefinition } from '../Utilities/cdmObjectTypeGuards';
import { using } from 'using-statement';
import { enterScope } from '../Utilities/Logging/Logger';

export class CdmEntityDefinition extends CdmObjectDefinitionBase {
    private TAG: string = CdmEntityDefinition.name;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.entityDef;
    }
    public get sourceName(): string {
        return this.traitToPropertyMap.fetchPropertyValue('sourceName') as string;
    }
    public set sourceName(val: string) {
        this.traitToPropertyMap.updatePropertyValue('sourceName', val);
    }
    public get description(): string {
        return this.traitToPropertyMap.fetchPropertyValue('description') as string;
    }
    public set description(val: string) {
        this.traitToPropertyMap.updatePropertyValue('description', val);
    }
    public get displayName(): string {
        return this.traitToPropertyMap.fetchPropertyValue('displayName') as string;
    }
    public set displayName(val: string) {
        this.traitToPropertyMap.updatePropertyValue('displayName', val);
    }
    public get version(): string {
        return this.traitToPropertyMap.fetchPropertyValue('version') as string;
    }
    public set version(val: string) {
        this.traitToPropertyMap.updatePropertyValue('version', val);
    }
    public get cdmSchemas(): string[] {
        return this.traitToPropertyMap.fetchPropertyValue('cdmSchemas') as string[];
    }
    public set cdmSchemas(val: string[]) {
        this.traitToPropertyMap.updatePropertyValue('cdmSchemas', val);
    }
    public get primaryKey(): string {
        return this.traitToPropertyMap.fetchPropertyValue('primaryKey') as string;
    }

    /**
     * @internal
     */
    public get isResolved(): boolean {
        return this.traitToPropertyMap.fetchPropertyValue('isResolved') as boolean;
    }

    public entityName: string;
    private _extendsEntity?: CdmEntityReference;
    get extendsEntity(): CdmEntityReference | undefined {
        return this._extendsEntity;
    }
    set extendsEntity(value: CdmEntityReference) {
        if (value) {
            value.owner = this;
        }
        this._extendsEntity = value;
    }
    public attributes: CdmCollection<CdmAttributeItem>;
    public attributeContext?: CdmAttributeContext;

    /**
     * The resolution guidance for attributes taken from the entity extended by this entity.
     * @deprecated
     * Resolution guidance is being deprecated in favor of Projections. https://docs.microsoft.com/en-us/common-data-model/sdk/convert-logical-entities-resolved-entities#projection-overview
     */
    public extendsEntityResolutionGuidance?: CdmAttributeResolutionGuidance;
    private rasb: ResolvedAttributeSetBuilder;
    private readonly traitToPropertyMap: traitToPropertyMap;
    private resolvingEntityReferences: boolean = false;

    constructor(
        ctx: CdmCorpusContext, entityName: string, extendsEntity?: CdmEntityReference) {
        super(ctx);
        // let bodyCode = () =>
        {
            this.objectType = cdmObjectType.entityDef;
            this.entityName = entityName;
            if (extendsEntity) {
                this.extendsEntity = extendsEntity;
            }

            this.attributes = new CdmCollection<CdmAttributeItem>(this.ctx, this, cdmObjectType.typeAttributeDef);
            this.traitToPropertyMap = new traitToPropertyMap(this);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public getProperty(propertyName: string): any {
        return this.traitToPropertyMap.fetchPropertyValue(propertyName, true);
    }

    public getObjectType(): cdmObjectType {
        // let bodyCode = () =>
        {
            return cdmObjectType.entityDef;
        }
        // return p.measure(bodyCode);
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmEntityDefinition {
        // let bodyCode = () =>
        {
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            let copy: CdmEntityDefinition;
            if (!host) {
                copy = new CdmEntityDefinition(this.ctx, this.entityName, undefined);
            } else {
                copy = host as CdmEntityDefinition;
                copy.entityName = this.entityName;
                copy.attributes.clear();
            }
            copy.extendsEntity = this.extendsEntity ? this.extendsEntity.copy(resOpt) as CdmEntityReference : undefined;
            copy.extendsEntityResolutionGuidance = this.extendsEntityResolutionGuidance 
                    ? this.extendsEntityResolutionGuidance.copy(resOpt) as CdmAttributeResolutionGuidance : undefined;
            copy.attributeContext = this.attributeContext ? this.attributeContext.copy(resOpt) as CdmAttributeContext : undefined;
            for (const att of this.attributes) {
                copy.attributes.push(att.copy(resOpt) as CdmAttributeItem);
            }
            this.copyDef(resOpt, copy);

            return copy;
        }
        // return p.measure(bodyCode);
    }

    public validate(): boolean {
        // let bodyCode = () =>
        {
            if (!this.entityName) {
                let missingFields: string[] = ['entityName'];
                Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, missingFields.map((s: string) => `'${s}'`).join(', '), this.atCorpusPath);
                return false;
            }

            return true;
        }
        // return p.measure(bodyCode);
    }

    public getName(): string {
        // let bodyCode = () =>
        {
            return this.entityName;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public addAttributeDef(
        attDef: CdmAttributeItem)
        : CdmAttributeItem {
        // let bodyCode = () =>
        {
            if (!this.attributes) {
                this.attributes = new CdmCollection<CdmAttributeItem>(this.ctx, this, cdmObjectType.typeAttributeDef);
            }
            this.attributes.push(attDef);

            return attDef;
        }
        // return p.measure(bodyCode);
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        // let bodyCode = () =>
        {
            const path: string = this.fetchDeclaredPath(pathFrom);

            if (preChildren && preChildren(this, path)) {
                return false;
            }
            if (this.extendsEntity && this.extendsEntity.visit(`${path}/extendsEntity/`, preChildren, postChildren)) {
                return true;
            }
            if (this.extendsEntityResolutionGuidance) {
                this.extendsEntityResolutionGuidance.owner = this;
                if (this.extendsEntityResolutionGuidance.visit(`${path}/extendsEntityResolutionGuidance/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.visitDef(path, preChildren, postChildren)) {
                return true;
            }
            if (this.attributeContext) {
                this.attributeContext.owner = this;
                if (this.attributeContext.visit(`${path}/attributeContext/`, preChildren, postChildren)) {
                    return true;
                }
            }
            if (this.attributes) {
                if (this.attributes.visitArray(`${path}/hasAttributes/`, preChildren, postChildren)) {
                    return true;
                }
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
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            return this.isDerivedFromDef(resOpt, this.extendsEntity, this.getName(), base);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedTraits(rtsb: ResolvedTraitSetBuilder, resOpt: resolveOptions): void {
        // let bodyCode = () =>
        {
            // base traits then add any elevated from attributes then add things exhibited by the att.
            const base: CdmObjectReference = this.extendsEntity;
            if (base) {
                // merge in all from base class
                rtsb.mergeTraits(base.fetchResolvedTraits(resOpt));
            }

            if (this.attributes) {
                let rtsElevated: ResolvedTraitSet = new ResolvedTraitSet(resOpt);
                for (const att of this.attributes) {
                    const rtsAtt: ResolvedTraitSet = att.fetchResolvedTraits(resOpt);
                    if (rtsAtt && rtsAtt.hasElevated) {
                        rtsElevated = rtsElevated.mergeSet(rtsAtt, true);
                    }
                }
                rtsb.mergeTraits(rtsElevated);
            }

            this.constructResolvedTraitsDef(undefined, rtsb, resOpt);
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public constructResolvedAttributes(resOpt: resolveOptions, under?: CdmAttributeContext): ResolvedAttributeSetBuilder {
        // let bodyCode = () =>
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // an extended entity, traits applied to extended entity, exhibited traits of main entity,
            // the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
            // the relationsip of the attribute, the attribute definition itself and included attribute groups,
            // any traits applied to the attribute.
            this.rasb = new ResolvedAttributeSetBuilder();
            // local var needed because we now allow reentry
            const rasb: ResolvedAttributeSetBuilder = this.rasb;
            rasb.ras.setAttributeContext(under);

            if (this.extendsEntity) {
                const extRef: CdmObjectReference = this.extendsEntity;
                let extendsRefUnder: CdmAttributeContext;
                let acpExtEnt: AttributeContextParameters;

                if (under) {
                    const acpExt: AttributeContextParameters = {
                        under: under,
                        type: cdmAttributeContextType.entityReferenceExtends,
                        name: 'extends',
                        regarding: undefined,
                        includeTraits: false
                    };
                    extendsRefUnder = rasb.ras.createAttributeContext(resOpt, acpExt);
                }

                if (extRef.explicitReference && extRef.fetchObjectDefinition<CdmObjectDefinition>(resOpt).objectType === cdmObjectType.projectionDef) {
                    // A Projection

                    const extRefObjDef: CdmObjectDefinition = extRef.fetchObjectDefinition<CdmObjectDefinition>(resOpt);
                    if (extendsRefUnder) {
                        acpExtEnt = {
                            under: extendsRefUnder,
                            type: cdmAttributeContextType.projection,
                            name: extRefObjDef.getName(),
                            regarding: extRef,
                            includeTraits: false
                        };
                    }

                    const projDirective: ProjectionDirective = new ProjectionDirective(resOpt, this, extRef);
                    const projDef: CdmProjection = extRefObjDef as CdmProjection;
                    const projCtx: ProjectionContext = projDef.constructProjectionContext(projDirective, extendsRefUnder);
                    rasb.ras = projDef.extractResolvedAttributes(projCtx, under);
                } else {
                    // An Entity Reference

                    if (extendsRefUnder) {
                        acpExtEnt = {
                            under: extendsRefUnder,
                            type: cdmAttributeContextType.entity,
                            name: extRef.namedReference ?? extRef.explicitReference.getName(),
                            regarding: extRef,
                            includeTraits: true // "Entity" is the thing with traits - That perches in the tree - And sings the tune and never waits - To see what it should be.
                        };
                    }

                    rasb.mergeAttributes(this.extendsEntity
                        .fetchResolvedAttributes(resOpt, acpExtEnt));

                    if (!resOpt.checkAttributeCount(rasb.ras.resolvedAttributeCount)) {
                        Logger.error(this.ctx, this.TAG, this.constructResolvedAttributes.name, null, cdmLogCode.ErrRelMaxResolvedAttrReached, this.entityName);
                        return undefined;
                    }

                    if (this.extendsEntityResolutionGuidance) {
                        resOpt.usedResolutionGuidance = true;

                        /**
                         * some guidance was given on how to integrate the base attributes into the set. Apply that guidance
                         */
                        const rtsBase: ResolvedTraitSet = this.fetchResolvedTraits(resOpt);
                        /**
                         * this context object holds all of the info about what needs to happen to resolve these attributes
                         * make a copy and set defaults if needed.
                         */
                        const resGuide: CdmAttributeResolutionGuidance = this.extendsEntityResolutionGuidance.copy(resOpt) as CdmAttributeResolutionGuidance;
                        resGuide.updateAttributeDefaults(resGuide.fetchObjectDefinitionName(), this);

                        /**
                         * holds all the info needed by the resolver code
                         */
                        const arc: AttributeResolutionContext = new AttributeResolutionContext(resOpt, resGuide, rtsBase);

                        rasb.generateApplierAttributes(arc, false); /** true = apply the prepared traits to new atts */
                    }
                }
            }
            rasb.markInherited();
            rasb.ras.setAttributeContext(under);

            if (this.attributes) {
                let furthestChildDepth: number = 0;

                for (const att of this.attributes) {
                    let acpAtt: AttributeContextParameters;
                    if (under) {
                        acpAtt = {
                            under: under,
                            type: cdmAttributeContextType.attributeDefinition,
                            name: att.fetchObjectDefinitionName(),
                            regarding: att,
                            includeTraits: false
                        };
                    }

                    const attRas: ResolvedAttributeSet = att.fetchResolvedAttributes(resOpt, acpAtt);

                    // we can now set depth now that children nodes have been resolved
                    if (isEntityAttributeDefinition(att)) {
                        furthestChildDepth = attRas.depthTraveled > furthestChildDepth ? attRas.depthTraveled : furthestChildDepth;
                    }
                    // before we just merge, need to handle the case of 'attribute restatement' AKA an entity with an attribute having the same name as an attribute
                    // from a base entity. thing might come out with different names, if they do, then any attributes owned by a similar named attribute before
                    // that didn't just pop out of that same named attribute now need to go away.
                    // mark any attributes formerly from this named attribute that don't show again as orphans
                    rasb.ras.markOrphansForRemoval((att as CdmAttributeItem).fetchObjectDefinitionName(), attRas);
                    // now merge
                    rasb.mergeAttributes(attRas);

                    if (!resOpt.checkAttributeCount(rasb.ras.resolvedAttributeCount)) {
                        Logger.error(this.ctx, this.TAG, this.constructResolvedAttributes.name, null, cdmLogCode.ErrRelMaxResolvedAttrReached, this.entityName);
                        return undefined;
                    }
                }

                rasb.ras.depthTraveled = furthestChildDepth;
            }

            rasb.markOrder();
            rasb.ras.setAttributeContext(under);

            // things that need to go away
            rasb.removeRequestedAtts();

            // recursively sets the target owner's to be this entity.
            // required because the replaceAsForeignKey operation uses the owner to generate the `is.linkedEntity.identifier` trait.
            rasb.ras.setTargetOwner(this);

            return rasb;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public countInheritedAttributes(resOpt: resolveOptions): number {
        // let bodyCode = () =>
        {
            // ensures that cache exits
            this.fetchResolvedAttributes(resOpt);

            return this.rasb.inheritedMark;
        }
        // return p.measure(bodyCode);
    }
    /**
     * @internal
     * @deprecated
     */
    public getResolvedEntity(resOpt: resolveOptions): ResolvedEntity {
        return new ResolvedEntity(resOpt, this);
    }

    public fetchResolvedEntityReference(resOpt?: resolveOptions): ResolvedEntityReferenceSet {
        // let bodyCode = () =>
        {
            const wasPreviouslyResolving: boolean = this.ctx.corpus.isCurrentlyResolving;
            this.ctx.corpus.isCurrentlyResolving = true;
            if (!resOpt) {
                resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
            }

            // this whole resolved entity ref goo will go away when resolved documents are done.
            // for now, it breaks if structured att sets get made.
            resOpt = resOpt.copy();
            resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly']));

            const entRefSet = new ResolvedEntityReferenceSet(resOpt);

            if (!this.resolvingEntityReferences) {
                this.resolvingEntityReferences = true;
                // get from any base class and then 'fix' those to point here instead.
                const extRef: CdmObjectReference = this.extendsEntity;
                if (extRef) {
                    let extDef: CdmEntityDefinition = extRef.fetchObjectDefinition(resOpt);
                    if (extDef) {
                        const inherited: ResolvedEntityReferenceSet = extDef.fetchResolvedEntityReference(resOpt);
                        if (inherited) {
                            inherited.set.forEach((res: ResolvedEntityReference) => {
                                res = res.copy();
                                res.referencing.entity = this;
                                entRefSet.set.push(res);
                            });
                        }
                    }
                }
                if (this.attributes) {
                    for (const attribute of this.attributes) {
                        // if any refs come back from attributes, they don't know who we are, so they don't set the entity
                        const sub: ResolvedEntityReferenceSet = attribute.fetchResolvedEntityReference(resOpt);
                        if (sub) {
                            sub.set.forEach((res: ResolvedEntityReference) => {
                                res.referencing.entity = this;
                            });

                            entRefSet.add(sub);
                        }
                    }
                }
                this.resolvingEntityReferences = false;
            }
            this.ctx.corpus.isCurrentlyResolving = wasPreviouslyResolving;

            return entRefSet;
        }
        // return p.measure(bodyCode);
    }

    /**
     * @internal
     */
    public fetchAttributesWithTraits(resOpt: resolveOptions, queryFor: TraitSpec | TraitSpec[]): ResolvedAttributeSet {
        // let bodyCode = () =>
        {
            const ras: ResolvedAttributeSet = this.fetchResolvedAttributes(resOpt);
            if (ras !== undefined) {
                return ras.fetchAttributesWithTraits(resOpt, queryFor);
            }

            return undefined;
        }
        // return p.measure(bodyCode);
    }

    // tslint:disable-next-line:no-suspicious-comment
    // TODO: refactor and split this function to be more structured.
    // tslint:disable-next-line:max-func-body-length
    public async createResolvedEntityAsync(
        newEntName: string,
        resOpt?: resolveOptions,
        folder?: CdmFolderDefinition,
        newDocName?: string): Promise<CdmEntityDefinition> {
        // let bodyCode = () =>
        {
            return await using(enterScope(CdmEntityDefinition.name, this.ctx, this.createResolvedEntityAsync.name), async _ => {
                if (!resOpt) {
                    resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
                }

                // if the wrtDoc needs to be indexed (like it was just modified) then do that first
                if (!resOpt.wrtDoc) {
                    Logger.error(this.ctx, this.TAG, this.createResolvedEntityAsync.name, null, cdmLogCode.ErrDocWrtDocNotfound);
                    return undefined;
                }

                if (!newEntName || newEntName === '') {
                    Logger.error(this.ctx, this.TAG, this.createResolvedEntityAsync.name, null, cdmLogCode.ErrResolveNewEntityNameNotSet);
                    return undefined;
                }

                // if the wrtDoc needs to be indexed (like it was just modified) then do that first
                if (!await resOpt.wrtDoc.indexIfNeeded(resOpt, true)) {
                    Logger.error(this.ctx, this.TAG, this.createResolvedEntityAsync.name, null, cdmLogCode.ErrIndexFailed);
                    return undefined;
                }

                if (!folder) {
                    folder = this.inDocument.owner as CdmFolderDefinition;
                }

                const fileName: string = (newDocName === undefined || newDocName === '') ? `${newEntName}.cdm.json` : newDocName;
                let origDoc: string = this.inDocument.atCorpusPath;

                // Don't overwite the source document
                const targetAtCorpusPath: string =
                    `${this.ctx.corpus.storage.createAbsoluteCorpusPath(folder.atCorpusPath, folder)}${fileName}`;
                if (StringUtils.equalsWithIgnoreCase(targetAtCorpusPath, origDoc)) {
                    Logger.error(this.ctx, this.TAG, this.createResolvedEntityAsync.name, null, cdmLogCode.ErrDocEntityReplacementFailure, targetAtCorpusPath);
                    return undefined;
                }

                // make sure the corpus has a set of default artifact attributes 
                await this.ctx.corpus.prepareArtifactAttributesAsync();

                // make the top level attribute context for this entity
                // for this whole section where we generate the attribute context tree and get resolved attributes
                // set the flag that keeps all of the parent changes and document dirty from from happening
                const wasResolving: boolean = this.ctx.corpus.isCurrentlyResolving;
                this.ctx.corpus.isCurrentlyResolving = true;
                const entName: string = newEntName;
                const ctx: resolveContext = this.ctx as resolveContext;
                let attCtxEnt: CdmAttributeContext = ctx.corpus.MakeObject(cdmObjectType.attributeContextDef, entName, true);
                attCtxEnt.ctx = ctx;
                attCtxEnt.inDocument = this.inDocument;

                // cheating a bit to put the paths in the right place
                const acp: AttributeContextParameters = {
                    under: attCtxEnt,
                    type: cdmAttributeContextType.attributeGroup,
                    name: 'attributeContext'
                };
                const attCtxAC: CdmAttributeContext = CdmAttributeContext.createChildUnder(resOpt, acp);
                // this is the node that actually is first in the context we save. all definition refs should take the new perspective that they
                // can only be understood through the resolvedFrom moniker
                const entRefThis: CdmEntityReference = ctx.corpus.MakeObject<CdmEntityReference>(cdmObjectType.entityRef, this.getName(), true);
                entRefThis.owner = this;
                entRefThis.inDocument = this.inDocument; // need to set owner and inDocument to this starting entity so the ref will be portable to the new document
                const prevOwner: CdmObject = this.owner;
                entRefThis.explicitReference = this;
                // we don't want to change the owner of this entity to the entity reference
                // re-assign whatever was there before
                this.owner = prevOwner;
                const acpEnt: AttributeContextParameters = {
                    under: attCtxAC,
                    type: cdmAttributeContextType.entity,
                    name: entName,
                    regarding: entRefThis
                };

                // reset previous depth information in case there are left overs
                resOpt.depthInfo.reset();

                // use this whenever we need to keep references pointing at things that were already found.
                // used when 'fixing' references by localizing to a new document
                const resOptCopy: resolveOptions = CdmAttributeContext.prepareOptionsForResolveAttributes(resOpt);

                // resolve attributes with this context. the end result is that each resolved attribute
                // points to the level of the context where it was last modified, merged, created
                const ras: ResolvedAttributeSet = this.fetchResolvedAttributes(resOptCopy, acpEnt);

                if (resOptCopy.usedResolutionGuidance) {
                    Logger.warning(ctx, this.TAG, this.createResolvedEntityAsync.name, this.atCorpusPath, cdmLogCode.WarnDeprecatedResolutionGuidance);
                }

                if (ras === undefined) {
                    return undefined;
                }

                this.ctx.corpus.isCurrentlyResolving = wasResolving;

                // make a new document in given folder if provided or the same folder as the source entity
                folder.documents.remove(fileName);
                const docRes: CdmDocumentDefinition = folder.documents.push(fileName);
                // add an import of the source document
                origDoc = this.ctx.corpus.storage.createRelativeCorpusPath(origDoc, docRes); // just in case we missed the prefix
                docRes.imports.push(origDoc, 'resolvedFrom');

                if (this.inDocument.imports.item('cdm:/foundations.cdm.json') !== undefined) {
                    docRes.imports.push('cdm:/foundations.cdm.json');
                }

                docRes.documentVersion = this.inDocument.documentVersion;

                // make the empty entity
                let entResolved: CdmEntityDefinition = docRes.definitions.push(entName) as CdmEntityDefinition;

                // grab that context that comes from fetchResolvedAttributes. We are sure this tree is a copy that we can own, so no need to copy it again
                let attCtx: CdmAttributeContext;
                if (attCtxAC && attCtxAC.contents && attCtxAC.contents.length === 1) {
                    attCtx = attCtxAC.contents.allItems[0] as CdmAttributeContext;
                }
                entResolved.attributeContext = attCtx;

                if (attCtx) {
                    // fix all of the definition references, parent and lineage references, owner documents, etc. in the context tree
                    attCtx.finalizeAttributeContext(resOptCopy, `${entName}/attributeContext/`, docRes, this.inDocument, 'resolvedFrom', true);

                    // TEST CODE
                    // run over the resolved attributes and make sure none have the dummy context
                    //testResolveAttributeCtx = (rasSub) =>
                    // const testResolveAttributeCtx: (rasSub: ResolvedAttributeSet) => void
                    //   = (rasSub: ResolvedAttributeSet): void => {
                    //    if (rasSub.set.size !== 0 && rasSub.attributeContext.atCoprusPath.startsWith('cacheHolder')) {
                    //      console.log('Bad');
                    //    }
                    //    for (const ra of rasSub.set) {
                    //        if (ra.AttCtx.AtCoprusPath.StartsWith("cacheHolder")) {
                    //          console.log('Bad');
                    //        }
                    //        // the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
                    //        if (ra.target instanceof ResolvedAttributeSet)
                    //        {
                    //            testResolveAttributeCtx(ra.target as ResolvedAttributeSet);
                    //        }
                    //    }
                    //}
                    //testResolveAttributeCtx(ras);
                }

                // add the traits of the entit, also add to attribute context top node
                const rtsEnt: ResolvedTraitSet = this.fetchResolvedTraits(resOpt);
                rtsEnt.set.forEach((rt: ResolvedTrait) => {
                    let traitRef: CdmTraitReference = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
                    (entResolved as CdmObjectDefinition).exhibitsTraits.push(traitRef);
                    traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt); // fresh copy
                    if (entResolved.attributeContext) {
                        entResolved.attributeContext.exhibitsTraits.push(traitRef);
                    }
                });

                // special trait to explain this is a resolved entity
                entResolved.indicateAbstractionLevel('resolved', resOpt);

                if (entResolved.attributeContext) {
                    // the attributes have been named, shaped, etc for this entity so now it is safe to go and
                    // make each attribute context level point at these final versions of attributes

                    // what we have is a resolved attribute set (maybe with structure) where each ra points at the best tree node
                    // we also have the tree of context, we need to flip this around so that the right tree nodes point at the paths to the
                    // right attributes. so run over the resolved atts and then add a path reference to each one into the context contents where is last lived
                    const attPath2Order: Map<string, number> = new Map<string, number>();
                    const finishedGroups: Set<string> = new Set<string>();
                    const allPrimaryCtx: Set<CdmAttributeContext> = new Set<CdmAttributeContext>(); // keep a list so it is easier to think about these later
                    const pointContextAtResolvedAtts: (rasSub: ResolvedAttributeSet, path: string) => void
                        = (rasSub: ResolvedAttributeSet, path: string): void => {
                            for (const ra of rasSub.set) {
                                const raCtx: CdmAttributeContext = ra.attCtx;
                                const refs = raCtx.contents;
                                allPrimaryCtx.add(raCtx);

                                let attRefPath: string = `${path}${ra.resolvedName}`;
                                // the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
                                const target: CdmAttribute = ra.target as CdmAttribute;
                                if (target && target.objectType) {
                                    // it was an attribute, add to the content of the context, also, keep track of the ordering for all of the att paths we make up
                                    // as we go through the resolved attributes, this is the order of atts in the final resolved entity
                                    if (!attPath2Order.has(attRefPath)) {
                                        var attRef = this.ctx.corpus.MakeObject<CdmObjectReferenceBase>(cdmObjectType.attributeRef, attRefPath, true);
                                        // only need one explanation for this path to the insert order
                                        attPath2Order.set(attRef.namedReference, ra.insertOrder);
                                        raCtx.contents.push(attRef);
                                    }
                                }
                                else {
                                    // a group, so we know an attribute group will get created later with the name of the group and the things it contains will be in
                                    // the members of that group
                                    attRefPath = `${attRefPath}/members/`;
                                    if (!finishedGroups.has(attRefPath)) {
                                        pointContextAtResolvedAtts(ra.target as ResolvedAttributeSet, attRefPath);
                                        finishedGroups.add(attRefPath);
                                    }
                                }
                            }
                        };

                    pointContextAtResolvedAtts(ras, `${entName}/hasAttributes/`);

                    // the generated attribute structures sometimes has a LOT of extra nodes that don't say anything or explain anything
                    // our goal now is to prune that tree to just have the stuff one may need
                    // do this by keeping the leafs and all of the lineage nodes for the attributes that end up in the resolved entity
                    // along with some special nodes that explain entity structure and inherit

                    if (!attCtx.pruneToScope(allPrimaryCtx)) {
                        // TODO: log error
                        return undefined;
                    }

                    // create an all-up ordering of attributes at the leaves of this tree based on insert order
                    // sort the attributes in each context by their creation order and mix that with the other sub-contexts that have been sorted
                    let getOrderNum: (item: CdmObject) => number;

                    const orderContents: (under: CdmAttributeContext) => number
                        = (under: CdmAttributeContext): number => {
                            if (under.lowestOrder === undefined) {
                                under.lowestOrder = -1; // used for group with nothing but traits
                                if (under.contents.length === 1) {
                                    under.lowestOrder = getOrderNum(under.contents.allItems[0]);
                                } else {
                                    under.contents.allItems = under.contents.allItems.sort((l: CdmObject, r: CdmObject): number => {
                                        const lNum: number = getOrderNum(l);
                                        const rNum: number = getOrderNum(r);

                                        if (lNum !== -1 && (under.lowestOrder === -1 || lNum < under.lowestOrder)) {
                                            under.lowestOrder = lNum;
                                        }
                                        if (rNum !== -1 && (under.lowestOrder === -1 || rNum < under.lowestOrder)) {
                                            under.lowestOrder = rNum;
                                        }

                                        return lNum - rNum;
                                    });
                                }
                            }

                            return under.lowestOrder;
                        };

                    getOrderNum = (item: CdmObject): number => {
                        if (item.getObjectType() === cdmObjectType.attributeContextDef) {
                            return orderContents(item as CdmAttributeContext);
                        } else if (isAttributeReference(item)) {
                            return attPath2Order.get(item.namedReference);
                        } else {
                            return -1; // put the mystery item on top.
                        }
                    };
                    orderContents(attCtx);

                    // resolved attributes can gain traits that are applied to an entity when referenced
                    // since these traits are described in the context, it is redundant and messy to list them in the attribute
                    // so, remove them. create and cache a set of names to look for per context
                    // there is actually a hierarchy to all attributes from the base entity should have all traits applied independently of the
                    // sub-context they come from. Same is true of attribute entities. so do this recursively top down
                    const ctx2traitNames: Map<CdmAttributeContext, Set<string>> = new Map<CdmAttributeContext, Set<string>>();
                    const collectContextTraits: (subAttCtx: CdmAttributeContext, inheritedTraitNames: Set<string>) => void
                        = (subAttCtx: CdmAttributeContext, inheritedTraitNames: Set<string>): void => {
                            const traitNamesHere: Set<string> = new Set<string>(inheritedTraitNames);
                            const traitsHere: CdmTraitCollection = subAttCtx.exhibitsTraits;
                            if (traitsHere) {
                                traitsHere.allItems.forEach((tat: CdmTraitReference) => { traitNamesHere.add(tat.namedReference); });
                            }
                            ctx2traitNames.set(subAttCtx, traitNamesHere);
                            for (const cr of subAttCtx.contents.allItems) {
                                if (cr.getObjectType() === cdmObjectType.attributeContextDef) {
                                    // do this for all types?
                                    collectContextTraits(cr as CdmAttributeContext, traitNamesHere);
                                }
                            }
                        };
                    collectContextTraits(attCtx, new Set<string>());

                    // add the attributes, put them in attribute groups if structure needed
                    const resAtt2RefPath: Map<ResolvedAttribute, string> = new Map<ResolvedAttribute, string>();
                    const addAttributes: (rasSub: ResolvedAttributeSet, container: CdmEntityDefinition | CdmAttributeGroupDefinition, path: string) => void
                        = (rasSub: ResolvedAttributeSet, container: CdmEntityDefinition | CdmAttributeGroupDefinition, path: string): void => {

                            for (const ra of rasSub.set) {
                                const attPath: string = `${path}${ra.resolvedName}`;
                                // use the path of the context associated with this attribute to find the new context that matches on path
                                const raCtx: CdmAttributeContext = ra.attCtx;

                                if (ra.target instanceof ResolvedAttributeSet) {
                                    // this is a set of attributes.
                                    // make an attribute group to hold them
                                    const attGrp: CdmAttributeGroupDefinition = this.ctx.corpus.MakeObject<CdmAttributeGroupDefinition>(cdmObjectType.attributeGroupDef, ra.resolvedName, false);
                                    attGrp.attributeContext = this.ctx.corpus.MakeObject<CdmAttributeContextReference>(cdmObjectType.attributeContextRef, raCtx.atCorpusPath, true);
                                    // debugLineage
                                    //attGrp.AttributeContext.NamedReference = $"{ raCtx.AtCoprusPath}({raCtx.Id})";

                                    // take any traits from the set and make them look like traits exhibited by the group
                                    const avoidSet: Set<string> = ctx2traitNames.get(raCtx);
                                    // traits with the same name can show up on entities and attributes AND have different meanings.
                                    avoidSet.clear();

                                    const rtsAtt: ResolvedTraitSet = ra.resolvedTraits;
                                    for (const rt of rtsAtt.set) {
                                        if (!rt.trait.ugly) {
                                            // don't mention your ugly traits
                                            if (avoidSet && !avoidSet.has(rt.traitName)) {
                                                // avoid the ones from the context
                                                const traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
                                                (attGrp as CdmObjectDefinitionBase).exhibitsTraits.push(traitRef);
                                            }
                                        }
                                    }

                                    // wrap it in a reference and then recurse with this as the new container
                                    const attGrpRef: CdmAttributeGroupReference = this.ctx.corpus.MakeObject<CdmAttributeGroupReference>(cdmObjectType.attributeGroupRef, undefined, false);
                                    attGrpRef.explicitReference = attGrp;
                                    container.addAttributeDef(attGrpRef);
                                    // isn't this where ...
                                    addAttributes(ra.target as ResolvedAttributeSet, attGrp, `${attPath}/members/`);
                                }
                                else {
                                    const att: CdmTypeAttributeDefinition = this.ctx.corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, ra.resolvedName, false);
                                    att.attributeContext = this.ctx.corpus.MakeObject<CdmAttributeContextReference>(cdmObjectType.attributeContextRef, raCtx.atCorpusPath, true);
                                    // debugLineage
                                    //att.attributeContext.namedReference = `${raCtx.atCorpusPath}(${raCtx.id})";

                                    const avoidSet: Set<string> = ctx2traitNames.get(raCtx);
                                    // i don't know why i thought this was the right thing to do,
                                    // traits with the same name can show up on entities and attributes AND have different meanings.
                                    avoidSet.clear();
                                    // i really need to figure out the effects of this before making this change
                                    // without it, some traits don't make it to the resolved entity
                                    // with it, too many traits might make it there

                                    const rtsAtt: ResolvedTraitSet = ra.resolvedTraits;
                                    for (const rt of rtsAtt.set) {
                                        if (!rt.trait.ugly) { // don't mention your ugly traits
                                            if (avoidSet && !avoidSet.has(rt.traitName)) { // avoid the ones from the context
                                                const traitRef = CdmObjectBase.resolvedTraitToTraitRef(resOptCopy, rt);
                                                (att as CdmTypeAttributeDefinition).appliedTraits.push(traitRef);

                                                // the trait that points at other entities for foreign keys, that is trouble
                                                // the string value in the table needs to be a relative path from the document of this entity
                                                // to the document of the related entity. but, right now it is a relative path to the source entity
                                                // so find those traits, and adjust the paths in the tables they hold
                                                if (rt.traitName === 'is.linkedEntity.identifier') {
                                                    // grab the content of the table from the new ref (should be a copy of orig) 
                                                    let linkTable: string[][];
                                                    if (traitRef.arguments && traitRef.arguments.length > 0) {
                                                        if (traitRef.arguments) {
                                                            const argValue: CdmEntityReference = traitRef.arguments.allItems[0].value as CdmEntityReference;
                                                            if (argValue) {
                                                                const expRef: CdmConstantEntityDefinition = argValue.explicitReference as CdmConstantEntityDefinition;
                                                                if (expRef) {
                                                                    linkTable = expRef.constantValues;
                                                                }
                                                            }
                                                        }
                                                    }
                                                    if (linkTable && linkTable.length > 0) {
                                                        for (const row of linkTable) {
                                                            if (row.length === 2 || row.length === 3) // either the old table or the new one with relationship name can be there
                                                            {
                                                                // entity path an attribute name
                                                                let fixedPath: string = row[0];
                                                                fixedPath = this.ctx.corpus.storage.createAbsoluteCorpusPath(fixedPath, this.inDocument); // absolute from relative to this
                                                                fixedPath = this.ctx.corpus.storage.createRelativeCorpusPath(fixedPath, docRes); // realtive to new entity
                                                                row[0] = fixedPath;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }

                                    // none of the dataformat traits have the bit set that will make them turn into a property
                                    // this is intentional so that the format traits make it into the resolved object
                                    // but, we still want a guess as the data format, so get it and set it.
                                    const impliedDataFormat: cdmDataFormat = att.dataFormat;
                                    if (impliedDataFormat !== cdmDataFormat.unknown) {
                                        att.dataFormat = impliedDataFormat;
                                    }

                                    container.addAttributeDef(att);
                                    resAtt2RefPath.set(ra, attPath);
                                }
                            }
                        }
                    addAttributes(ras, entResolved, `${entName}/hasAttributes/`);

                    // any resolved traits that hold arguments with attribute refs should get 'fixed' here
                    const replaceTraitAttRef: (tr: CdmTraitReference, entityHint: string, isAttributeContext: boolean) => void
                        = (tr: CdmTraitReference, entityHint: string): void => {
                            if (tr.arguments) {
                                for (const arg of tr.arguments.allItems) {
                                    const v: ArgumentValue =
                                        arg.unresolvedValue ? arg.unresolvedValue : arg.getValue();
                                    // is this an attribute reference?
                                    if (v
                                        && (v as CdmObject).getObjectType
                                        && (v as CdmObject).getObjectType() === cdmObjectType.attributeRef) {
                                        // only try this if the reference has no path to it (only happens with intra-entity att refs)
                                        const attRef: CdmAttributeReference = v as CdmAttributeReference;
                                        if (attRef.namedReference && attRef.namedReference.indexOf('/') === -1) {
                                            if (!arg.unresolvedValue) {
                                                arg.unresolvedValue = arg.value;
                                            }
                                            // give a promise that can be worked out later.
                                            // assumption is that the attribute must come from this entity.
                                            const newAttRef: CdmAttributeReference = this.ctx.corpus.MakeObject(
                                                cdmObjectType.attributeRef,
                                                `${entityHint}/(resolvedAttributes)/${attRef.namedReference}`,
                                                true);
                                            // inDocument is not propagated during resolution, so set it here
                                            newAttRef.inDocument = arg.inDocument;
                                            arg.setValue(newAttRef);
                                        }
                                    }

                                }
                            }
                        };

                    // fix entity traits
                    if (entResolved.exhibitsTraits) {
                        entResolved.exhibitsTraits.allItems
                            .forEach((et: CdmTraitReferenceBase) => {
                                if (et instanceof CdmTraitReference) {
                                    replaceTraitAttRef(et, newEntName, false);
                                }
                            });
                    }

                    // fix context traits
                    const fixContextTraits: (subAttCtx: CdmAttributeContext, entityHint: string) => void
                        = (subAttCtx: CdmAttributeContext, entityHint: string): void => {
                            const traitsHere: CdmTraitCollection = subAttCtx.exhibitsTraits;
                            if (traitsHere) {
                                traitsHere.allItems.forEach((tr: CdmTraitReferenceBase) => {
                                    if (tr instanceof CdmTraitReference) {
                                        replaceTraitAttRef(tr, entityHint, true);
                                    }
                                });
                            }
                            for (const cr of subAttCtx.contents.allItems) {
                                if (cr.getObjectType() === cdmObjectType.attributeContextDef) {
                                    // if this is a new entity context, get the name to pass along
                                    const subSubAttCtx: CdmAttributeContext = cr as CdmAttributeContext;
                                    let subEntityHint: string = entityHint;
                                    if (subSubAttCtx.type === cdmAttributeContextType.entity && subSubAttCtx.definition) {
                                        subEntityHint = subSubAttCtx.definition.namedReference;
                                    }
                                    // do this for all types
                                    fixContextTraits(subSubAttCtx, subEntityHint);
                                }
                            }
                        };
                    fixContextTraits(attCtx, newEntName);
                    // and the attribute traits
                    const entAtts: CdmCollection<CdmAttributeItem> = entResolved.attributes;
                    if (entAtts) {
                        for (const attribute of entAtts.allItems) {
                            const attTraits: CdmTraitCollection = attribute.appliedTraits;
                            if (attTraits) {
                                attTraits.allItems.forEach((tr: CdmTraitReference) => {
                                    if (tr instanceof CdmTraitReference) {
                                        replaceTraitAttRef(tr, newEntName, false);
                                    }
                                });
                            }
                        }
                    }
                }

                // we are about to put this content created in the context of various documents (like references to attributes from base entities, etc.)
                // into one specific document. all of the borrowed refs need to work. so, re-write all string references to work from this new document
                // the catch-22 is that the new document needs these fixes done before it can be used to make these fixes.
                // the fix needs to happen in the middle of the refresh
                // trigger the document to refresh current content into the resolved OM
                if (attCtx) {
                    attCtx.parent = undefined; // remove the fake parent that made the paths work
                }
                const resOptNew: resolveOptions = resOpt.copy();
                resOptNew.localizeReferencesFor = docRes;
                resOptNew.wrtDoc = docRes;
                if (!await docRes.refreshAsync(resOptNew)) {
                    Logger.error(this.ctx, this.TAG, this.createResolvedEntityAsync.name, null, cdmLogCode.ErrIndexFailed);
                    return undefined;
                }
                // get a fresh ref
                entResolved = docRes.fetchObjectFromDocumentPath(entName, resOptNew) as CdmEntityDefinition;

                this.ctx.corpus.resEntMap.set(this.atCorpusPath, entResolved.atCorpusPath);

                return entResolved;
            });
        }
        // return p.measure(bodyCode);
    }

    /**
     * creates or sets the has.entitySchemaAbstractionLevel trait to logical, composition, resolved or unknown
     * todo: consider making this public API
     */
    private indicateAbstractionLevel(level: string, resOpt: resolveOptions): void {
        // see if entitySchemaAbstractionLevel is a known trait to this entity
        if (resOpt && !this.ctx.corpus.resolveSymbolReference(resOpt, this.inDocument, 'has.entitySchemaAbstractionLevel', cdmObjectType.traitDef, false)) {
            return;
        }

        // get or add the trait
        let traitRef: CdmTraitReference = this.exhibitsTraits.item('has.entitySchemaAbstractionLevel') as CdmTraitReference;
        if (!traitRef) {
            traitRef = new CdmTraitReference(this.ctx, 'has.entitySchemaAbstractionLevel', false, true);
            this.exhibitsTraits.push(traitRef);
        }
        // get or add the one argument
        let argDef: CdmArgumentDefinition;
        if (traitRef.arguments && traitRef.arguments.length === 1) {
            argDef = traitRef.arguments.allItems[0];
        }
        else {
            argDef = new CdmArgumentDefinition(this.ctx, 'level');
            traitRef.arguments.push(argDef);
        }
        // set it
        argDef.value = level;
    }

    /**
     * Query the entity for a set of attributes that match an input query
     * querySpec = a JSON object (or a string that can be parsed into one) of the form
     * {"attributeName":"", "attributeOrdinal": -1, "traits":[see next]}
     * matched attributes have each of the traits in the array
     * the trait object is specified as
     * {"traitName": queried trait name or base trait name, (optional) "arguments":[{"argumentName": queried argument, "value": queried value}]}
     * null for 0 results or an array of json objects, each matching the shape of the input query, with attribute names filled in
     */
    private async queryOnTraits(querySpec: (string | object)): Promise<object[]> {
        return undefined;
    }
}
