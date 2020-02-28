// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
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
        return this.fromEntity !== null && this.fromEntityAttribute !== null && this.toEntity !== null && this.toEntityAttribute !== null;
    }

    public getName(): string {
        return this.name;
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        let path: string = '';
        if (!this.ctx.corpus.blockDeclaredPathChanges) {
            path = this.declaredPath;
            if (!this.declaredPath) {
                this.declaredPath = pathFrom + this.name;
            }
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
