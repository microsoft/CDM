// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import { CdmCorpusDefinition, CdmEntityDefinition, CdmFolderDefinition, cdmStatusLevel } from '../../../internal';
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
     * Resolution Guidance Test - Resolve entity by name
     */
    it('TestByEntityName', async (done) => {
        const testName: string = 'TestByEntityName';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test - Resolve entity by primarykey
     */
    it('TestByPrimaryKey', async (done) => {
        const testName: string = 'TestByPrimaryKey';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test- Empty ResolutionGuidance
     */
    it('TestEmptyResolutionGuidance', async (done) => {
        const testName: string = 'TestEmptyResolutionGuidance';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test - With RenameFormat property
     */
    it('TestRenameFormat', async (done) => {
        const testName: string = 'TestRenameFormat';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test - Empty EntityReference property
     */
    it('TestEmptyEntityReference', async (done) => {
        const testName: string = 'TestEmptyEntityReference';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test - With AllowReferences = true
     */
    it('TestAllowReferencesTrue', async (done) => {
        const testName: string = 'TestAllowReferencesTrue';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test - With AlwaysIncludeForeignKey = true
     */
    it('TestAlwaysIncludeForeignKeyTrue', async (done) => {
        const testName: string = 'TestAlwaysIncludeForeignKeyTrue';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test - With ForeignKeyAttribute property
     */
    it('TestForeignKeyAttribute', async (done) => {
        const testName: string = 'TestForeignKeyAttribute';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test - With Cardinality = "one"
     */
    it('TestCardinalityOne', async (done) => {
        const testName: string = 'TestCardinalityOne';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test - With SelectsSubAttribute property
     */
    it('TestSelectsSubAttribute', async (done) => {
        const testName: string = 'TestSelectsSubAttribute';
        await runTest(testName, 'Sales');
        done();
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
