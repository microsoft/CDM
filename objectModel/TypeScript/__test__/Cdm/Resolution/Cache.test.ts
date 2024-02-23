// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmTypeAttributeDefinition } from 'Cdm/CdmTypeAttributeDefinition';
import { CdmAttributeGroupDefinition } from '../../../Cdm/CdmAttributeGroupDefinition';
import { CdmAttributeGroupReference } from '../../../Cdm/CdmAttributeGroupReference';
import { CdmCorpusDefinition } from '../../../Cdm/CdmCorpusDefinition';
import { CdmEntityDefinition } from '../../../Cdm/CdmEntityDefinition';
import { AttributeResolutionDirectiveSet } from '../../../Utilities/AttributeResolutionDirectiveSet';
import { resolveOptions } from '../../../Utilities/resolveOptions';
import { testHelper } from '../../testHelper';
import { cdmLogCode } from '../../../Enums/cdmLogCode';

describe('Cdm/Resolution/Cache', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Resolution/CacheTest';

    /**
     * use the same test data for all tests
     */
    const testNamePath: string = 'TestMaxDepth';

    /**
     * Test when cached value hit the max depth, we are now getting
     * attributes where max depth should not be reached
     */
    it('TestMaxDepthCached', async () => {
        var expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.WarnMaxDepthExceeded]);
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testNamePath, undefined, false, expectedLogCodes);
        const aEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('A.cdm.json/A');
        const bEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('B.cdm.json/B');
        const cEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('C.cdm.json/C');
        const dEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('D.cdm.json/D');

        // when resolving A, B should be cached and it should exclude any attributes from D because
        // it is outside of the maxDepth
        const resA: CdmEntityDefinition = await aEnt.createResolvedEntityAsync('resA', new resolveOptions(
            aEnt.inDocument,
            new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'structured']))
        ));
        // ensure that when resolving B on its own, attributes from D are included
        const resB: CdmEntityDefinition = await bEnt.createResolvedEntityAsync('resB', new resolveOptions(
            bEnt.inDocument,
            new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'structured']))
        ));

        // check the attributes found in D from resolving A
        const bAttInA: CdmAttributeGroupDefinition =
            (resA.attributes.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        const cAttInA: CdmAttributeGroupDefinition =
            (bAttInA.members.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        const dAttInA: CdmAttributeGroupDefinition =
            (cAttInA.members.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        expect(dAttInA.members.length)
            .toBe(1);
        // check that the attribute in D is a foreign key atttribute
        const dIdAttFromA: CdmTypeAttributeDefinition = dAttInA.members.allItems[0] as CdmTypeAttributeDefinition;
        expect(dIdAttFromA.name)
            .toBe('dId');
        expect(dIdAttFromA.appliedTraits.item('is.linkedEntity.identifier'))
            .not
            .toBeUndefined();

        // check the attributes found in D from resolving B
        const cAttInB: CdmAttributeGroupDefinition =
            (resB.attributes.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        const dAttInB: CdmAttributeGroupDefinition =
            (cAttInB.members.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        expect(dAttInB.members.length)
            .toBe(2);
        // check that the attribute in D is not a foreign key atttribute
        const dIdAttFromB: CdmTypeAttributeDefinition = dAttInB.members.allItems[0] as CdmTypeAttributeDefinition;
        expect(dIdAttFromB.name)
            .toBe('dId');
        expect(dIdAttFromB.appliedTraits.item('is.linkedEntity.identifier'))
            .toBeUndefined();
    });

    /**
     * Test when cached value did not hit max depth and we are
     * now getting attributes where max depth should be hit
     */
    it('TestNonMaxDepthCached', async () => {
        var expectedLogCodes = new Set<cdmLogCode>([cdmLogCode.WarnMaxDepthExceeded]);
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testNamePath, undefined, false, expectedLogCodes);
        const aEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('A.cdm.json/A');
        const bEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('B.cdm.json/B');
        const cEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('C.cdm.json/C');
        const dEnt: CdmEntityDefinition = await cdmCorpus.fetchObjectAsync('D.cdm.json/D');

        // when resolving B, it should include any attributes from D because
        // it is outside of the maxDepth
        const resB: CdmEntityDefinition = await bEnt.createResolvedEntityAsync('resB', new resolveOptions(
            bEnt.inDocument,
            new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'structured']))
        ));
        // ensure that when resolving A, attributes from D are excluded because they are beyond the max depth
        const resA: CdmEntityDefinition = await aEnt.createResolvedEntityAsync('resA', new resolveOptions(
            aEnt.inDocument,
            new AttributeResolutionDirectiveSet(new Set<string>(['normalized', 'structured']))
        ));

        // check the attributes found in D from resolving A
        const bAttInA: CdmAttributeGroupDefinition =
            (resA.attributes.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        const cAttInA: CdmAttributeGroupDefinition =
            (bAttInA.members.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        const dAttInA: CdmAttributeGroupDefinition =
            (cAttInA.members.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        expect(dAttInA.members.length)
            .toBe(1);
        // check that the attribute in D is a foreign key atttribute
        const dIdAttFromA: CdmTypeAttributeDefinition = dAttInA.members.allItems[0] as CdmTypeAttributeDefinition;
        expect(dIdAttFromA.name)
            .toBe('dId');
        expect(dIdAttFromA.appliedTraits.item('is.linkedEntity.identifier'))
            .not
            .toBeUndefined();

        // check the attributes found in D from resolving B
        const cAttInB: CdmAttributeGroupDefinition =
            (resB.attributes.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        const dAttInB: CdmAttributeGroupDefinition =
            (cAttInB.members.allItems[1] as CdmAttributeGroupReference).explicitReference as CdmAttributeGroupDefinition;
        expect(dAttInB.members.length)
            .toBe(2);
        // check that the attribute in D is not a foreign key atttribute and all other attributes from D exist
        const dIdAttFromB: CdmTypeAttributeDefinition = dAttInB.members.allItems[0] as CdmTypeAttributeDefinition;
        expect(dIdAttFromB.name)
            .toBe('dId');
        expect(dIdAttFromB.appliedTraits.item('is.linkedEntity.identifier'))
            .toBeUndefined();
    });
});
