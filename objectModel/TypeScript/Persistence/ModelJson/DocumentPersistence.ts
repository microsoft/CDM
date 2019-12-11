import { EntityPersistence } from '.';
import {
    CdmCollection,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmImport,
    CdmManifestDefinition,
    cdmObjectType,
    cdmStatusLevel,
    CdmTraitDefinition,
    copyOptions,
    resolveOptions
} from '../../internal';
import { isDocumentDefinition } from '../../Utilities/cdmObjectTypeGuards';
import { Logger } from '../../Utilities/Logging/Logger';
import { ImportPersistence } from '../CdmFolder';
import { Import } from '../CdmFolder/types';
import { LocalEntity } from './types';

export class DocumentPersistence {
    public static async fromData(
        ctx: CdmCorpusContext,
        dataObj: LocalEntity,
        extensionTraitDefList: CdmTraitDefinition[],
        localExtensionTraitDefList: CdmTraitDefinition[]
    ): Promise<CdmDocumentDefinition> {
        const docName: string = `${dataObj.name}.cdm.json`;

        const doc: CdmDocumentDefinition = ctx.corpus.MakeObject(cdmObjectType.documentDef, docName);

        // import at least foundations
        doc.imports.push('cdm:/foundations.cdm.json');

        const entityDec: CdmEntityDefinition = await EntityPersistence.fromData(
            ctx,
            dataObj,
            extensionTraitDefList,
            localExtensionTraitDefList
        );

        if (!entityDec) {
            Logger.error(
                DocumentPersistence.name,
                ctx,
                'There was an error while trying to convert a model.json entity to the CDM entity.'
            );

            return undefined;
        }

        if (dataObj['cdm:imports']) {
            for (const element of dataObj['cdm:imports']) {
                if (element.corpusPath === 'cdm:/foundations.cdm.json') {
                    // don't add foundations twice
                    continue;
                }
                doc.imports.push(ImportPersistence.fromData(ctx, element));
            }
        }

        doc.definitions.push(entityDec);

        return doc;
    }

    public static async toData(
        documentObjectOrPath: CdmDocumentDefinition | string,
        manifest: CdmManifestDefinition,
        resOpt: resolveOptions,
        options: copyOptions,
        ctx: CdmCorpusContext
    ): Promise<LocalEntity> {
        if (typeof documentObjectOrPath === 'string') {
            // Fetch the document from entity schema.
            const cdmEntity: CdmEntityDefinition = await ctx.corpus.fetchObjectAsync<CdmEntityDefinition>(documentObjectOrPath);
            if (!cdmEntity) {
                Logger.error(DocumentPersistence.name, ctx, 'There was an error while trying to fetch cdm entity doc.');

                return undefined;
            }

            const entity: LocalEntity = await EntityPersistence.toData(cdmEntity, resOpt, options, ctx);
            if (isDocumentDefinition(cdmEntity.owner)) {
                const document: CdmDocumentDefinition = cdmEntity.owner;
                if (document.imports.length > 0) {
                    entity['cdm:imports'] = [];
                    for (const element of document.imports) {
                        const currImport: Import = ImportPersistence.toData(element, resOpt, options);
                        // the corpus path in the imports are relative to the document where it was defined.
                        // when saving in model.json the documents are flattened to the manifest level
                        // so it is necessary to recalculate the path to be relative to the manifest.
                        const absolutePath: string = ctx.corpus.storage.createAbsoluteCorpusPath(currImport.corpusPath, document);
                        currImport.corpusPath = ctx.corpus.storage.createRelativeCorpusPath(absolutePath, manifest);
                        entity['cdm:imports'].push(currImport);
                    }
                }
            } else {
                Logger.warning(
                    DocumentPersistence.name,
                    ctx,
                    `Entity ${cdmEntity.getName()} is not inside a document or its owner is not a document.`
                );
            }

            return entity;
        } else {
            // TODO: Do something else when documentObjectOrPath is an object.
        }

        return undefined;
    }
}
