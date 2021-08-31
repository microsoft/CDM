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
    VisitCallback
} from '../../internal';

/**
 * Class to handle IncludeAttributes operations
 */
export class CdmOperationIncludeAttributes extends CdmOperationBase {
    private TAG: string = CdmOperationIncludeAttributes.name;
    public includeAttributes: string[];

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationIncludeAttributesDef;
        this.type = cdmOperationType.includeAttributes;

        this.includeAttributes = [];
    }

    /**
     * @inheritdoc
     */
     public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        const copy: CdmOperationIncludeAttributes = !host ? new CdmOperationIncludeAttributes(this.ctx) : host as CdmOperationIncludeAttributes;

        copy.includeAttributes = this.includeAttributes ? this.includeAttributes.slice() : undefined;
        
        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationIncludeAttributes';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationIncludeAttributesDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.includeAttributes) {
            missingFields.push('includeAttributes');
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
                path = pathFrom + 'operationIncludeAttributes';
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
        const attrCtxOpIncludeAttrsParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationIncludeAttributes,
            name: `operation/index${this.index}/operationIncludeAttributes`
        };
        const attrCtxOpIncludeAttrs: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpIncludeAttrsParam);

        // Get the top-level attribute names for each of the included attributes
        // Since the include operation allows providing either current state resolved attribute names
        //   or the previous state resolved attribute names, we search for the name in the PAS tree
        //   and fetch the top level resolved attribute names.
        const topLevelIncludeAttributeNames: Map<string, string> = ProjectionResolutionCommonUtil.getTopList(projCtx, this.includeAttributes);

        // Initialize a projection attribute context tree builder with the created attribute context for the operation
        const attrCtxTreeBuilder: ProjectionAttributeContextTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpIncludeAttrs);

        // Index that holds the current attribute name as the key and the attribute as value
        const topLevelIncludeAttribute: Map<string, ProjectionAttributeState> = new Map<string, ProjectionAttributeState>();

        // List of attributes that were not included on the final attribute list
        const removedAttributes: ProjectionAttributeState[] = [];

        // Iterate through all the PAS in the PASSet generated from the projection source's resolved attributes
        for (const currentPAS of projCtx.currentAttributeStateSet.states) {
            // Check if the current PAS's RA is in the list of attributes to include.
            if (topLevelIncludeAttributeNames.has(currentPAS.currentResolvedAttribute.resolvedName)) {
                topLevelIncludeAttribute.set(currentPAS.currentResolvedAttribute.resolvedName, currentPAS);
            } else {
                removedAttributes.push(currentPAS);
            }
        }

        for (const entry of topLevelIncludeAttributeNames) {
            // Get the attribute state
            const currentPAS: ProjectionAttributeState = topLevelIncludeAttribute.get(entry[0]);

            // Get the attribute name the way it appears in the include list
            const includeAttributeName: string = entry[1];

            // Create the attribute context parameters and just store it in the builder for now
            // We will create the attribute contexts at the end
            attrCtxTreeBuilder.createAndStoreAttributeContextParameters(
                includeAttributeName,
                currentPAS,
                currentPAS.currentResolvedAttribute,
                cdmAttributeContextType.attributeDefinition,
                currentPAS.currentResolvedAttribute.attCtx, // lineage is the included attribute
                undefined // don't know who will point here yet
            );

            // Create a projection attribute state for the included attribute by creating a copy of the current state
            // Copy() sets the current state as the previous state for the new one
            // We only create projection attribute states for attributes in the include list
            const newPAS: ProjectionAttributeState = currentPAS.copy();

            projAttrStateSet.add(newPAS);
        }

        // Generate attribute context nodes for the attributes that were not included
        for (const currentPAS of removedAttributes) {
            // Create the attribute context parameters and just store it in the builder for now
            // We will create the attribute contexts at the end
            attrCtxTreeBuilder.createAndStoreAttributeContextParameters(
                undefined,
                currentPAS,
                currentPAS.currentResolvedAttribute,
                cdmAttributeContextType.attributeExcluded,
                currentPAS.currentResolvedAttribute.attCtx, // lineage is the excluded attribute
                undefined // don't know who will point here, probably nobody, I mean, we got excluded
            );
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx);

        return projAttrStateSet;
    }
}
