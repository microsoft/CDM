// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    cdmLogCode,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    Logger,
    ProjectionAttributeContextTreeBuilder,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionResolutionCommonUtil,
    ResolvedAttribute,
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
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        const copy: CdmOperationCombineAttributes = !host ? new CdmOperationCombineAttributes(this.ctx) : host as CdmOperationCombineAttributes;

        copy.select = this.select ? this.select.slice() : undefined;
        copy.mergeInto = this.mergeInto ? this.mergeInto.copy(resOpt) as CdmTypeAttributeDefinition : undefined;
        
        this.copyProj(resOpt, copy);
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
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, this.atCorpusPath, missingFields.map((s: string) => `'${s}'`).join(', '));
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
        // Also, create a single list of leaf level PAS
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
            if (leafLevelCombineAttributeNames.has(currentPAS.currentResolvedAttribute.resolvedName)) {
                // Attribute to Merge

                if (!pasMergeList.includes(currentPAS)) {
                    pasMergeList.push(currentPAS);
                }
            } else {
                // Attribute to Pass Through

                // Create a projection attribute state for the non-selected / pass-through attribute by creating a copy of the current state
                // Copy() sets the current state as the previous state for the new one
                const newPAS: ProjectionAttributeState = currentPAS.copy();

                projAttrStateSet.add(newPAS);
            }
        }

        if (pasMergeList.length > 0) {
            const mergeIntoAttribute: CdmTypeAttributeDefinition = this.mergeInto;

            // the merged attribute needs one new place to live, so here it is
            const mergedAttrCtxParam: AttributeContextParameters = {
                under: attrCtxOpCombineAttrs,
                type: cdmAttributeContextType.attributeDefinition,
                name: mergeIntoAttribute.getName()
            };

            const mergedAttrCtx: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, mergedAttrCtxParam)

            // Create new resolved attribute, set the new attribute as target
            const raNewMergeInto: ResolvedAttribute = CdmOperationCombineAttributes.createNewResolvedAttribute(projCtx, mergedAttrCtx, mergeIntoAttribute);

            // Create new output projection attribute state set
            const newMergeIntoPAS: ProjectionAttributeState = new ProjectionAttributeState(projAttrStateSet.ctx);
            newMergeIntoPAS.currentResolvedAttribute = raNewMergeInto;
            newMergeIntoPAS.previousStateList = pasMergeList;

            const attributesAddedToContext: Set<string> = new Set<string>();

            // Create the attribute context parameters and just store it in the builder for now
            // We will create the attribute contexts at the end
            for (const select of leafLevelCombineAttributeNames.keys()) {
                if (leafLevelCombineAttributeNames.has(select) &&
                    leafLevelCombineAttributeNames.get(select) !== undefined &&
                    leafLevelCombineAttributeNames.get(select).length > 0) {
                    for (const leafLevelForSelect of leafLevelCombineAttributeNames.get(select)) {
                        // When dealing with a polymorphic entity, it is possible that multiple entities have an attribute with the same name
                        // Only one attribute with each name should be added otherwise the attribute context will end up with duplicated nodes
                        if (!attributesAddedToContext.has(leafLevelForSelect.currentResolvedAttribute.resolvedName)) {
                            attributesAddedToContext.add(leafLevelForSelect.currentResolvedAttribute.resolvedName);
                            attrCtxTreeBuilder.createAndStoreAttributeContextParameters(
                                select,
                                leafLevelForSelect,
                                newMergeIntoPAS.currentResolvedAttribute,
                                cdmAttributeContextType.attributeDefinition,
                                leafLevelForSelect.currentResolvedAttribute.attCtx, // lineage is the source att
                                newMergeIntoPAS.currentResolvedAttribute.attCtx // merge into points back here
                            );
                        }
                    }
                }
            }

            projAttrStateSet.add(newMergeIntoPAS);
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx);

        return projAttrStateSet;
    }
}
