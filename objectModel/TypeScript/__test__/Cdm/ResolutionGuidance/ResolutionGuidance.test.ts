import * as fs from 'fs';
import { runInThisContext } from 'vm';
import { CdmCorpusDefinition, CdmEntityDefinition, CdmFolderDefinition, cdmStatusLevel } from '../../../internal';
import { GithubAdapter, LocalAdapter } from '../../../StorageAdapter';
import { AttributeResolutionDirectiveSet } from '../../../Utilities/AttributeResolutionDirectiveSet';
import { resolveOptions } from '../../../Utilities/resolveOptions';
import { testHelper } from '../../testHelper';

// tslint:disable-next-line: max-func-body-length
describe('Cdm.ResolutionGuidance', () => {
    /**
     * Test path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/ResolutionGuidance';
    const schemaDocsPath: string = '../CDM.SchemaDocuments';

    /**
     * Resolution Guidance Test 01 - Resolve entity by name
     */
    it('Test_01_ByEntityName', async (done) => {
        const testName: string = 'Test_01_ByEntityName';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test 02 - Resolve entity by primarykey
     */
    it('Test_02_ByPrimaryKey', async (done) => {
        const testName: string = 'Test_02_ByPrimaryKey';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test 03 - Empty ResolutionGuidance
     */
    it('Test_03_EmptyResolutionGuidance', async (done) => {
        const testName: string = 'Test_03_EmptyResolutionGuidance';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test 04 - With RenameFormat property
     */
    it('Test_04_RenameFormat', async (done) => {
        const testName: string = 'Test_04_RenameFormat';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test 05 - Empty EntityReference property
     */
    it('Test_05_EmptyEntityReference', async (done) => {
        const testName: string = 'Test_05_EmptyEntityReference';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test 06 - With AllowReferences = true
     */
    it('Test_06_AllowReferencesTrue', async (done) => {
        const testName: string = 'Test_06_AllowReferencesTrue';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test 07 - With AlwaysIncludeForeignKey = true
     */
    it('Test_07_AlwaysIncludeForeignKeyTrue', async (done) => {
        const testName: string = 'Test_07_AlwaysIncludeForeignKeyTrue';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test 08 - With ForeignKeyAttribute property
     */
    it('Test_08_ForeignKeyAttribute', async (done) => {
        const testName: string = 'Test_08_ForeignKeyAttribute';
        await runTest(testName, 'Sales');
        done();
    });

    /**
     * Resolution Guidance Test 09 - With Cardinality = "one"
     */
    it('Test_09_CardinalityOne', async (done) => {
        const testName: string = 'Test_09_CardinalityOne';
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

        const resOpt: resolveOptions = {
            wrtDoc: srcEntityDef.inDocument,
            directives: new AttributeResolutionDirectiveSet()
        };

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
