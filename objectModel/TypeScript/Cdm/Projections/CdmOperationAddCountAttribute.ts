// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeContext,
    CdmCorpusContext,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    CdmTypeAttributeDefinition,
    Errors,
    Logger,
    ProjectionAttributeStateSet,
    ProjectionContext,
    resolveOptions,
    VisitCallback
} from '../../internal';

/**
 * Class to handle AddCountAttribute operations
 */
export class CdmOperationAddCountAttribute extends CdmOperationBase {
    private TAG: string = CdmOperationAddCountAttribute.name;

    public countAttribute: CdmTypeAttributeDefinition;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationAddCountAttributeDef;
        this.type = cdmOperationType.addCountAttribute;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.copy.name);
        return new CdmOperationAddCountAttribute(this.ctx);
    }

    /**
     * @inheritdoc
     */
    public getName(): string {
        return 'operationAddCountAttribute';
    }

    /**
     * @inheritdoc
     */
    public getObjectType(): cdmObjectType {
        return cdmObjectType.operationAddCountAttributeDef;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        if (!this.countAttribute) {
            missingFields.push('countAttribute');
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
                path = pathFrom + 'operationAddCountAttribute';
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
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.appendProjectionAttributeState.name);
        return undefined;
    }
}
