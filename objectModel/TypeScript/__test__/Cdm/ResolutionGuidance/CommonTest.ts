// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as path from 'path';
import * as fs from 'fs';
import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    cdmStatusLevel,
    resolveOptions, 
    copyOptions
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';
import { AttributeContextExpectedValue, AttributeExpectedValue } from '../../Utilities/ObjectValidator';

/**
 * Base class for all the new resolution guidance tests.
 */
// tslint:disable:variable-name
export class CommonTest {

    /**
     * The path of the SchemaDocs project.
     */
    protected static schemaDocsPath: string = testHelper.schemaDocumentsPath;

    /**
     * The test's data path.
     */
    protected static testsSubpath: string = 'Cdm/ResolutionGuidance';

    /**
     * This method runs the tests with a set expected attributes & attribute context values and validated the actual result.
     */
    public static async runTestWithValues(
        testName: string,
        sourceEntityName: string,

        expectedContext_default: AttributeContextExpectedValue,
        expectedContext_normalized: AttributeContextExpectedValue,
        expectedContext_referenceOnly: AttributeContextExpectedValue,
        expectedContext_structured: AttributeContextExpectedValue,
        expectedContext_normalized_structured: AttributeContextExpectedValue,
        expectedContext_referenceOnly_normalized: AttributeContextExpectedValue,
        expectedContext_referenceOnly_structured: AttributeContextExpectedValue,
        expectedContext_referenceOnly_normalized_structured: AttributeContextExpectedValue,

        expected_default: AttributeExpectedValue[],
        expected_normalized: AttributeExpectedValue[],
        expected_referenceOnly: AttributeExpectedValue[],
        expected_structured: AttributeExpectedValue[],
        expected_normalized_structured: AttributeExpectedValue[],
        expected_referenceOnly_normalized: AttributeExpectedValue[],
        expected_referenceOnly_structured: AttributeExpectedValue[],
        expected_referenceOnly_normalized_structured: AttributeExpectedValue[],
    ): Promise<void> {
        try {
            const testInputPath: string = testHelper.getInputFolderPath(this.testsSubpath, testName);
            let testActualPath: string = testHelper.getActualOutputFolderPath(this.testsSubpath, testName);
            let testExpectedPath: string = testHelper.getExpectedOutputFolderPath(this.testsSubpath, testName);
            const corpusPath: string = testInputPath.substring(0, testInputPath.length - '/Input'.length);
            testActualPath = path.resolve(testActualPath);
            testExpectedPath = path.resolve(testExpectedPath);

            const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
            corpus.setEventCallback(() => { }, cdmStatusLevel.warning);
            corpus.storage.mount('local', new LocalAdapter(corpusPath));
            corpus.storage.mount('cdm', new LocalAdapter(this.schemaDocsPath));
            corpus.storage.defaultNamespace = 'local';

            const outFolderPath: string = `${corpus.storage.adapterPathToCorpusPath(testActualPath)}/`; // interesting 'bug'
            const outFolder: CdmFolderDefinition = await corpus.fetchObjectAsync<CdmFolderDefinition>(outFolderPath) as CdmFolderDefinition;

            const srcEntityDef: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/Input/${sourceEntityName}.cdm.json/${sourceEntityName}`);
            expect(srcEntityDef)
                .toBeTruthy();

            let resOpt: resolveOptions;
            let resolvedEntityDef: CdmEntityDefinition;
            let outputEntityName: string = '';
            let outputEntityFileName: string = '';
            let entityFileName: string = '';

            if (expectedContext_default && expected_default) {
                entityFileName = 'd';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>()));
                outputEntityName = `${sourceEntityName}_R_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder);
                await this.saveActualEntityAndValidateWithExpected(path.join(testExpectedPath, outputEntityFileName), resolvedEntityDef);
            }

            if (expectedContext_normalized && expected_normalized) {
                entityFileName = 'n';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['normalized'])));
                outputEntityName = `${sourceEntityName}_R_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder);
                await this.saveActualEntityAndValidateWithExpected(path.join(testExpectedPath, outputEntityFileName), resolvedEntityDef);
            }

            if (expectedContext_referenceOnly && expected_referenceOnly) {
                entityFileName = 'ro';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly'])));
                outputEntityName = `${sourceEntityName}_R_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder);
                await this.saveActualEntityAndValidateWithExpected(path.join(testExpectedPath, outputEntityFileName), resolvedEntityDef);
            }

            if (expectedContext_structured && expected_structured) {
                entityFileName = 's';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['structured'])));
                outputEntityName = `${sourceEntityName}_R_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder);
                await this.saveActualEntityAndValidateWithExpected(path.join(testExpectedPath, outputEntityFileName), resolvedEntityDef);
            }

            if (expectedContext_normalized_structured && expected_normalized_structured) {
                entityFileName = 'n_s';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'structured'])));
                outputEntityName = `${sourceEntityName}_R_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder);
                await this.saveActualEntityAndValidateWithExpected(path.join(testExpectedPath, outputEntityFileName), resolvedEntityDef);
            }

            if (expectedContext_referenceOnly_normalized && expected_referenceOnly_normalized) {
                entityFileName = 'ro_n';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly', 'normalized'])));
                outputEntityName = `${sourceEntityName}_R_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder);
                await this.saveActualEntityAndValidateWithExpected(path.join(testExpectedPath, outputEntityFileName), resolvedEntityDef);
            }

            if (expectedContext_referenceOnly_structured && expected_referenceOnly_structured) {
                entityFileName = 'ro_s';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly', 'structured'])));
                outputEntityName = `${sourceEntityName}_R_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder);
                await this.saveActualEntityAndValidateWithExpected(path.join(testExpectedPath, outputEntityFileName), resolvedEntityDef);
            }

            if (expectedContext_referenceOnly_normalized_structured && expected_referenceOnly_normalized_structured) {
                entityFileName = 'ro_n_s';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly', 'normalized', 'structured'])));
                outputEntityName = `${sourceEntityName}_R_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt, outFolder);
                await this.saveActualEntityAndValidateWithExpected(path.join(testExpectedPath, outputEntityFileName), resolvedEntityDef);
            }

        } catch (err) {
            expect(true)
                .toEqual(false);
        }
    }

    /**
     * Runs validation to test actual output vs expected output for attributes collection vs attribute context.
     */
    protected static async saveActualEntityAndValidateWithExpected(expectedPath: string, actualResolvedEntityDef: CdmEntityDefinition): Promise<void> {
        const options: copyOptions = new copyOptions();
        options.saveConfigFile = false;
        await actualResolvedEntityDef.inDocument.saveAsAsync(actualResolvedEntityDef.inDocument.name, false, options);
        const actualPath: string = actualResolvedEntityDef.ctx.corpus.storage.corpusPathToAdapterPath(actualResolvedEntityDef.inDocument.atCorpusPath);
        const actualCtx = JSON.parse(fs.readFileSync(actualPath, 'utf8'));
        const expectedCtx = JSON.parse(fs.readFileSync(expectedPath, 'utf8'));
        testHelper.assertObjectContentEquality(expectedCtx, actualCtx);
    }
}