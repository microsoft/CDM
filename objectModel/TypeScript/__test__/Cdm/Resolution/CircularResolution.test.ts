// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmAttributeGroupDefinition } from '../../../Cdm/CdmAttributeGroupDefinition';
import { CdmAttributeGroupReference } from '../../../Cdm/CdmAttributeGroupReference';
import { CdmCorpusDefinition } from '../../../Cdm/CdmCorpusDefinition';
import { CdmE2ERelationship } from '../../../Cdm/CdmE2ERelationship';
import { CdmEntityDefinition } from '../../../Cdm/CdmEntityDefinition';
import { CdmManifestDefinition } from '../../../Cdm/CdmManifestDefinition';
import { CdmTypeAttributeDefinition } from '../../../Cdm/CdmTypeAttributeDefinition';
import { AttributeResolutionDirectiveSet } from '../../../Utilities/AttributeResolutionDirectiveSet';
import { resolveOptions } from '../../../Utilities/resolveOptions';
import { testHelper } from '../../testHelper';

describe('Cdm/Resolution/CircularResolution', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Resolution/CircularResolutionTest';

    /**
     * Test proper behavior for entities that contain circular references
     */
    it('TestCircularReference', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestCircularReference');
        const customer: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync<CdmEntityDefinition>('local:/Customer.cdm.json/Customer');
        const resCustomerStructured: CdmEntityDefinition =
            await customer.createResolvedEntityAsync('resCustomer', new resolveOptions(
                customer.inDocument,
                new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'structured', 'noMaxDepth']))
            ));

        // check that the circular reference attribute has a single id attribute
        const storeGroupAtt: CdmAttributeGroupDefinition =
            (resCustomerStructured.attributes.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        const customerGroupAtt: CdmAttributeGroupDefinition =
            (storeGroupAtt.members.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        expect(customerGroupAtt.members.length)
            .toBe(1);
        expect((customerGroupAtt.members.allItems[0] as CdmTypeAttributeDefinition).name)
            .toBe('customerId');
    });

    /**
     * Test that relationship is created when an entity contains a reference to itself
     */
    it('TestSelfReference', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestSelfReference');
        const manifest: CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('local:/SelfReference.manifest.cdm.json');
        await cdmCorpus.calculateEntityGraphAsync(manifest);
        await manifest.populateManifestRelationshipsAsync();

        expect(manifest.relationships.length)
            .toBe(1);
        const rel: CdmE2ERelationship = manifest.relationships.allItems[0];
        expect(rel.fromEntity)
            .toBe('CustTable.cdm.json/CustTable');
        expect(rel.toEntity)
            .toBe('CustTable.cdm.json/CustTable');
        expect(rel.fromEntityAttribute)
            .toBe('FactoringAccountRelationship');
        expect(rel.toEntityAttribute)
            .toBe('PaymTermId');
    });
});
