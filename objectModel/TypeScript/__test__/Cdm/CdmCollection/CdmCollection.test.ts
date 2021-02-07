// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { cdmObjectType } from '../../../Enums/cdmObjectType';
import {
    CdmAttributeContext,
    CdmCollection,
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmLocalEntityDeclarationDefinition,
    CdmManifestDefinition
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { createDocumentForEntity, generateManifest } from './CdmCollectionHelperFunctions';

describe('Cdm/CdmCollection/CdmCollection', () => {
    it('TestCdmCollectionAddMethod', () => {
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.defaultNamespace = 'local';

        const ctx: CdmCorpusContext = cdmCorpus.ctx;

        const cdmDocument: CdmDocumentDefinition = new CdmDocumentDefinition(ctx, 'NameOfDocument');
        const collection: CdmCollection<CdmAttributeContext>
            = new CdmCollection<CdmAttributeContext>(ctx, cdmDocument, cdmObjectType.attributeContextDef);

        const addedAttribute: CdmAttributeContext = collection.push('nameOfNewAttribute');
        expect(collection.allItems.length)
            .toEqual(1);
        expect(collection.allItems[0].name)
            .toEqual('nameOfNewAttribute');
        expect(collection.allItems[0].owner)
            .toEqual(cdmDocument);
        expect(collection.allItems[0].ctx)
            .toEqual(ctx);

        expect(collection.allItems[0])
            .toEqual(addedAttribute);
    });

    it('TestCdmCollectionRemoveMethod', () => {
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.defaultNamespace = 'local';
        cdmCorpus.storage.mount('local', new LocalAdapter('CdmCorpus/LocalPath'));

        const ctx: CdmCorpusContext = cdmCorpus.ctx;
        const cdmDocument: CdmDocumentDefinition = new CdmDocumentDefinition(ctx, 'NameOfDocument');
        const collection: CdmCollection<CdmAttributeContext>
            = new CdmCollection<CdmAttributeContext>(ctx, cdmDocument, cdmObjectType.attributeContextDef);

        const addedDocument: CdmAttributeContext = collection.push('nameOfNewDocument');
        const addedDocument2: CdmAttributeContext = collection.push('otherDocument');

        expect(collection.length)
            .toEqual(2);

        let removed: boolean = collection.remove(addedDocument);
        expect(removed)
            .toBeTruthy();

        // try to remove a second time
        removed = collection.remove(addedDocument);
        expect(removed)
            .toEqual(false);
        expect(collection.length)
            .toEqual(1);
    });

    it('TestCdmCollectionRemoveAt', () => {
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.defaultNamespace = 'local';
        cdmCorpus.storage.mount('local', new LocalAdapter('CdmCorpus/LocalPath'));

        const ctx: CdmCorpusContext = cdmCorpus.ctx;
        const cdmDocument: CdmDocumentDefinition = new CdmDocumentDefinition(ctx, 'NameOfDocument');
        const collection: CdmCollection<CdmAttributeContext>
            = new CdmCollection<CdmAttributeContext>(ctx, cdmDocument, cdmObjectType.attributeContextDef);

        const addedDocument: CdmAttributeContext = collection.push('nameOfNewDocument');
        const addedDocument2: CdmAttributeContext = collection.push('otherDocument');

        expect(collection.length)
            .toEqual(2);

        collection.removeAt(0);
        expect(collection.length)
            .toEqual(1);
        expect(collection.allItems[0])
            .toEqual(addedDocument2);
        collection.removeAt(1);
        expect(collection.length)
            .toEqual(1);
        expect(collection.allItems[0])
            .toEqual(addedDocument2);
        collection.removeAt(0);
        expect(collection.length)
            .toEqual(0);
    });

    it('TestCdmCollectionAddingList', async () => {
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.defaultNamespace = 'local';
        cdmCorpus.storage.mount('local', new LocalAdapter('CdmCorpus/LocalPath'));

        const ctx: CdmCorpusContext = cdmCorpus.ctx;

        const cdmDocument: CdmDocumentDefinition = new CdmDocumentDefinition(ctx, 'NameOfDocument');
        const collection: CdmCollection<CdmLocalEntityDeclarationDefinition>
            = new CdmCollection<CdmLocalEntityDeclarationDefinition>(ctx, cdmDocument, cdmObjectType.attributeContextDef);

        const entityList: CdmLocalEntityDeclarationDefinition[] = [];

        for (let i: number = 0; i < 2; i++) {
            const entity: CdmEntityDefinition = new CdmEntityDefinition(cdmCorpus.ctx, `entityName_${i}`, undefined);

            createDocumentForEntity(cdmCorpus, entity);

            const entityDeclaration: CdmLocalEntityDeclarationDefinition =
                cdmCorpus.MakeObject<CdmLocalEntityDeclarationDefinition>(
                    cdmObjectType.localEntityDeclarationDef,
                    entity.entityName,
                    false);
            entityDeclaration.owner = entity.owner;
            entityDeclaration.entityPath = `${entity.owner.atCorpusPath}/${entity.entityName}`;

            entityList.push(entityDeclaration);
        }

        expect(collection.length)
            .toEqual(0);

        collection.concat(entityList);

        expect(entityList.length)
            .toEqual(2);
        expect(collection.allItems.length)
            .toEqual(2);

        for (let i: number = 0; i < 2; i++) {
            expect(collection.allItems[i].entityName)
                .toEqual(`entityName_${i}`);
        }
    });

    it('TestCdmCollectionChangeMakesDocumentDirty', () => {
        const manifest: CdmManifestDefinition = generateManifest('C:\\Nothing');
        const collection: CdmCollection<CdmEntityReference> =
            new CdmCollection<CdmEntityReference>(manifest.ctx, manifest, cdmObjectType.entityRef);
        manifest.isDirty = false;
        collection.push(new CdmEntityReference(manifest.ctx, 'name', false));
        expect(manifest.isDirty)
            .toBeTruthy();
        manifest.isDirty = false;
        collection.push('theName');
        expect(manifest.isDirty)
            .toBeTruthy();
        const entity: CdmEntityReference = new CdmEntityReference(manifest.ctx, 'otherEntity', false);
        const entityList: CdmEntityReference[] = [entity];
        manifest.isDirty = false;
        collection.concat(entityList);
        expect(manifest.isDirty)
            .toBeTruthy();
        manifest.isDirty = false;
        const entity2: CdmEntityReference = new CdmEntityReference(manifest.ctx, 'otherEntity2', false);
        collection.insert(0, entity2);
        expect(manifest.isDirty)
            .toBeTruthy();

        manifest.isDirty = false;
        collection.remove(entity);
        expect(manifest.isDirty)
            .toBeTruthy();

        manifest.isDirty = false;
        collection.removeAt(0);
        expect(manifest.isDirty)
            .toBeTruthy();

        manifest.isDirty = false;
        collection.clear();
        expect(manifest.isDirty)
            .toBeTruthy();
    });
});
