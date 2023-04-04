// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusContext,
    cdmLogCode,
    CdmObject,
    CdmObjectDefinitionBase,
    cdmObjectType,
    CdmTraitReference,
    Logger,
    resolveOptions,
    VisitCallback
} from '../internal';

export class CdmE2ERelationship extends CdmObjectDefinitionBase {
    private TAG: string = CdmE2ERelationship.name;

    public fromEntity: string;
    public fromEntityAttribute: string;
    public toEntity: string;
    public toEntityAttribute: string;
    public name: string;

    private lastFileModifiedTime: Date;
    private lastFileModifiedOldTime: Date;
    private elevatedTraitCorpusPath: Map<CdmTraitReference, string>;

    public static get objectType(): cdmObjectType {
        return cdmObjectType.e2eRelationshipDef;
    }

    constructor(ctx: CdmCorpusContext, name: string) {
        super(ctx);
        this.name = name;
        this.objectType = cdmObjectType.e2eRelationshipDef;

        this.lastFileModifiedTime = undefined;
        this.lastFileModifiedOldTime = undefined;
        this.elevatedTraitCorpusPath = new Map<CdmTraitReference, string>();
    }

    public getObjectType(): cdmObjectType {
        return cdmObjectType.e2eRelationshipDef;
    }

    public copy(resOpt?: resolveOptions, host?: CdmObject): CdmObject {
        if (!resOpt) {
            resOpt = new resolveOptions(this, this.ctx.corpus.defaultResolutionDirectives);
        }

        let copy: CdmE2ERelationship;
        if (!host) {
            copy = new CdmE2ERelationship(this.ctx, this.name);
        } else {
            copy = host as CdmE2ERelationship;
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
            Logger.error(this.ctx, this.TAG, this.validate.name, this.atCorpusPath, cdmLogCode.ErrValdnIntegrityCheckFailure, this.atCorpusPath, missingFields.map((s: string) => `'${s}'`).join(', '));
            return false;
        }

        return true;
    }

    public getName(): string {
        return this.name;
    }

    public visit(pathFrom: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean {
        const path: string = this.fetchDeclaredPath(pathFrom);

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
        return false;
    }

    public setLastFileModifiedTime(value: Date): void {
        this.setLastFileModifiedOldTime(this.lastFileModifiedTime);
        this.lastFileModifiedTime = value;
    }

    public getlastFileModifiedTime(): Date {
        return this.lastFileModifiedTime;
    }

    private setLastFileModifiedOldTime(value: Date): void {
        this.lastFileModifiedOldTime = value;
    }

    public getlastFileModifiedOldTime(): Date {
        return this.lastFileModifiedOldTime;
    }

    /**
     * @internal
     */
    public getElevatedTraitCorpusPath(): Map<CdmTraitReference, string> {
        return this.elevatedTraitCorpusPath;
    }

    public resetLastFileModifiedOldTime(): void {
        this.setLastFileModifiedOldTime(undefined);
    }

    public createCacheKey(): string {
        let nameAndPipe: string = '';
        if (this.name) {
            nameAndPipe = `${this.name}|`;
        }

        return `${nameAndPipe}${this.toEntity}|${this.toEntityAttribute}|${this.fromEntity}|${this.fromEntityAttribute}`;
    };
}
