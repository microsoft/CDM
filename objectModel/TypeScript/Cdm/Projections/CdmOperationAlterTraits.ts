// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttribute,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCollection,
    CdmCorpusContext,
    cdmLogCode,
    CdmObject,
    CdmObjectBase,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    CdmTraitReference,
    CdmTraitReferenceBase,
    Logger,
    ParameterValueSet,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionResolutionCommonUtil,
    ResolvedAttribute,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    traitProfileCache,
    VisitCallback
} from '../../internal';

/**
 * Class to handle AlterTraits operations
 */
export class CdmOperationAlterTraits extends CdmOperationBase {
    private TAG: string = CdmOperationAlterTraits.name;
    // this cache is for all the traits we might get profiles about. because once is enough
    private profCache: traitProfileCache = new traitProfileCache();

    public traitsToAdd: CdmCollection<CdmTraitReferenceBase>;
    public traitsToRemove: CdmCollection<CdmTraitReferenceBase>;
    public argumentsContainWildcards?: boolean;
    public applyTo: string[];
    public applyToTraits: string[];

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationAlterTraitsDef;
        this.type = cdmOperationType.alterTraits;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        const copy: CdmOperationAlterTraits = !host ? new CdmOperationAlterTraits(this.ctx) : host as CdmOperationAlterTraits;

        if (this.traitsToAdd && this.traitsToAdd.length > 0) {
            for (const trait of this.traitsToAdd) {
                copy.traitsToAdd.push(trait.copy() as CdmTraitReferenceBase);
            }
        }

        if (this.traitsToRemove && this.traitsToRemove.length > 0) {
            for (const trait of this.traitsToRemove) {
                copy.traitsToRemove.push(trait.copy() as CdmTraitReferenceBase);
            }
        }

