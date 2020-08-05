// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmAttributeContext,
    CdmCorpusContext,
    CdmObject,
    cdmObjectType,
    CdmOperationBase,
    cdmOperationType,
    Logger,
    ProjectionAttributeStateSet,
    ProjectionContext,
    resolveOptions,
    VisitCallback
} from '../../internal';

/**
 * Class to handle AddAttributeGroup operations
 */
export class CdmOperationAddAttributeGroup extends CdmOperationBase {
    private TAG: string = CdmOperationAddAttributeGroup.name;
    // TODO (sukanyas): Property to be defined

    constructor(ctx: CdmCorpusContext) {
        super(ctx);
        this.objectType = cdmObjectType.operationAddAttributeGroupDef;
        this.type = cdmOperationType.addAttributeGroup;
    }

    /**
     * @inheritdoc
     */
    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.copy.name);
        return new CdmOperationAddAttributeGroup(this.ctx);
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
    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.isDerivedFrom.name);
        return false;
    }

    /**
     * @inheritdoc
     */
    public validate(): boolean {
        const missingFields: string[] = [];

        // TODO (sukanyas): required Property to be defined

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
    public appendProjectionAttributeState(projCtx: ProjectionContext, projAttrStateSet: ProjectionAttributeStateSet, attrCtx: CdmAttributeContext): ProjectionAttributeStateSet {
        Logger.error(this.TAG, this.ctx, 'Projection operation not implemented yet.', this.appendProjectionAttributeState.name);
        return undefined;
    }
}
