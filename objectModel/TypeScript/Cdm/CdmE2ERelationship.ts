// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    Errors,
    Logger,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmE2ERelationship extends CdmObjectDefinitionBase {
    public fromEntity: string;
    public fromEntityAttribute: string;
    public toEntity: string;
    public toEntityAttribute: string;
    public name: string;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.e2eRelationshipDef;
    }

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        this.name = name;
        this.objectType = cdmObjectType.e2eRelationshipDef;
    }

    public getObjectType(): cdmObjectType {
        return cdmObjectType.e2eRelationshipDef;
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        let copy: CdmE2ERelationship;
        if (!host) {
            copy = new CdmE2ERelationship(this.ctx, this.name);
        } else {
            copy = host as CdmE2ERelationship;
            copy.ctx = this.ctx;
            copy.name = this.name;
        }

        copy.fromEntity = this.fromEntity;
        copy.fromEntityAttribute = this.fromEntityAttribute;
        copy.toEntity = this.toEntity;
        copy.toEntityAttribute = this.toEntityAttribute;
        this.copyDef(resOpt, copy);

        return copy;
    }

    public validate(): boolean {
        const missingFields: string[] = [];
        if (!this.fromEntity) {
            missingFields.push('fromEntity');
        }
        if (!this.fromEntityAttribute) {
            missingFields.push('fromEntityAttribute');
        }
        if (!this.toEntity) {
            missingFields.push('toEntity');
        }
        if (!this.toEntityAttribute) {
            missingFields.push('toEntityAttribute');
        }

        if (missingFields.length > 0) {
            Logger.error(
                CdmE2ERelationship.name,
                this.ctx,
                Errors.validateErrorString(this.atCorpusPath, missingFields),
                this.validate.name
            );

            return false;
        }

        return true;
    }

    public getName(): string {
        return this.name;
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        let path: string = '';
        if (!this.ctx.corpus.blockDeclaredPathChanges) {
            if (!this.declaredPath) {
                this.declaredPath = pathFrom + this.name;
            }
            path = this.declaredPath;
        }

        if (preChildren && preChildren(this, path)) {
            return false;
        }
        if (this.visitDef(path, preChildren, postChildren)) {
            return true;
        }
        if (postChildren && postChildren(this, path)) {
            return true;
        }

        return false;
    }

    public isDerivedFrom(base: string, resOpt?: resolveOptions): boolean {
        if (!resOpt) {
            resOpt = new resolveOptions(this);
        }

        return false;
    }
}
