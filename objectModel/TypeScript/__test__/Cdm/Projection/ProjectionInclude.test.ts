// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmEntityAttributeDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmOperationIncludeAttributes,
    CdmProjection
} from '../../../internal';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';
import { TypeAttributeParam } from './TypeAttributeParam';
import { ProjectionOMTestUtil } from './ProjectionOMTestUtil';

/**
 * A test class for testing the IncludeAttributes operation in a projection as well as SelectsSomeTakeNames in a resolution guidance
 */
describe('Cdm/Projection/ProjectionIncludeTest', () => {
    /**
     * All possible combinations of the different resolution directives
     */
    const resOptsCombinations: string[][] = [
        [],
        ['referenceOnly'],
        ['normalized'],
        ['structured'],
        ['referenceOnly', 'normalized'],
        ['referenceOnly', 'structured'],
        ['normalized', 'structured'],
        ['referenceOnly', 'normalized', 'structured']
    ];

    /**
     * Path to foundations
     */
    const foundationJsonPath: string = 'cdm:/foundations.cdm.json';

    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestProjectionInclude';

    /**
     * Test for entity extends with resolution guidance with a SelectsSomeTakeNames
     */
    it('TestExtends', async () => {
        const testName: string = 'TestExtends';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for entity extends with projection with an includeAttributes operation
     */
    it('TestExtendsProj', async () => {
        const testName: string = 'TestExtendsProj';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for entity attribute with resolution guidance with a SelectsSomeTakeNames
     */
    it('TestEA', async () => {
        const testName: string = 'TestEA';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for entity attribute with projection with an includeAttributes operation
     */
    it('TestEAProj', async () => {
        const testName: string = 'TestEAProj';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for object model
     */
    it('TestEAProjOM', async () => {
        const className: string = 'ProjectionIncludeTest';
        const testName: string = 'TestEAProjOM';
        const entityName_RGB: string = 'RGB';

        const attributeParams_RGB: TypeAttributeParam[] = [];
        attributeParams_RGB.push(new TypeAttributeParam('Red', 'string', 'hasA'));
        attributeParams_RGB.push(new TypeAttributeParam('Green', 'string', 'hasA'));
        attributeParams_RGB.push(new TypeAttributeParam('Blue', 'string', 'hasA'));
        attributeParams_RGB.push(new TypeAttributeParam('IsGrayscale', 'boolean', 'hasA'));

        const entityName_Color: string = 'Color';
        const attributeParams_Color: TypeAttributeParam[] = [];
        attributeParams_Color.push(new TypeAttributeParam('ColorName', 'string', 'identifiedBy'));

        const includeAttributeNames: string[] = [];
        includeAttributeNames.push('Red');
        includeAttributeNames.push('Green');
        includeAttributeNames.push('Blue');

        const util: ProjectionOMTestUtil = new ProjectionOMTestUtil(className, testName);

        const entity_RGB: CdmEntityDefinition = util.CreateBasicEntity(entityName_RGB, attributeParams_RGB);
        util.validateBasicEntity(entity_RGB, entityName_RGB, attributeParams_RGB);

        const entity_Color: CdmEntityDefinition = util.CreateBasicEntity(entityName_Color, attributeParams_Color);
        util.validateBasicEntity(entity_Color, entityName_Color, attributeParams_Color);

        const projection_RGBColor: CdmProjection = util.createProjection(entity_RGB.entityName);
        const operation_IncludeAttributes: CdmOperationIncludeAttributes = util.createOperationInputAttribute(projection_RGBColor, includeAttributeNames);
        const projectionEntityRef_RGBColor: CdmEntityReference = util.createProjectionInlineEntityReference(projection_RGBColor);

        const entityAttribute_RGBColor: CdmEntityAttributeDefinition = util.createEntityAttribute('RGBColor', projectionEntityRef_RGBColor);
        entity_Color.attributes.push(entityAttribute_RGBColor);

        for (const resOpts of resOptsCombinations) {
            await util.getAndValidateResolvedEntity(entity_Color, resOpts);
        }

        util.defaultManifest.saveAsAsync(util.manifestDocName, true);
    });

    /**
     * Test for leaf level projection
     */
    it('TestNested1of3Proj', async () => {
        const testName: string = 'TestNested1of3Proj';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for mid level projection
     */
    it('TestNested2of3Proj', async () => {
        const testName: string = 'TestNested2of3Proj';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for top level projection
     */
    it('TestNested3of3Proj', async () => {
        const testName: string = 'TestNested3of3Proj';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for Condition = 'false'
     */
    it('TestConditionProj', async () => {
        const testName: string = 'TestConditionProj';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for SelectsSomeTakeNames by Group Name
     */
    it('TestGroupName', async () => {
        const testName: string = 'TestGroupName';
        const entityName: string = 'Product';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for include attributes operation by Group Name
     */
    it('TestGroupNameProj', async () => {
        const testName: string = 'TestGroupNameProj';
        const entityName: string = 'Product';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for SelectsSomeTakeNames from an Array
     */
    it('TestArray', async () => {
        const testName: string = 'TestArray';
        const entityName: string = 'Sales';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for SelectsSomeTakeNames from a renamed Array
     */
    it('TestArrayRename', async () => {
        const testName: string = 'TestArrayRename';
        const entityName: string = 'Sales';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for Include Attributes from an Array
     */
    it('TestArrayProj', async () => {
        const testName: string = 'TestArrayProj';
        const entityName: string = 'Sales';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for SelectsSomeTakeNames from a Polymorphic Source
     */
    it('TestPolymorphic', async () => {
        const testName: string = 'TestPolymorphic';
        const entityName: string = 'Person';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for Include Attributes from a Polymorphic Source
     */
    it('TestPolymorphicProj', async () => {
        const testName: string = 'TestPolymorphicProj';
        const entityName: string = 'Person';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for entity attribute with resolution guidance with an empty SelectsSomeTakeNames list
     */
    it('TestEmpty', async () => {
        const testName: string = 'TestEmpty';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for entity attribute with projection with an empty includeAttributes operation list
     */
    it('TestEmptyProj', async () => {
        const testName: string = 'TestEmptyProj';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for Nested Projections that include then exclude some attributes
     */
    it('TestNestedIncludeExcludeProj', async () => {
        const testName: string = 'TestNestedIncludeExcludeProj';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });

    /**
     * Test for Projections with include and exclude
     */
    it('TestIncludeExcludeProj', async () => {
        const testName: string = 'TestIncludeExcludeProj';
        const entityName: string = 'Color';
        const corpus: CdmCorpusDefinition = projectionTestUtils.getLocalCorpus(testsSubpath, testName);

        for (const resOpt of resOptsCombinations) {
            await projectionTestUtils.loadEntityForResolutionOptionAndSave(corpus, testName, testsSubpath, entityName, resOpt);
        }
    });
});