        copy.applyTo = this.applyTo ? this.applyTo.slice() : undefined;
        copy.applyToTraits = this.applyToTraits ? this.applyToTraits.slice() : undefined;
        copy.argumentsContainWildcards = this.argumentsContainWildcards;

        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationAlterTraits';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationAlterTraitsDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.traitsToAdd && !this.traitsToRemove) {
            missingFields.push('traitsToAdd');
            missingFields.push('traitsToRemove');
        }

        if (missingFields.length > 0) {
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, this.atCorpusPath, missingFields.map((s: string) => `'${s}'`).join(', '));
            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        const path = this.fetchDeclaredPath(pathFrom);

        if (preChildren && preChildren(this, path)) {
            return false;
        }

        if (this.traitsToAdd !== undefined && CdmObjectBase.visitArray(this.traitsToAdd, `${path}/traitsToAdd/`, preChildren, postChildren)) {
            return true;
        }

        if (this.traitsToRemove !== undefined && CdmObjectBase.visitArray(this.traitsToRemove, `${path}/traitsToRemove/`, preChildren, postChildren)) {
            return true;
        }

        if (postChildren && postChildren(this, path)) {
            return true;
        }

        return false;
    }

    /**
     * @inheritdoc
     * @internal
     */
    public appendProjectionAttributeState(projCtx: ProjectionContext, projOutputSet: ProjectionAttributeStateSet, attrCtx: CdmAttributeContext): ProjectionAttributeStateSet {
        // Create a new attribute context for the operation
        const attrCtxOpAlterTraitsParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationAlterTraits,
            name: `operation/index${this.index}/${this.getName()}`
        };
        const attrCtxOpAlterTraits: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpAlterTraitsParam);

        // Get the top-level attribute names of the selected attributes to apply
        // We use the top-level names because the applyTo list may contain a previous name our current resolved attributes had
        const topLevelSelectedAttributeNames: Map<string, string> = this.applyTo !== undefined ? ProjectionResolutionCommonUtil.getTopList(projCtx, this.applyTo) : undefined;

        // if set, make a hashset of trait names that need to be removed
        const traitNamesToRemove = new Set<string>();
        if (this.traitsToRemove !== undefined) {
            for (const traitRef of this.traitsToRemove) {
                // resolve this because it could be a traitgroup name and turn into many other traits
                const resolvedTraitSet: ResolvedTraitSet = traitRef.fetchResolvedTraits(projCtx.projectionDirective.resOpt);
                resolvedTraitSet.set.forEach(rt => traitNamesToRemove.add(rt.traitName));
            }
        }

        // if set, make a hashset from the applyToTraits for fast lookup later
        let applyToTraitNames: Set<string> = undefined;
        if (this.applyToTraits !== undefined) {
            applyToTraitNames = new Set<string>(this.applyToTraits.slice());
        }

        // Iterate through all the projection attribute states generated from the source's resolved attributes
        // Each projection attribute state contains a resolved attribute that it is corresponding to
        for (const currentPAS of projCtx.currentAttributeStateSet.states) {
            // Check if the current projection attribute state's resolved attribute is in the list of selected attributes
            // If this attribute is not in the list, then we are including it in the output without changes
            if (topLevelSelectedAttributeNames === undefined || topLevelSelectedAttributeNames.has(currentPAS.currentResolvedAttribute.resolvedName)) {
                // Create a new attribute context for the new artifact attribute we will create
                const attrCtxNewAttrParam: AttributeContextParameters = {
                    under: attrCtxOpAlterTraits,
                    type: cdmAttributeContextType.attributeDefinition,
                    name: currentPAS.currentResolvedAttribute.resolvedName
                };
                const attrCtxNewAttr: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxNewAttrParam);
                let newResAttr: ResolvedAttribute = undefined;

                if (currentPAS.currentResolvedAttribute.target instanceof ResolvedAttributeSet) {
                    // Attribute group
                    // Create a copy of resolved attribute set 
                    const resAttrNewCopy: ResolvedAttributeSet = currentPAS.currentResolvedAttribute.target.copy();
                    newResAttr = new ResolvedAttribute(projCtx.projectionDirective.resOpt, resAttrNewCopy, currentPAS.currentResolvedAttribute.resolvedName, attrCtxNewAttr);

                    // the resolved attribute group obtained from previous projection operation may have a different set of traits comparing to the resolved attribute target. 
                    // We would want to take the set of traits from the resolved attribute.
                    newResAttr.resolvedTraits = currentPAS.currentResolvedAttribute.resolvedTraits.deepCopy();
                } else if (currentPAS.currentResolvedAttribute.target instanceof CdmAttribute) {
                    // Entity Attribute or Type Attribute
                    newResAttr = CdmOperationBase.createNewResolvedAttribute(projCtx, attrCtxNewAttr, currentPAS.currentResolvedAttribute, currentPAS.currentResolvedAttribute.resolvedName);
                } else {
                    Logger.warning(this.ctx, this.TAG, this.appendProjectionAttributeState.name, this.atCorpusPath, cdmLogCode.ErrProjUnsupportedSource, typeof currentPAS.currentResolvedAttribute.target, this.getName());
                    projOutputSet.add(currentPAS)
                    break;
                }

                const newTraits = this.resolvedNewTraits(projCtx, currentPAS);
                // if the applyToTraits property was set, then these traits apply to the traits of the selected attributes, else to the attribute directly
                if (applyToTraitNames === undefined) {
                    // alter traits of atts
                    newResAttr.resolvedTraits = newResAttr.resolvedTraits.mergeSet(newTraits);
                    // remove if requested
                    if (traitNamesToRemove !== undefined) {
                        traitNamesToRemove.forEach(traitName => newResAttr.resolvedTraits.remove(projCtx.projectionDirective.resOpt, traitName));
                    }
                } else {
                    // alter traits of traits of atts
                    // for every current resolved trait on this attribute, find the ones that match the criteria.
                    // a match is the trait name or extended name or any classifications set on it
                    // will need trait references for these resolved traits because metatraits are 'un resolved'
                    const newTraitRefs = new Array<CdmTraitReferenceBase>();
                    for (const nrt of newTraits.set) {
                        newTraitRefs.push(CdmObjectBase.resolvedTraitToTraitRef(projCtx.projectionDirective.resOpt, nrt));
                    }

                    for (const rt of newResAttr.resolvedTraits.set) {
                        // so get a hashset of the 'tokens' that classify this trait
                        const classifiers = new Set<string>();
                        // this profile lists the classifiers and all base traits
                        var profile = rt.fetchTraitProfile(projCtx.projectionDirective.resOpt, this.profCache, undefined);
                        if (profile !== undefined) {
                            profile = profile.consolidate(this.profCache);
                            // all classifications 
                            if (profile.classifications !== undefined) {
                                for (const c of profile.classifications) {
                                    classifiers.add(c.traitName);
                                }
                            }
                            while (profile !== undefined) {
                                classifiers.add(profile.traitName);
                                profile = profile.IS_A;
                            }
                        }

                        // is there an intersection between the set of things to look for and the set of things that describe the trait?
                        // astonished to learn there are no native set algebra funcs for Set in js. then why have a Set?
                        const intersection = new Set([...classifiers].filter(x => applyToTraitNames.has(x)))
                        if (intersection.size > 0) {
                            // add the specified and fixed up traits to the metatraits of the resolved
                            if (newTraitRefs !== undefined && newTraitRefs.length > 0) {
                                if (rt.metaTraits === undefined)
                                    rt.metaTraits = new Array<CdmTraitReferenceBase>();
                                rt.metaTraits = rt.metaTraits.concat(newTraitRefs);
                            }
                            // remove some?
                            if (traitNamesToRemove !== undefined && traitNamesToRemove.size > 0 && rt.metaTraits !== undefined) {
                                rt.metaTraits = rt.metaTraits.filter((mtr) => !(traitNamesToRemove.has(mtr.fetchObjectDefinitionName())));
                                if (rt.metaTraits !== undefined && rt.metaTraits.length === 0) {
                                    rt.metaTraits = undefined;
                                }
                            }
                        }
                    }
                }

                // Create a projection attribute state for the new attribute with new applied traits by creating a copy of the current state
                // Copy() sets the current state as the previous state for the new one
                const newPAS: ProjectionAttributeState = currentPAS.copy();

                // Update the resolved attribute to be the new attribute we created
                newPAS.currentResolvedAttribute = newResAttr;

                projOutputSet.add(newPAS);
            } else {
                // Pass through
                projOutputSet.add(currentPAS);
            }
        }

        return projOutputSet;
    }

    private resolvedNewTraits(projCtx: ProjectionContext, currentPAS: ProjectionAttributeState) {
        let resolvedTraitSet: ResolvedTraitSet = new ResolvedTraitSet(projCtx.projectionDirective.resOpt);
        const projectionOwnerName: string = projCtx.projectionDirective.originalSourceAttributeName ?? "";

        if (this.traitsToAdd !== undefined ) {
            for (const traitRef of this.traitsToAdd) {
                const traitRefCopy: ResolvedTraitSet = traitRef.fetchResolvedTraits(projCtx.projectionDirective.resOpt).deepCopy();
                this.replaceWildcardCharacters(projCtx.projectionDirective.resOpt, traitRefCopy, projectionOwnerName, currentPAS);
                resolvedTraitSet = resolvedTraitSet.mergeSet(traitRefCopy);
            }
        }

        return resolvedTraitSet;
    }

    /**
     * Replace wild characters in the arguments if argumentsContainWildcards is true.
     */
    private replaceWildcardCharacters(resOpt: resolveOptions, resolvedTraitSet: ResolvedTraitSet, projectionOwnerName: string, currentPAS: ProjectionAttributeState): void {
        if (this.argumentsContainWildcards !== undefined && this.argumentsContainWildcards === true) {
            resolvedTraitSet.set.forEach(resolvedTrait => {

                const parameterValueSet: ParameterValueSet = resolvedTrait.parameterValues;
                for (let i: number = 0; i < parameterValueSet.length; ++i) {
                    var value = parameterValueSet.fetchValue(i);
                    if (typeof value === 'string'){
                        var newVal = CdmOperationBase.replaceWildcardCharacters(value, projectionOwnerName, currentPAS);
                        if (newVal !== value) {
                            parameterValueSet.setParameterValue(resOpt, parameterValueSet.fetchParameterAtIndex(i).getName(), newVal);
                        }
                    }
                }
            });
        }
    }

    /**
     * Remove traits from the new resolved attribute.
     */
    private removeTraitsInNewAttribute(resOpt: resolveOptions, newResAttr: ResolvedAttribute): void {
        const traitNamesToRemove:Set<string> = new Set()
        if (this.traitsToRemove !== undefined) {
            for (const traitRef of this.traitsToRemove) {
                const resolvedTraitSet = traitRef.fetchResolvedTraits(resOpt).deepCopy();
                resolvedTraitSet.set.forEach(rt => traitNamesToRemove.add(rt.traitName));
            }
            traitNamesToRemove.forEach(traitName => newResAttr.resolvedTraits.remove(resOpt, traitName));
        }
    }
}
