import { cdmObjectType } from '../../../Enums/cdmObjectType';
import {
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityCollection,
    CdmEntityDeclarationDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition
} from '../../../internal';
import { LocalAdapter } from '../../../StorageAdapter';
import { generateManifest } from './CdmCollectionHelperFunctions';

describe('Cdm/CdmCollection/CdmEntityCollection', () => {
    it('TestManifestAddEntityWithLocalizedPath', () => {
        const manifest: CdmManifestDefinition = generateManifest('c:\nothing');
        const cdmCorpus: CdmCorpusDefinition = manifest.ctx.corpus;

        const entity: CdmEntityDefinition = new CdmEntityDefinition(cdmCorpus.ctx, 'entityName', undefined);
        entity.explanation = 'The explanation of the entity';

        createDocumentForEntity(cdmCorpus, entity);

        const cdmEntity: CdmEntityDefinition = new CdmEntityDefinition(cdmCorpus.ctx, 'cdmEntityName', undefined);
        createDocumentForEntity(cdmCorpus, cdmEntity, 'cdm');

        const localizedEntityDeclaration: CdmEntityDeclarationDefinition = manifest.entities.push(entity);
        const cdmEntityDeclaration: CdmEntityDeclarationDefinition = manifest.entities.push(cdmEntity);

        expect(localizedEntityDeclaration.explanation)
            .toEqual('The explanation of the entity');
        expect(localizedEntityDeclaration.entityPath)
            .toEqual('entityName.cdm.json/entityName');
        expect(localizedEntityDeclaration.entityName)
            .toEqual('entityName');
        expect(cdmEntityDeclaration.entityPath)
            .toEqual('cdm:/cdmEntityName.cdm.json/cdmEntityName');
        expect(localizedEntityDeclaration.entityName)
            .toEqual('entityName');

        expect(manifest.entities.allItems.length)
            .toEqual(2);
        expect(manifest.entities.allItems[0])
            .toEqual(localizedEntityDeclaration);
        expect(manifest.entities.allItems[1])
            .toEqual(cdmEntityDeclaration);
    });

    it('TestManifestCanAddEntityDefinition', () => {
        const manifest: CdmManifestDefinition = generateManifest('c:\nothing');
        const entity: CdmEntityDefinition = new CdmEntityDefinition(manifest.ctx, 'entityName', undefined);

        createDocumentForEntity(manifest.ctx.corpus, entity);

        const entityDeclaration: CdmEntityDeclarationDefinition =
            manifest.ctx.corpus.MakeObject<CdmEntityDeclarationDefinition>(
                cdmObjectType.localEntityDeclarationDef,
                entity.entityName,
                false);
        entityDeclaration.entityPath = `${entity.owner.atCorpusPath}/${entity.entityName}`;

        manifest.entities.push(entityDeclaration);

        expect(entityDeclaration.entityPath)
            .toEqual('local:/entityName.cdm.json/entityName');
        expect(entityDeclaration.entityName)
            .toEqual('entityName');
        expect(manifest.entities.length)
            .toEqual(1);
        expect(manifest.entities.allItems[0])
            .toEqual(entityDeclaration);
    });

    it('TestManifestAddListOfEntityDeclaration', () => {
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.defaultNamespace = 'local';
        cdmCorpus.storage.mount('local', new LocalAdapter('CdmCorpus/LocalPath'));

        const ctx: CdmCorpusContext = cdmCorpus.ctx;

        const cdmDocument: CdmDocumentDefinition = new CdmDocumentDefinition(ctx, 'NameOfDocument');
        const collection: CdmEntityCollection = new CdmEntityCollection(ctx, cdmDocument);

        const entityList: CdmEntityDefinition[] = [];

        for (let i: number = 0; i < 2; i = i + 1) {
            const entity: CdmEntityDefinition = new CdmEntityDefinition(cdmCorpus.ctx, `entityName_${i}`, undefined);
            createDocumentForEntity(cdmCorpus, entity);
            entityList.push(entity);
        }

        expect(collection.length)
            .toEqual(0);
        collection.concat(entityList);
        expect(collection.length)
            .toEqual(2);

        for (let i: number = 0; i < 2; i = i + 1) {
            expect(collection.allItems[i].entityName)
                .toEqual(`entityName_${i}`);
        }
    });

    it('TestCdmEntityCollectionRemoveEntityDeclarationDefinition', () => {
        const manifest: CdmManifestDefinition = generateManifest('c:\nothing');
        const entity: CdmEntityDefinition = new CdmEntityDefinition(manifest.ctx, 'entityName', undefined);
        createDocumentForEntity(manifest.ctx.corpus, entity);
        const otherEntity: CdmEntityDefinition = new CdmEntityDefinition(manifest.ctx, 'otherEntityName', undefined);
        createDocumentForEntity(manifest.ctx.corpus, otherEntity);

        manifest.entities.push(entity);
        manifest.entities.push(otherEntity);

        expect(manifest.entities.length)
            .toEqual(2);

        let removed: boolean = manifest.entities.remove(entity);

        expect(removed)
            .toBeTruthy();

        expect(manifest.entities.allItems.length)
            .toEqual(1);
        expect(manifest.entities.allItems[0].entityName)
            .toEqual(otherEntity.entityName);

        removed = manifest.entities.remove(entity);
        expect(removed)
            .toBeFalsy();

        expect(manifest.entities.allItems.length)
            .toEqual(1);
    });
});

function createDocumentForEntity(cdmCorpus: CdmCorpusDefinition, entity: CdmEntityDefinition, namespace: string = 'local')
    : CdmDocumentDefinition {
    const cdmFolderDef: CdmFolderDefinition = cdmCorpus.storage.fetchRootFolder(namespace);
    const entityDoc: CdmDocumentDefinition =
        cdmCorpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entity.entityName}.cdm.json`, false);
    cdmFolderDef.documents.push(entityDoc);
    entityDoc.definitions.push(entity);

    return entityDoc;
}
