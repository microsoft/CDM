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
    ResolvedAttribute,
    ResolvedAttributeSetBuilder,
    resolveOptions,
    VisitCallback
} from '../../internal';

/**
 * Class to handle AddAttributeGroup operations
 */
export class CdmOperationAddAttributeGroup extends CdmOperationBase {
    private TAG: string = CdmOperationAddAttributeGroup.name;

    /**
     * Name given to the attribute group that will be created
     */
    public attributeGroupName: string;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationAddAttributeGroupDef;
        this.type = cdmOperationType.addAttributeGroup;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        const copy = new CdmOperationAddAttributeGroup(this.ctx);
        copy.attributeGroupName = this.attributeGroupName;
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationAddAttributeGroup';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationAddAttributeGroupDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.attributeGroupName) {
            missingFields.push('attributeGroupName');
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
                path = pathFrom + 'operationAddAttributeGroup';
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
        const attrCtxOpAddAttrGroupParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationAddAttributeGroup,
            name: `operation/index${this.index}/${this.getName()}`
        };
        const attrCtxOpAddAttrGroup: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpAddAttrGroupParam);

        // Create a new attribute context for the attribute group we will create
        const attrCtxAttrGroupParam: AttributeContextParameters = {
            under: attrCtxOpAddAttrGroup,
            type: cdmAttributeContextType.attributeDefinition,
            name: this.attributeGroupName
        };
        const attrCtxAttrGroup: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxAttrGroupParam);

        // Create a new resolve attribute set builder that will be used to combine all the attributes into one set
        const rasb = new ResolvedAttributeSetBuilder();

        // Iterate through all the projection attribute states generated from the source's resolved attributes
        // Each projection attribute state contains a resolved attribute that it is corresponding to
        for (const currentPAS of projCtx.currentAttributeStateSet.states) {
            // Create a copy of the resolved attribute
            const resolvedAttribute: ResolvedAttribute = currentPAS.currentResolvedAttribute.copy();

            // Add the attribute to the resolved attribute set
            rasb.ras.merge(resolvedAttribute);

            // Add each attribute's attribute context to the resolved attribute set attribute context
            const attrParam: AttributeContextParameters = {
                under: attrCtxAttrGroup,
                type: cdmAttributeContextType.attributeDefinition,
                name: resolvedAttribute.resolvedName
            };
            resolvedAttribute.attCtx = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrParam)
            resolvedAttribute.attCtx.addLineage(currentPAS.currentResolvedAttribute.attCtx)
        }

        // Create a new resolved attribute that will hold the attribute set containing all the attributes
        const resAttrNew = new ResolvedAttribute(projCtx.projectionDirective.resOpt, rasb.ras, this.attributeGroupName, attrCtxAttrGroup);

        // Create a new projection attribute state pointing to the resolved attribute set that represents the attribute group
        const newPAS = new ProjectionAttributeState(this.ctx);
        newPAS.currentResolvedAttribute = resAttrNew;
        projOutputSet.add(newPAS);

        return projOutputSet;
    }
}
