// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmEntityDefinition,
    cdmStatusLevel,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
    resolveOptions
} from '../../../../internal';
import { EntityPersistence } from '../../../../Persistence/CdmFolder/EntityPersistence';
import { LocalAdapter } from '../../../../Storage';
import { AttributeResolutionDirectiveSet } from '../../../../Utilities/AttributeResolutionDirectiveSet';
import { testHelper } from '../../../testHelper';

describe('Persistence.CdmFolder.Entity', () => {
    /// <summary>
    /// The path between TestDataPath and TestName.
    /// </summary>
    const testsSubpath: string = 'Persistence/CdmFolder/Entity';
    const schemaDocsRoot: string = testHelper.schemaDocumentsPath;

    /**
     * Testing that trait with multiple properties are maintained even when one of the properties is null
     */
    it('TestEntityProperties', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testHelper.getInputFolderPath(testsSubpath, 'TestEntityProperties'));

        const obj: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/entA.cdm.json/Entity A');
        const att: CdmTypeAttributeDefinition = obj.attributes.allItems[0] as CdmTypeAttributeDefinition;
        let result = att.appliedTraits.allItems.find((x: CdmTraitReference) => x.namedReference === 'is.constrained');

        expect(result).not
            .toBeUndefined();
        expect(att.maximumLength)
            .toBe(30);
        expect(att.maximumValue)
            .toBeUndefined();
        expect(att.minimumValue)
            .toBeUndefined();

        // removing the only argument should remove the trait
        att.maximumLength = undefined;
        result = att.appliedTraits.allItems.find((x: CdmTraitReference) => x.namedReference === 'is.constrained');

        expect(att.maximumLength)
            .toBeUndefined();
        expect(result)
            .toBeUndefined();

        done();
    });

    /**
     * Testing special case where "this.attributes" attributes do not inherit the InDocument field because these attributes
     * are created during resolution (no inDocument propagation during resolution). This error appears when running copyData
     * with stringRefs = true in certain cases
     */
    it('TestFromAndToDataWithElevatedTraits', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testHelper.getInputFolderPath(testsSubpath, 'TestFromAndToDataWithElevatedTraits'));
        // need to set schema docs to the cdm namespace instead of using resources
        corpus.storage.mount('cdm', new LocalAdapter(schemaDocsRoot));
        corpus.setEventCallback(
            (level, msg) => {
                expect(msg.indexOf('unable to resolve an entity'))
                    .toBe(-1);
            },
            cdmStatusLevel.warning);
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Account.cdm.json/Account');
        const resEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync(`${entity.entityName}_`);
        EntityPersistence.toData(
            resEntity,
            new resolveOptions(resEntity.inDocument),
            { stringRefs: true }
        );
        done();
    });

    /**
     * Testing that loading entities with missing references logs warnings when the resolve option shallowValidation = true.
     */
    it('TestLoadingEntityWithShallowValidation', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testHelper.getInputFolderPath(testsSubpath, 'TestLoadingEntityWithShallowValidation'));
        corpus.storage.mount('cdm', new LocalAdapter(schemaDocsRoot));
        corpus.setEventCallback(
            (level, msg) => {
                // When messages regarding references not being resolved or loaded are logged, check that they are warnings and not errors.
                if (msg.indexOf('Unable to resolve the reference') != -1 || msg.indexOf('Could not read') != -1) {
                    expect(level).toEqual(cdmStatusLevel.warning);
                }
            },
            cdmStatusLevel.warning);

        // Load entity with shallowValidation = true.
        await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Entity.cdm.json/Entity', null, true);
        // Load resolved entity with shallowValidation = true.
        await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/ResolvedEntity.cdm.json/ResolvedEntity', null, true);

        done();
    });

    /**
     * Testing that loading entities with missing references logs error when the resolve option shallowValidation = false.
     */
    it('TestLoadingEntityWithoutShallowValidation', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testHelper.getInputFolderPath(testsSubpath, 'TestLoadingEntityWithShallowValidation'));
        corpus.storage.mount('cdm', new LocalAdapter(schemaDocsRoot));
        corpus.setEventCallback(
            (level, msg) => {
                // When messages regarding references not being resolved or loaded are logged, check that they are errors.
                if (msg.indexOf('Unable to resolve the reference') != -1 || msg.indexOf('Could not read') != -1) {
                    expect(level).toEqual(cdmStatusLevel.error);
                }
            },
            cdmStatusLevel.warning);

        // Load entity with shallowValidation = false.
        await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Entity.cdm.json/Entity');
        // Load resolved entity with shallowValidation = false.
        await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/ResolvedEntity.cdm.json/ResolvedEntity');

        done();
    });
});
