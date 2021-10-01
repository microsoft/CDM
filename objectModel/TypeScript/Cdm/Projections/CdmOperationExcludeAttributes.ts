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
    Logger,
    ProjectionAttributeContextTreeBuilder,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionResolutionCommonUtil,
    resolveOptions,
    StringUtils,
    VisitCallback
} from '../../internal';

/**
 * Class to handle ExcludeAttributes operations
 */
export class CdmOperationExcludeAttributes extends CdmOperationBase {
    private TAG: string = CdmOperationExcludeAttributes.name;
    public excludeAttributes: string[];

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationExcludeAttributesDef;
        this.type = cdmOperationType.excludeAttributes;
    }

    /**
     * @inheritdoc
     */
     public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        const copy: CdmOperationExcludeAttributes = !host ? new CdmOperationExcludeAttributes(this.ctx) : host as CdmOperationExcludeAttributes;

        copy.excludeAttributes = this.excludeAttributes ? this.excludeAttributes.slice() : undefined;
        
        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationExcludeAttributes';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationExcludeAttributesDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.excludeAttributes) {
            missingFields.push('excludeAttributes');
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
        const attrCtxOpExcludeAttrsParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationExcludeAttributes,
            name: `operation/index${this.index}/operationExcludeAttributes`
        };
        const attrCtxOpExcludeAttrs: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpExcludeAttrsParam);

        // Get the top-level attribute names of the attributes to exclude
        // We use the top-level names because the exclude list may contain a previous name our current resolved attributes had
        const topLevelExcludeAttributeNames: Map<string, string> = ProjectionResolutionCommonUtil.getTopList(projCtx, this.excludeAttributes);

        // Initialize a projection attribute context tree builder with the created attribute context for the operation
        const attrCtxTreeBuilder: ProjectionAttributeContextTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpExcludeAttrs);

        // Iterate through all the projection attribute states generated from the source's resolved attributes
        // Each projection attribute state contains a resolved attribute that it is corresponding to
        for (const currentPAS of projCtx.currentAttributeStateSet.states) {
            // Check if the current projection attribute state's resolved attribute is in the list of attributes to exclude
            // If this attribute is not in the exclude list, then we are including it in the output
            if (!topLevelExcludeAttributeNames.has(currentPAS.currentResolvedAttribute.resolvedName)) {
                // Create the attribute context parameters and just store it in the builder for now
                // We will create the attribute contexts at the end
                attrCtxTreeBuilder.createAndStoreAttributeContextParameters(
                    undefined,
                    currentPAS,
                    currentPAS.currentResolvedAttribute,
                    cdmAttributeContextType.attributeDefinition,
                    currentPAS.currentResolvedAttribute.attCtx, // lineage is the included attribute
                    undefined // don't know who will point here
                );

                // Create a projection attribute state for the included attribute by creating a copy of the current state
                // Copy() sets the current state as the previous state for the new one
                // We only create projection attribute states for attributes that are not in the exclude list
                const newPAS: ProjectionAttributeState = currentPAS.copy();

                projOutputSet.add(newPAS);
            } else {
                // The current projection attribute state's resolved attribute is in the exclude list

                // Get the attribute name the way it appears in the exclude list
                const excludeAttributeName: string = topLevelExcludeAttributeNames.get(currentPAS.currentResolvedAttribute.resolvedName);

                // Create the attribute context parameters and just store it in the builder for now
                // We will create the attribute contexts at the end
                attrCtxTreeBuilder.createAndStoreAttributeContextParameters(
                    excludeAttributeName,
                    currentPAS,
                    currentPAS.currentResolvedAttribute,
                    cdmAttributeContextType.attributeExcluded,
                    currentPAS.currentResolvedAttribute.attCtx, // lineage is the included attribute
                    undefined // don't know who will point here yet, excluded, so... this could be the end for you.
                );
            }
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx);

        return projOutputSet;
    }
}
