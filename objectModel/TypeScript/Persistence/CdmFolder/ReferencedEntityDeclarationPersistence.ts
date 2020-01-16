import {
    CdmCorpusContext,
    cdmObjectType,
    CdmReferencedEntityDeclarationDefinition,
    CdmTraitReference,
    copyOptions,
    resolveOptions
} from '../../internal';
import { Logger } from '../../Utilities/Logging/Logger';
import * as timeUtils from '../../Utilities/timeUtils';
import {
    EntityDeclarationDefinition, entityDeclarationDefinitionType, TraitReference
} from './types';
import * as utils from './utils';

export class ReferencedEntityDeclarationPersistence {
    /**
     * Creates an instance of referenced entity declartion from data object.
     * @param ctx The context.
     * @param object The object to get data from.
     */
    public static fromData(
        ctx: CdmCorpusContext,
        prefixPath: string,
        dataObj: EntityDeclarationDefinition
    ): CdmReferencedEntityDeclarationDefinition {
        const newRef: CdmReferencedEntityDeclarationDefinition = ctx.corpus.MakeObject(
            cdmObjectType.referencedEntityDeclarationDef,
            dataObj.entityName
        );

        let entityPath: string = dataObj.entityPath !== undefined ? dataObj.entityPath : dataObj.entityDeclaration;

        if (entityPath === undefined) {
            Logger.error(ReferencedEntityDeclarationPersistence.name, ctx, 'Couldn\'t find entity path or similar.', 'FromData');
        }

        if (entityPath !== undefined && entityPath.indexOf(':') === -1) {
            entityPath = `${prefixPath}${entityPath}`;
        }

        newRef.entityPath = entityPath;

        if (dataObj.lastFileStatusCheckTime) {
            newRef.lastFileStatusCheckTime = new Date(dataObj.lastFileStatusCheckTime);
        }

        if (dataObj.lastFileModifiedTime) {
            newRef.lastFileModifiedTime = new Date(dataObj.lastFileModifiedTime);
        }

        if (dataObj.explanation) {
            newRef.explanation = dataObj.explanation;
        }
        if (dataObj.exhibitsTraits) {
            utils.addArrayToCdmCollection<CdmTraitReference>(newRef.exhibitsTraits, utils.createTraitReferenceArray(ctx, dataObj.exhibitsTraits));
        }

        return newRef;
    }

    public static toData(instance: CdmReferencedEntityDeclarationDefinition, resOpt: resolveOptions, options: copyOptions)
        : EntityDeclarationDefinition {
        return {
            type: entityDeclarationDefinitionType.referencedEntity,
            lastFileStatusCheckTime: timeUtils.getFormattedDateString(instance.lastFileStatusCheckTime),
            lastFileModifiedTime: timeUtils.getFormattedDateString(instance.lastFileModifiedTime),
            explanation: instance.explanation,
            entityName: instance.entityName,
            entityPath: instance.entityPath,
            exhibitsTraits: utils.arrayCopyData<string | TraitReference>(resOpt, instance.exhibitsTraits, options)
        };
    }
}
