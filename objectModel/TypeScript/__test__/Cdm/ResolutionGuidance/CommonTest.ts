// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
    CdmEntityDefinition,
    cdmStatusLevel,
    resolveOptions
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';
import { AttributeContextExpectedValue, AttributeExpectedValue, ObjectValidator } from '../../Utilities/ObjectValidator';

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

            const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
            corpus.setEventCallback(() => { }, cdmStatusLevel.warning);
            corpus.storage.mount('localInput', new LocalAdapter(testInputPath));
            corpus.storage.mount('cdm', new LocalAdapter(this.schemaDocsPath));
            corpus.storage.defaultNamespace = 'localInput';

            const srcEntityDef: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`localInput:/${sourceEntityName}.cdm.json/${sourceEntityName}`) as CdmEntityDefinition;
            expect(srcEntityDef !== null)
                .toBeTruthy();

            let resOpt: resolveOptions;
            let resolvedEntityDef: CdmEntityDefinition;
            let outputEntityName: string = '';
            let outputEntityFileName: string = '';
            let entityFileName: string = '';

            if (expectedContext_default && expected_default) {
                entityFileName = 'default';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>()));
                outputEntityName = `${sourceEntityName}_Resolved_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt);
                this.validateOutputWithValues(expectedContext_default, expected_default, resolvedEntityDef);
            }

            if (expectedContext_normalized && expected_normalized) {
                entityFileName = 'normalized';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['normalized'])));
                outputEntityName = `${sourceEntityName}_Resolved_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt);
                this.validateOutputWithValues(expectedContext_normalized, expected_normalized, resolvedEntityDef);
            }

            if (expectedContext_referenceOnly && expected_referenceOnly) {
                entityFileName = 'referenceOnly';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly'])));
                outputEntityName = `${sourceEntityName}_Resolved_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt);
                this.validateOutputWithValues(expectedContext_referenceOnly, expected_referenceOnly, resolvedEntityDef);
            }

            if (expectedContext_structured && expected_structured) {
                entityFileName = 'structured';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['structured'])));
                outputEntityName = `${sourceEntityName}_Resolved_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt);
                this.validateOutputWithValues(expectedContext_structured, expected_structured, resolvedEntityDef);
            }

            if (expectedContext_normalized_structured && expected_normalized_structured) {
                entityFileName = 'normalized_structured';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'structured'])));
                outputEntityName = `${sourceEntityName}_Resolved_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt);
                this.validateOutputWithValues(expectedContext_normalized_structured, expected_normalized_structured, resolvedEntityDef);
            }

            if (expectedContext_referenceOnly_normalized && expected_referenceOnly_normalized) {
                entityFileName = 'referenceOnly_normalized';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly', 'normalized'])));
                outputEntityName = `${sourceEntityName}_Resolved_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt);
                this.validateOutputWithValues(expectedContext_referenceOnly_normalized, expected_referenceOnly_normalized, resolvedEntityDef);
            }

            if (expectedContext_referenceOnly_structured && expected_referenceOnly_structured) {
                entityFileName = 'referenceOnly_structured';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly', 'structured'])));
                outputEntityName = `${sourceEntityName}_Resolved_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt);
                this.validateOutputWithValues(expectedContext_referenceOnly_structured, expected_referenceOnly_structured, resolvedEntityDef);
            }

            if (expectedContext_referenceOnly_normalized_structured && expected_referenceOnly_normalized_structured) {
                entityFileName = 'referenceOnly_normalized_structured';
                resOpt = new resolveOptions(srcEntityDef.inDocument, new AttributeResolutionDirectiveSet(new Set<string>(['referenceOnly', 'normalized', 'structured'])));
                outputEntityName = `${sourceEntityName}_Resolved_${entityFileName}`;
                outputEntityFileName = `${outputEntityName}.cdm.json`;
                resolvedEntityDef = await srcEntityDef.createResolvedEntityAsync(outputEntityName, resOpt);
                this.validateOutputWithValues(expectedContext_referenceOnly_normalized_structured, expected_referenceOnly_normalized_structured, resolvedEntityDef);
            }

        } catch (err) {
            expect(true)
                .toEqual(false);
        }
    }

    /**
     * Runs validation to test actual output vs expected output for attributes collection vs attribute context.
     */
    protected static validateOutputWithValues(expectedContext: AttributeContextExpectedValue, expectedAttributes: AttributeExpectedValue[], actualResolvedEntityDef: CdmEntityDefinition): void {
        ObjectValidator.validateAttributesCollection(expectedAttributes, actualResolvedEntityDef.attributes);
        ObjectValidator.validateAttributeContext(expectedContext, actualResolvedEntityDef.attributeContext);
    }
}