// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import { CdmCorpusDefinition, CdmEntityDefinition, CdmFolderDefinition, cdmLogCode, cdmStatusLevel, CdmTypeAttributeDefinition } from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { AttributeResolutionDirectiveSet } from '../../../Utilities/AttributeResolutionDirectiveSet';
import { resolveOptions } from '../../../Utilities/resolveOptions';
import { testHelper } from '../../testHelper';

// tslint:disable-next-line: max-func-body-length
describe('Cdm.ResolutionGuidance', () => {
    /**
     * Test path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/ResolutionGuidance';
    const schemaDocsPath: string = testHelper.schemaDocumentsPath;

    /**
     * Tests if a warning is logged if resolution guidance is used
     */
     it('TestResolutionGuidanceDeprecation', async () => {
        var corpus = testHelper.getLocalCorpus(testsSubpath, 'TestResolutionGuidanceDeprecation');

        // Tests warning log when resolution guidance is used on a data typed attribute.
        var entity = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/TypeAttribute.cdm.json/Entity');
        await entity.createResolvedEntityAsync('res-entity');
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.WarnDeprecatedResolutionGuidance, true);

        // Tests warning log when resolution guidance is used on a entity typed attribute.
        entity = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/EntityAttribute.cdm.json/Entity');
        await entity.createResolvedEntityAsync('res-entity');
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.WarnDeprecatedResolutionGuidance, true);

        // Tests warning log when resolution guidance is used when extending an entity.
        entity = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/ExtendsEntity.cdm.json/Entity');
        await entity.createResolvedEntityAsync('res-entity');
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.WarnDeprecatedResolutionGuidance, true);
    });

    /**
     * Resolution Guidance Test - Resolve entity by name
     */
    it('TestByEntityName', async () => {
        const testName: string = 'TestByEntityName';
        await runTest(testName, 'Sales');
    });

    /**
     * Resolution Guidance Test - Resolve entity by primarykey
     */
    it('TestByPrimaryKey', async () => {
        const testName: string = 'TestByPrimaryKey';
        await runTest(testName, 'Sales');
    });

    /**
     * Resolution Guidance Test- Empty ResolutionGuidance
     */
    it('TestEmptyResolutionGuidance', async () => {
        const testName: string = 'TestEmptyResolutionGuidance';
        await runTest(testName, 'Sales');
    });

    /**
     * Resolution Guidance Test - With RenameFormat property
     */
    it('TestRenameFormat', async () => {
        const testName: string = 'TestRenameFormat';
        await runTest(testName, 'Sales');
    });

    /**
     * Resolution Guidance Test - Empty EntityReference property
     */
    it('TestEmptyEntityReference', async () => {
        const testName: string = 'TestEmptyEntityReference';
        await runTest(testName, 'Sales');
    });

    /**
     * Resolution Guidance Test - With AllowReferences = true
     */
    it('TestAllowReferencesTrue', async () => {
        const testName: string = 'TestAllowReferencesTrue';
        await runTest(testName, 'Sales');
    });

    /**
     * Resolution Guidance Test - With AlwaysIncludeForeignKey = true
     */
    it('TestAlwaysIncludeForeignKeyTrue', async () => {
        const testName: string = 'TestAlwaysIncludeForeignKeyTrue';
        await runTest(testName, 'Sales');
    });

    /**
     * Resolution Guidance Test - With ForeignKeyAttribute property
     */
    it('TestForeignKeyAttribute', async () => {
        const testName: string = 'TestForeignKeyAttribute';
        await runTest(testName, 'Sales');
    });

    /**
     * Resolution Guidance Test - With Cardinality = "one"
     */
    it('TestCardinalityOne', async () => {
        const testName: string = 'TestCardinalityOne';
        await runTest(testName, 'Sales');
    });

    /**
     * Resolution Guidance Test - With SelectsSubAttribute - Take Names
     */
    it('TestSelectsSubAttributeTakeNames', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestSelectsSubAttributeTakeNames');
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Sales.cdm.json/Sales');
        const resOpt: resolveOptions = new resolveOptions(entity.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly'])));
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync('resolved', resOpt);

        const att1: CdmTypeAttributeDefinition = resolvedEntity.attributes.allItems[3] as CdmTypeAttributeDefinition;
        const att2: CdmTypeAttributeDefinition = resolvedEntity.attributes.allItems[4] as CdmTypeAttributeDefinition;

        // Check that the attributes in selectsSomeTakeNames were added.
        expect(att1.name)
            .toBe('SalesProductProductId');
        expect(att2.name)
            .toBe('SalesProductProductColor');
    });

    /**
     * Resolution Guidance Test - With SelectsSubAttribute - Avoid Names
     */
    it('TestSelectsSubAttributeAvoidNames', async () => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestSelectsSubAttributeAvoidNames');
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Sales.cdm.json/Sales');
        const resOpt: resolveOptions = new resolveOptions(entity.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'referenceOnly'])));
        const resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync('resolved', resOpt);

        // Check that the attributes in selectsSomeAvoidNames were not added.
        resolvedEntity.attributes.allItems.forEach((att: CdmTypeAttributeDefinition) => {
            expect(att.name).not
                .toBe('SalesProductProductId');
            expect(att.name).not
                .toBe('SalesProductProductColor');
        });
    });

    /*
     * Resolution Guidance Test - With structured/normal imposed directives.
     * This test directly read imposed directives from json file instead of setting resOpt in code as runTest().
     */
    it('TestImposedDirectives', async () => {
        const testName: string = 'TestImposedDirectives';
        const testExpectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const testActualOutputPath: string = testHelper.getActualOutputFolderPath(testsSubpath, testName);

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        corpus.storage.mount('localActualOutput', new LocalAdapter(testActualOutputPath));
        corpus.storage.mount('cdm', new LocalAdapter(schemaDocsPath));
        const actualOutputFolder: CdmFolderDefinition =
            await corpus.fetchObjectAsync<CdmFolderDefinition>('localActualOutput:/');

        // Test "structured" imposed directive.
        let entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Person_Structured.cdm.json/Person');
        let resolvedEntity: CdmEntityDefinition = await entity.createResolvedEntityAsync('Person_Resolved', undefined, actualOutputFolder);
        await resolvedEntity.inDocument.saveAsAsync('Person_Structured_Resolved.cdm.json', true);
        validateOutput('Person_Structured_Resolved.cdm.json', testExpectedOutputPath, testActualOutputPath);

        // Test default imposed directive.
        entity = await corpus.fetchObjectAsync<CdmEntityDefinition>('local:/Person_Default.cdm.json/Person');
        resolvedEntity = await entity.createResolvedEntityAsync('Person_Resolved', undefined, actualOutputFolder);
        await resolvedEntity.inDocument.saveAsAsync('Person_Default_Resolved.cdm.json', true);
        validateOutput('Person_Default_Resolved.cdm.json', testExpectedOutputPath, testActualOutputPath);
    });

    async function runTest(testName: string, sourceEntityName: string): Promise<void> {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, testName);
        const testExpectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const testActualOutputPath: string = testHelper.getActualOutputFolderPath(testsSubpath, testName);

        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.setEventCallback(() => { }, cdmStatusLevel.warning);
        corpus.storage.mount('localInput', new LocalAdapter(testInputPath));
        corpus.storage.mount('localExpectedOutput', new LocalAdapter(testExpectedOutputPath));
        corpus.storage.mount('localActualOutput', new LocalAdapter(testActualOutputPath));
        corpus.storage.mount('cdm', new LocalAdapter(schemaDocsPath));
        corpus.storage.defaultNamespace = 'localInput';

        const srcEntityDef: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(
            `localInput:/${sourceEntityName}.cdm.json/${sourceEntityName}`);
        expect(srcEntityDef)
            .toBeDefined();

        const resOpt: resolveOptions = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet());

        const actualOutputFolder: CdmFolderDefinition = await corpus.fetchObjectAsync<CdmFolderDefinition>('localActualOutput:/');
        let resolvedEntityDef: CdmEntityDefinition;
        let outputEntityFileName: string = '';
        let entityFileName: string = '';

        entityFileName = 'default';
        resOpt.directives = new AttributeResolutionDirectiveSet();
        outputEntityFileName = `${sourceEntityName}_Resolved_${entityFileName}.cdm.json`;
        resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
        if (await resolvedEntityDef.inDocument.saveAsAsync(outputEntityFileName, true)) {
            validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = 'referenceOnly';
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly']));
        outputEntityFileName = `${sourceEntityName}_Resolved_${entityFileName}.cdm.json`;
        resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
        if (await resolvedEntityDef.inDocument.saveAsAsync(outputEntityFileName, true)) {
            validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = 'normalized';
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['normalized']));
        outputEntityFileName = `${sourceEntityName}_Resolved_${entityFileName}.cdm.json`;
        resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
        if (await resolvedEntityDef.inDocument.saveAsAsync(outputEntityFileName, true)) {
            validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = 'structured';
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['structured']));
        outputEntityFileName = `${sourceEntityName}_Resolved_${entityFileName}.cdm.json`;
        resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
        if (await resolvedEntityDef.inDocument.saveAsAsync(outputEntityFileName, true)) {
            validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = 'referenceOnly_normalized';
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly', 'normalized']));
        outputEntityFileName = `${sourceEntityName}_Resolved_${entityFileName}.cdm.json`;
        resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
        if (await resolvedEntityDef.inDocument.saveAsAsync(outputEntityFileName, true)) {
            validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = 'referenceOnly_structured';
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly', 'structured']));
        outputEntityFileName = `${sourceEntityName}_Resolved_${entityFileName}.cdm.json`;
        resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
        if (await resolvedEntityDef.inDocument.saveAsAsync(outputEntityFileName, true)) {
            validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = 'normalized_structured';
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'structured']));
        outputEntityFileName = `${sourceEntityName}_Resolved_${entityFileName}.cdm.json`;
        resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
        if (await resolvedEntityDef.inDocument.saveAsAsync(outputEntityFileName, true)) {
            validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }

        entityFileName = 'referenceOnly_normalized_structured';
        resOpt.directives = new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly', 'normalized', 'structured']));
        outputEntityFileName = `${sourceEntityName}_Resolved_${entityFileName}.cdm.json`;
        resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityFileName, resOpt, actualOutputFolder);
        if (await resolvedEntityDef.inDocument.saveAsAsync(outputEntityFileName, true)) {
            validateOutput(outputEntityFileName, testExpectedOutputPath, testActualOutputPath);
        }
    }

    function validateOutput(outputEntityFileName: string, testExpectedOutputPath: string, testAcutalOutputPath: string): void {
        // tslint:disable-next-line: non-literal-fs-path
        const expected: string = fs.readFileSync(`${testExpectedOutputPath}/${outputEntityFileName}`)
            .toString();
        // tslint:disable-next-line: non-literal-fs-path
        const actual: string = fs.readFileSync(`${testAcutalOutputPath}/${outputEntityFileName}`)
            .toString();
        testHelper.assertObjectContentEquality(JSON.parse(expected), JSON.parse(actual));
    }
});
