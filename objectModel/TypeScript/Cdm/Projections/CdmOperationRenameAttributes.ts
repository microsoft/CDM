// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmAttribute,
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
    ResolvedAttribute,
    resolveOptions,
    StringUtils,
    VisitCallback
} from '../../internal';

/**
 * Class to handle RenameAttributes operations
 */
export class CdmOperationRenameAttributes extends CdmOperationBase {
    private TAG: string = CdmOperationRenameAttributes.name;
    public renameFormat: string;
    public applyTo: string[];

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationRenameAttributesDef;
        this.type = cdmOperationType.renameAttributes;
    }

    /**
     * @inheritdoc
     */
     public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        const copy: CdmOperationRenameAttributes = !host ? new CdmOperationRenameAttributes(this.ctx) : host as CdmOperationRenameAttributes;

        copy.applyTo = this.applyTo ? this.applyTo.slice() : undefined;
        copy.renameFormat = this.renameFormat;
        
        this.copyProj(resOpt, copy);
        return copy;
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationRenameAttributes';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationRenameAttributesDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.renameFormat) {
            missingFields.push('renameFormat');
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
                path = pathFrom + 'operationRenameAttributes';
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
        const attrCtxOpRenameAttrsParam: AttributeContextParameters = {
            under: attrCtx,
            type: cdmAttributeContextType.operationRenameAttributes,
            name: `operation/index${this.index}/operationRenameAttributes`
        };

        const attrCtxOpRenameAttrs: CdmAttributeContext = CdmAttributeContext.createChildUnder(projCtx.projectionDirective.resOpt, attrCtxOpRenameAttrsParam);

        // Get the list of attributes that will be renamed
        let renameAttributes: string[];
        if (this.applyTo !== undefined) {
            renameAttributes = this.applyTo;
        } else {
            renameAttributes = [];
            for (const currentPAS of projCtx.currentAttributeStateSet.states) {
                renameAttributes.push(currentPAS.currentResolvedAttribute.resolvedName);
            }
        }

        // Get the top-level attribute names of the attributes to rename
        // We use the top-level names because the rename list may contain a previous name our current resolved attributes had
        const topLevelRenameAttributeNames: Map<string, string> = ProjectionResolutionCommonUtil.getTopList(projCtx, renameAttributes);

        const sourceAttributeName: string = projCtx.projectionDirective.originalSourceEntityAttributeName;

        // Initialize a projection attribute context tree builder with the created attribute context for the operation
        const attrCtxTreeBuilder: ProjectionAttributeContextTreeBuilder = new ProjectionAttributeContextTreeBuilder(attrCtxOpRenameAttrs);

        // Iterate through all the projection attribute states generated from the source's resolved attributes
        // Each projection attribute state contains a resolved attribute that it is corresponding to
        for (const currentPAS of projCtx.currentAttributeStateSet.states) {
            // Check if the current projection attribute state's resolved attribute is in the list of attributes to rename
            // If this attribute is not in the rename list, then we are including it in the output without changes
            if (topLevelRenameAttributeNames.has(currentPAS.currentResolvedAttribute.resolvedName)) {
                if ((currentPAS.currentResolvedAttribute.target as CdmAttribute).getObjectType) {
                    // The current attribute should be renamed

                    const newAttributeName: string = this.getNewAttributeName(currentPAS, sourceAttributeName);

                    // Create new resolved attribute with the new name, set the new attribute as target
                    const resAttrNew: ResolvedAttribute = CdmOperationBase.createNewResolvedAttribute(projCtx, undefined, currentPAS.currentResolvedAttribute, newAttributeName);

                    // Get the attribute name the way it appears in the applyTo list
                    const applyToName: string = topLevelRenameAttributeNames.get(currentPAS.currentResolvedAttribute.resolvedName);

                    // Create the attribute context parameters and just store it in the builder for now
                    // We will create the attribute contexts at the end
                    attrCtxTreeBuilder.createAndStoreAttributeContextParameters(
                        applyToName,
                        currentPAS,
                        resAttrNew,
                        cdmAttributeContextType.attributeDefinition,
                        currentPAS.currentResolvedAttribute.attCtx, // lineage is the original attribute
                        undefined // don't know who will point here yet
                    );

                    // Create a projection attribute state for the renamed attribute by creating a copy of the current state
                    // Copy() sets the current state as the previous state for the new one
                    // We only create projection attribute states for attributes that are in the rename list
                    const newPAS: ProjectionAttributeState = currentPAS.copy();

                    // Update the resolved attribute to be the new renamed attribute we created
                    newPAS.currentResolvedAttribute = resAttrNew;

                    projOutputSet.add(newPAS);
                } else {
                    Logger.warning(this.ctx, this.TAG, this.appendProjectionAttributeState.name, null, cdmLogCode.WarnProjRenameAttrNotSupported);
                    // Add the attribute without changes
                    projOutputSet.add(currentPAS);
                }
            } else {
                // Pass through
                projOutputSet.add(currentPAS);
            }
        }

        // Create all the attribute contexts and construct the tree
        attrCtxTreeBuilder.constructAttributeContextTree(projCtx);

        return projOutputSet;
    }

    /**
     * Renames an attribute with the current renameFormat
     * @param attributeState The attribute state
     * @params sourceAttributeName parent attribute name (if any)
     */
    getNewAttributeName(attributeState: ProjectionAttributeState, sourceAttributeName: string): string {
        const currentAttributeName: string = attributeState.currentResolvedAttribute.resolvedName;
        const ordinal: string = attributeState.ordinal !== undefined ? attributeState.ordinal.toString() : '';
        const format: string = this.renameFormat;

        if (!format) {
            Logger.error(this.ctx, this.TAG, this.getNewAttributeName.name, null, cdmLogCode.ErrProjRenameFormatIsNotSet);
        }

        return CdmOperationBase.replaceWildcardCharacters(format, sourceAttributeName, ordinal, currentAttributeName)
    }
}
