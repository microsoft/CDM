// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CardinalitySettings,
    CdmCorpusDefinition,
    CdmDataTypeReference,
    CdmDocumentDefinition,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    CdmPurposeReference,
    cdmStatusLevel,
    CdmTypeAttributeDefinition,
    resolveOptions,
    StringUtils
} from '../../../internal';
import { testHelper } from '../../testHelper';

/**
 * Various projections scenarios, partner scenarios, bug fixes
 */
describe('Cdm/Projection/ProjectionMiscellaneousTest', () => {
    const resOptsCombinations: Set<string>[] = [
        new Set([]),
        new Set(['referenceOnly']),
        new Set(['normalized']),
        new Set(['structured']),
        new Set(['referenceOnly', 'normalized']),
        new Set(['referenceOnly', 'structured']),
        new Set(['normalized', 'structured']),
        new Set(['referenceOnly', 'normalized', 'structured'])
    ];

    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestProjectionMiscellaneous';

    /**
     * Test case scenario for Bug #24 from the projections internal bug bash
     * Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/24
     */
    it('TestInvalidOperationType', async () => {
        const testName: string = 'TestInvalidOperationType';

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            if (!StringUtils.equalsWithIgnoreCase('ProjectionPersistence | Invalid operation type \'replaceAsForeignKey11111\'. | FromData', message)) {
                fail(message);
            }
        }, cdmStatusLevel.warning);

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('default.manifest.cdm.json');

        // Raise error: 'ProjectionPersistence | Invalid operation type 'replaceAsForeignKey11111'. | FromData',
        // when attempting to load a projection with an invalid operation
        const entityName: string = 'SalesNestedFK';
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entity)
            .toBeTruthy();
    });

    /**
     * Test case scenario for Bug #23 from the projections internal bug bash
     * Reference Link: https://commondatamodel.visualstudio.com/CDM/_workitems/edit/23
     */
    it('TestZeroMinimumCardinality', async () => {
        const testName: string = 'TestZeroMinimumCardinality';

        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        corpus.setEventCallback((statusLevel: cdmStatusLevel, message: string) => {
            fail(message);
        }, cdmStatusLevel.warning);

        // Create Local Root Folder
        const localRoot: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        // Create Manifest
        const manifest: CdmManifestDefinition = corpus.MakeObject<CdmManifestDefinition>(cdmObjectType.manifestDef, 'default');
        localRoot.documents.push(manifest, 'default.manifest.cdm.json');

        const entityName: string = 'TestEntity';

        // Create Entity
        const entity: CdmEntityDefinition = corpus.MakeObject<CdmEntityDefinition>(cdmObjectType.entityDef, entityName);
        entity.extendsEntity = corpus.MakeRef<CdmEntityReference>(cdmObjectType.entityRef, 'CdmEntity', true);

        // Create Entity Document
        const document: CdmDocumentDefinition = corpus.MakeObject<CdmDocumentDefinition>(cdmObjectType.documentDef, `${entityName}.cdm.json`, false);
        document.definitions.push(entity);
        localRoot.documents.push(document, document.getName());
        manifest.entities.push(entity);

        const attributeName: string = 'testAttribute';
        const attributeDataType: string = 'string';
        const attributePurpose: string = 'hasA';

        // Create Type Attribute
        const attribute: CdmTypeAttributeDefinition = corpus.MakeObject<CdmTypeAttributeDefinition>(cdmObjectType.typeAttributeDef, attributeName, false);
        attribute.dataType = corpus.MakeRef<CdmDataTypeReference>(cdmObjectType.dataTypeRef, attributeDataType, true);
        attribute.purpose = corpus.MakeRef<CdmPurposeReference>(cdmObjectType.purposeRef, attributePurpose, true);
        attribute.displayName = attributeName;

        if (entity) {
            entity.attributes.push(attribute);
        }

        attribute.cardinality = new CardinalitySettings(attribute);
        attribute.cardinality.minimum = '0';
        attribute.cardinality.maximum = '*';

        expect(attribute.isNullable)
            .toBeTruthy();
    });
});
