// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttributeContext,
    cdmAttributeContextType,
    CdmCorpusContext,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    Errors,
    Logger,
    ProjectionAttributeState,
    ProjectionAttributeStateSet,
    ProjectionContext,
    ProjectionResolutionCommonUtil,
    resolveOptions,
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
        this.excludeAttributes = [];
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.copy.name);
        return new CdmOperationExcludeAttributes(this.ctx);
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
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.isDerivedFrom.name);
        return false;
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
                path = pathFrom + 'operationExcludeAttributes';
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

        // Iterate through all the projection attribute states generated from the source's resolved attributes
        // Each projection attribute state contains a resolved attribute that it is corresponding to
        for (const currentPAS of projCtx.currentAttributeStateSet.values) {
            // Check if the current projection attribute state's resolved attribute is in the list of attributes to exclude
            // If this attribute is not in the exclude list, then we are including it in the output
            if (!topLevelExcludeAttributeNames.has(currentPAS.currentResolvedAttribute.resolvedName)) {
                // Create a new attribute context for the attribute that we are including
                const attrCtxAddedAttrParam: AttributeContextParameters = {
                    under: attrCtx,
                    type: cdmAttributeContextType.attributeDefinition,
                    name: currentPAS.currentResolvedAttribute.resolvedName
                };
                const attrCtxAddedAttr: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxAddedAttrParam);

                // Create a projection attribute state for the included attribute
                // We only create projection attribute states for attributes that are not in the exclude list
                // Add the current projection attribute state as the previous state of the new projection attribute state
                const newPAS: ProjectionAttributeState = new ProjectionAttributeState(projOutputSet.ctx)
                newPAS.currentResolvedAttribute = currentPAS.currentResolvedAttribute;
                newPAS.previousStateList = [ currentPAS ];

                projOutputSet.add(newPAS);
            } else {
                // The current projection attribute state's resolved attribute is in the exclude list

                // Get the attribute name the way it appears in the exclude list
                // For our attribute context, we want to use the attribute name the attribute has in the exclude list rather than its current name
                const excludeAttributeName: string = topLevelExcludeAttributeNames.get(currentPAS.currentResolvedAttribute.resolvedName);

                // Create a new attribute context for the excluded attribute
                const attrCtxExcludedAttrParam: AttributeContextParameters = {
                    under: attrCtxOpExcludeAttrs,
                    type: cdmAttributeContextType.attributeDefinition,
                    name: excludeAttributeName
                };
                const attrCtxExcludedAttr: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxExcludedAttrParam);
            }
        }

        return projOutputSet;
    }
}
