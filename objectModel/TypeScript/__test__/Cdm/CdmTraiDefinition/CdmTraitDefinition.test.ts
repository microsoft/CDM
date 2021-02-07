// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmTraitDefinition, CdmTraitReference, CdmCorpusDefinition } from '../../../internal';

describe('Cdm/CdmTraitDefinition/CdmTraitDefinition', () => {
    it('TestExtendsTraitPropertyOptional', () => {
        const corpus = new CdmCorpusDefinition();
        const extendTraitRef1 = new CdmTraitReference(corpus.ctx, 'testExtendTraitName1', true, false);
        const extendTraitRef2 = new CdmTraitReference(corpus.ctx, 'testExtendTraitName2', true, false);
        const traitDefinition = new CdmTraitDefinition(corpus.ctx, 'testTraitName', extendTraitRef1);
        
        expect(traitDefinition.extendsTrait)
            .toEqual(extendTraitRef1);
        traitDefinition.extendsTrait = undefined;
        expect(traitDefinition.extendsTrait)
            .toBeFalsy;

        traitDefinition.extendsTrait = extendTraitRef2;
        expect(traitDefinition.extendsTrait)
            .toEqual(extendTraitRef2);
        traitDefinition.extendsTrait = undefined;
        expect(traitDefinition.extendsTrait)
            .toBeFalsy;
    })
})