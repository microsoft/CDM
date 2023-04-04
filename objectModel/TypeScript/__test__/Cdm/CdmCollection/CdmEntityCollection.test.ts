// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { cdmObjectType } from '../../../Enums/cdmObjectType';
import {
    CdmCorpusContext,
    CdmCorpusDefinition,
    CdmDocumentDefinition,
    CdmEntityCollection,
    CdmEntityDeclarationDefinition,
    CdmEntityDefinition,
    CdmManifestDefinition,
    cdmStatusLevel
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { createDocumentForEntity, generateManifest } from './CdmCollectionHelperFunctions';

describe('Cdm/CdmCollection/CdmEntityCollection', () => {
    it('TestManifestAddEntityWithLocalizedPath', () => {
        const manifest: CdmManifestDefinition = generateManifest();
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

    /**
     * Tests whether the CdmEntityDeclarationDefinition can be passed directly to Manifest.Entities.Add() .
     */
    it('TestManifestCanAddEntityDeclaration', () => {
        const manifest: CdmManifestDefinition = generateManifest();
        const entity: CdmEntityDefinition = new CdmEntityDefinition(manifest.ctx, 'entityName', undefined);

        createDocumentForEntity(manifest.ctx.corpus, entity);

        const entityDeclaration: CdmEntityDeclarationDefinition = manifest.ctx.corpus.MakeObject<CdmEntityDeclarationDefinition>(
            cdmObjectType.localEntityDeclarationDef,
            entity.entityName,
            false
        );
        entityDeclaration.entityPath = `${entity.owner.atCorpusPath}/${entity.entityName}`;

        manifest.entities.push(entityDeclaration);

        expect('local:/entityName.cdm.json/entityName')
            .toBe(entityDeclaration.entityPath);
        expect('entityName')
            .toBe(entityDeclaration.entityName);

        expect(1)
            .toBe(manifest.entities.length);
        expect(entityDeclaration)
            .toBe(manifest.entities.allItems[0]);
    });

    it('TestManifestCanAddEntityDefinition', () => {
        const manifest: CdmManifestDefinition = generateManifest();
        const entity: CdmEntityDefinition = new CdmEntityDefinition(manifest.ctx, 'entityName', undefined);

        createDocumentForEntity(manifest.ctx.corpus, entity);

        manifest.entities.push(entity);

        expect(1)
            .toBe(manifest.entities.length);
        expect('entityName')
            .toBe(manifest.entities.allItems[0].entityName);
    });

    /**
     * Tests whether the EntityDefinition can be passed directly to Manifest.Entities.Add().
     */
    it('TestManifestCannotAddEntityDefinitionWithoutCreatingDocument', () => {
        const cdmCorpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        cdmCorpus.storage.defaultNamespace = 'local';
        let functionWasCalled: boolean = false;
        let functionParameter1: cdmStatusLevel = cdmStatusLevel.info;
        let functionParameter2: string;
        cdmCorpus.setEventCallback((statusLevel: cdmStatusLevel, message1: string) => {
            functionWasCalled = true;
            functionParameter1 = statusLevel;
            functionParameter2 = message1;
        });
        cdmCorpus.storage.mount('local', new LocalAdapter('C:\\Root\\Path'));
        const manifest: CdmManifestDefinition = new CdmManifestDefinition(cdmCorpus.ctx, 'manifest');
        manifest.folderPath = '/';
        manifest.namespace = 'local';
        const entity: CdmEntityDefinition = new CdmEntityDefinition(manifest.ctx, 'entityName', undefined);
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        manifest.entities.push(entity);
        expect(functionWasCalled)
            .toBeTruthy();
        expect(cdmStatusLevel.error)
            .toEqual(functionParameter1);
        expect(functionParameter2.indexOf('Expected entity to have an "Owner" document set. Cannot create entity declaration to add to manifest. '))
            .not
            .toBe(-1);
        expect(0)
            .toBe(manifest.entities.length);
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
        const manifest: CdmManifestDefinition = generateManifest();
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
