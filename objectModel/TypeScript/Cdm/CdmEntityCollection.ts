// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { isBoolean, isString } from 'util';
import {
    CdmCollection,
    CdmCorpusContext,
    CdmEntityDeclarationDefinition,
    CdmEntityDefinition,
    CdmLocalEntityDeclarationDefinition,
    cdmLogCode,
    CdmObject,
    cdmObjectType,
    Logger
} from '../internal';
import { isEntityDefinition } from '../Utilities/cdmObjectTypeGuards';

export class CdmEntityCollection extends CdmCollection<CdmEntityDeclarationDefinition> {
    private TAG: string = CdmEntityCollection.name;

    constructor(ctx: CdmCorpusContext, owner: CdmObject) {
        super(ctx, owner, cdmObjectType.localEntityDeclarationDef);
    }

    public push(
        obj: string |
            CdmEntityDefinition |
            CdmEntityDeclarationDefinition,
        entityPath: boolean | string = false,
        simpleRef: boolean = false): CdmEntityDeclarationDefinition {
        if (isBoolean(entityPath)) {
            simpleRef = entityPath;
        }
        if (isString(obj)) {
            const createdObj: CdmLocalEntityDeclarationDefinition = super.push(obj, simpleRef) as CdmLocalEntityDeclarationDefinition;
            if (isString(entityPath)) {
                createdObj.entityPath = entityPath;
            }

            return createdObj;
        } else {
            let entityDeclaration: CdmEntityDeclarationDefinition;
            if (isEntityDefinition(obj)) {
                const entity: CdmEntityDefinition = obj;

                if (!entity.owner) {
                    Logger.error(entity.ctx, this.TAG, this.push.name, entity.atCorpusPath, cdmLogCode.ErrEntityCreationFailed);
                    return undefined;
                }

                entityDeclaration =
                    this.ctx.corpus.MakeObject<CdmLocalEntityDeclarationDefinition>(this.defaultType, entity.entityName, simpleRef);
                entityDeclaration.entityPath = this.ctx.corpus.storage.createRelativeCorpusPath(
                    `${entity.owner.atCorpusPath}/${entity.entityName}`,
                    this.owner.inDocument
                );
                entityDeclaration.explanation = entity.explanation;
            } else {
                entityDeclaration = obj;
            }

            if (isString(entityPath)) {
                entityDeclaration.entityPath = entityPath;
            }

            return super.push(entityDeclaration);
        }
    }

    public remove(entity: CdmEntityDefinition | CdmEntityDeclarationDefinition): boolean {
        if (entity instanceof CdmEntityDefinition) {
            for (let index: number = 0; index < this.length; index = index + 1) {
                if (this.allItems[index].entityName === entity.entityName) {
                    super.removeAt(index);

                    return true;
                }
            }

            return false;
        }

        return super.remove(entity);
    }

    public concat(list: CdmEntityDefinition[] | CdmEntityDeclarationDefinition[]): void {
        for (const elem of list) {
            this.push(elem);
        }
    }
}
