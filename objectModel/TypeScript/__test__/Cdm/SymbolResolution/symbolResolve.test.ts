// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmAttributeGroupDefinition } from '../../../Cdm/CdmAttributeGroupDefinition';
import { CdmTraitDefinition } from '../../../Cdm/CdmTraitDefinition';
import {
    CdmCorpusDefinition,
    CdmEntityDefinition,
    CdmObjectBase,
    cdmObjectType,
    cdmStatusLevel,
    resolveOptions
} from '../../../internal';
import { isAttributeGroupDefinition, isAttributeGroupReference, isCdmTraitDefinition, isCdmTraitReference, isTypeAttributeDefinition } from '../../../Utilities/cdmObjectTypeGuards';
import { testHelper } from '../../testHelper';
import { resolveContextScope } from '../../../Utilities/resolveContextScope';

describe('Cdm/SymbolResolution/SymbolResolve', () => {
    const testsSubpath: string = 'Cdm/SymbolResolution';

    /**
     * Test that symbols are set correctly and that object can be correctly fetched using the symbols
     */
    it('TestSymbolResolution', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestSymbolResolution');

        // load the file
        const resOpt: resolveOptions = new resolveOptions();
        resOpt.strictValidation = true;
        const ent: CdmEntityDefinition = await corpus.fetchObjectAsync('local:/symbolEntity.cdm.json/symbolEnt', null, resOpt);
        resOpt.wrtDoc = ent.inDocument;

        // resolve a reference to the trait object
        const traitDef: CdmObjectBase = corpus.resolveSymbolReference(
            resOpt,
            ent.inDocument,
            'symbolEnt/exhibitsTraits/someTraitOnEnt',
            cdmObjectType.traitDef,
            false
        );

        expect(isCdmTraitDefinition(traitDef))
            .toBeTruthy();

        // resolve a path to the reference object that contains the trait
        const traitRef: CdmObjectBase = corpus.resolveSymbolReference(
            resOpt,
            ent.inDocument,
            'symbolEnt/exhibitsTraits/someTraitOnEnt/(ref)',
            cdmObjectType.traitDef,
            false
        );

        expect(isCdmTraitReference(traitRef))
            .toBeTruthy();

        // fetchObjectDefinition on a path to a reference should fetch the actual object
        const traitRefDefinition: CdmTraitDefinition = traitRef.fetchObjectDefinition<CdmTraitDefinition>(resOpt);
        const traitDefDefinition: CdmTraitDefinition = traitDef.fetchObjectDefinition<CdmTraitDefinition>(resOpt);
        expect(traitRefDefinition)
            .toBe(traitDef);
        expect(traitDefDefinition)
            .toBe(traitDef);

        const groupRef: CdmObjectBase = corpus.resolveSymbolReference(
            resOpt,
            ent.inDocument,
            'symbolEnt/hasAttributes/someGroupRef/(ref)',
            cdmObjectType.attributeGroupDef,
            false
        );

        expect(isAttributeGroupReference(groupRef))
            .toBeTruthy();

        const groupDef: CdmObjectBase = corpus.resolveSymbolReference(
            resOpt,
            ent.inDocument,
            'symbolEnt/hasAttributes/someGroupRef',
            cdmObjectType.attributeGroupDef,
            false
        );

        expect(isAttributeGroupDefinition(groupDef))
            .toBeTruthy();

        // calling fetchObjectDefinition on a symbol to a ref or def should both give the definition
        const groupRefDefinition: CdmAttributeGroupDefinition = groupRef.fetchObjectDefinition<CdmAttributeGroupDefinition>(resOpt);
        const groupDefDefinition: CdmAttributeGroupDefinition = groupDef.fetchObjectDefinition<CdmAttributeGroupDefinition>(resOpt);
        expect(groupRefDefinition)
            .toBe(groupDef);
        expect(groupDefDefinition)
            .toBe(groupDef);

        const typeAtt: CdmObjectBase = corpus.resolveSymbolReference(
            resOpt,
            ent.inDocument,
            'symbolEnt/hasAttributes/someGroupRef/members/someAttribute',
            cdmObjectType.attributeGroupDef,
            false
        );

        expect(isTypeAttributeDefinition(typeAtt))
            .toBeTruthy();

        done();
    });
});
