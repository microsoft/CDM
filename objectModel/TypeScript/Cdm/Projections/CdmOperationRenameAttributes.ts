// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeContext,
    CdmCorpusContext,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    Errors,
    Logger,
    ProjectionAttributeStateSet,
    ProjectionContext,
    resolveOptions,
    VisitCallback
} from '../../internal';

/**
 * Class to handle RenameAttributes operations
 */
export class CdmOperationRenameAttributes extends CdmOperationBase {
    private TAG: string = CdmOperationRenameAttributes.name;
    public renameFormat: string;
    public applyTo: any;

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationRenameAttributesDef;
        this.type = cdmOperationType.renameAttributes;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.copy.name);
        return new CdmOperationRenameAttributes(this.ctx);
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
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.isDerivedFrom.name);
        return false;
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
    public appendProjectionAttributeState(projCtx: ProjectionContext, projAttrStateSet: ProjectionAttributeStateSet, attrCtx: CdmAttributeContext): ProjectionAttributeStateSet {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.appendProjectionAttributeState.name);
        return undefined;
    }
}
