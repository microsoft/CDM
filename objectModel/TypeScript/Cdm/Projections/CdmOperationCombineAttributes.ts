// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    CdmEntityReference,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    Errors,
    Logger,
    ProjectionAttributeContextTreeBuilder,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionResolutionCommonUtil,
    ResolvedAttribute,
    ResolvedTrait,
    resolveOptions,
    VisitCallback
} from '../../internal';

/**
 * Class to handle CombineAttributes operations
 */
export class CdmOperationCombineAttributes extends CdmOperationBase {
    private TAG: string = CdmOperationCombineAttributes.name;

    public select: string[];
    public mergeInto: CdmTypeAttributeDefinition;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationCombineAttributesDef;
        this.type = cdmOperationType.combineAttributes;

        this.select = [];
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        const copy = new CdmOperationCombineAttributes(this.ctx);
        if (this.select !== undefined) {
            copy.select = Object.assign(this.select);
        }
        if (!this.mergeInto) {
            copy.mergeInto = this.mergeInto.copy(resOpt, host) as CdmTypeAttributeDefinition;
        }
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationCombineAttributes';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationCombineAttributesDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.select) {
            missingFields.push('select');
        }

        if (!this.mergeInto) {
            missingFields.push('mergeInto');
        }

        if (missingFields.length > 0) {
            Logger.error(
                this.TAG,
                this.ctx,
                Errors.validateErrorString(this.atCorpusPath, missingFields),
                this.validate.name
            );

            return false;
        }

        return true;
    }

    /**
     * @inheritdoc
     */
    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        let path: string = '';
        if (!this.ctx.corpus.blockDeclaredPathChanges) {
            path = this.declaredPath;
            if (!path) {
                path = pathFrom + 'operationCombineAttributes';
                this.declaredPath = path;
            }
        }

        if (preChildren && preChildren(this, path)) {
            return false;
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
    public appendProjectionAttributeState(projCtx: ProjectionContext, projAttrStateSet: ProjectionAttributeStateSet, attrCtx: CdmAttributeContext): ProjectionAttributeStateSet {
        // Create a new attribute context for the operation
        const attrCtxOpCombineAttrsParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationCombineAttributes,
            name: `operation/index${this.index}/operationCombineAttributes`
        };
        const attrCtxOpCombineAttrs: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpCombineAttrsParam);

        // Initialize a projection attribute context tree builder with the created attribute context for the operation
        const attrCtxTreeBuilder: ProjectionAttributeContextTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpCombineAttrs);

        // Get all the leaf level PAS nodes from the tree for each selected attribute and cache to a dictionary
        const leafLevelCombineAttributeNames: Map<string, ProjectionAttributeState[]> = new Map<string, ProjectionAttributeState[]>();
        // Also, create a single list of leaf level PAS to add to the `is.linkedEntity.identifier` trait parameter
        const leafLevelMergePASList: ProjectionAttributeState[] = [];
        for (const select of this.select) {
            const leafLevelListForCurrentSelect: ProjectionAttributeState[] = ProjectionResolutionCommonUtil.getLeafList(projCtx, select);
            if (leafLevelListForCurrentSelect !== undefined &&
                leafLevelListForCurrentSelect.length > 0 &&
                !leafLevelCombineAttributeNames.has(select)) {
                leafLevelCombineAttributeNames.set(select, leafLevelListForCurrentSelect);

                leafLevelMergePASList.push.apply(leafLevelMergePASList, leafLevelListForCurrentSelect)
            }
        }

        // Create a List of top-level PAS objects that will be get merged based on the selected attributes
        const pasMergeList: ProjectionAttributeState[] = [];

        // Run through the top-level PAS objects 
        for (const currentPAS of projCtx.currentAttributeStateSet.states) {
            if ((projCtx.projectionDirective.ownerType === cdmObjectType.entityDef ||
                projCtx.projectionDirective.isSourcePolymorphic) &&
                leafLevelCombineAttributeNames.has(currentPAS.currentResolvedAttribute.resolvedName)) {
                // Attribute to Merge

                if (!pasMergeList.includes(currentPAS)) {
                    pasMergeList.push(currentPAS);
                }
            }
            else {
                // Attribute to Pass Through

                // Create a projection attribute state for the non-selected / pass-through attribute by creating a copy of the current state
                // Copy() sets the current state as the previous state for the new one
                const newPAS: ProjectionAttributeState = currentPAS.copy();

                projAttrStateSet.add(newPAS);
            }
        }

        if (pasMergeList.length > 0) {
            const mergeIntoAttribute: CdmTypeAttributeDefinition = this.mergeInto as CdmTypeAttributeDefinition;
            const addTrait: string[] = [`is.linkedEntity.identifier`];

            // Create new resolved attribute, set the new attribute as target, and apply `is.linkedEntity.identifier` trait
            const raNewMergeInto: ResolvedAttribute = CdmOperationBase.createNewResolvedAttribute(projCtx, attrCtxOpCombineAttrs, mergeIntoAttribute, undefined, addTrait);

            // update the new foreign key resolved attribute with trait param with reference details
            const reqdTrait: ResolvedTrait = raNewMergeInto.resolvedTraits.find(projCtx.projectionDirective.resOpt, `is.linkedEntity.identifier`);
            if (reqdTrait !== undefined) {
                const traitParamEntRef: CdmEntityReference = ProjectionResolutionCommonUtil.createForeignKeyLinkedEntityIdentifierTraitParameter(projCtx.projectionDirective, projAttrStateSet.ctx.corpus, leafLevelMergePASList);
                reqdTrait.parameterValues.setParameterValue(projCtx.projectionDirective.resOpt, `entityReferences`, traitParamEntRef);
            }

            // Create new output projection attribute state set for FK and add prevPas as previous state set
            const newMergeIntoPAS: ProjectionAttributeState = new ProjectionAttributeState(projAttrStateSet.ctx);
            newMergeIntoPAS.currentResolvedAttribute = raNewMergeInto;
            newMergeIntoPAS.previousStateList = pasMergeList;

            // Create the attribute context parameters and just store it in the builder for now
            // We will create the attribute contexts at the end
            for (const select of leafLevelCombineAttributeNames.keys()) {
                if (leafLevelCombineAttributeNames.has(select) &&
                    leafLevelCombineAttributeNames.get(select) !== undefined &&
                    leafLevelCombineAttributeNames.get(select).length > 0) {
                    for (const leafLevelForSelect of leafLevelCombineAttributeNames.get(select)) {
                        attrCtxTreeBuilder.createAndStoreAttributeContextParameters(select, leafLevelForSelect, newMergeIntoPAS.currentResolvedAttribute, cdmAttributeContextType.attributeDefinition);
                    }
                }
            }

            projAttrStateSet.add(newMergeIntoPAS);
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx, true);

        return projAttrStateSet;
    }
}
