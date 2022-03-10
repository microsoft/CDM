// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmLocalEntityDeclarationDefinition } from '../../../Cdm/CdmLocalEntityDeclarationDefinition';
import {
    CdmArgumentDefinition,
    CdmManifestDefinition,
    CdmTraitReference,
    CdmTraitReferenceBase
} from '../../../internal';
import { generateManifest } from './CdmCollectionHelperFunctions';

describe('Cdm/CdmCollection/CdmArgumentCollection', () => {
    it('TestCdmArgumentCollectionAdd', () => {
        const trait: CdmTraitReference = generateTrait();

        const argumentDefinition: CdmArgumentDefinition = new CdmArgumentDefinition(trait.ctx, undefined);

        trait.resolvedArguments = true;
        expect(trait.arguments.length)
            .toEqual(0);
        const addedArgument: CdmArgumentDefinition = trait.arguments.push(argumentDefinition);
        expect(addedArgument)
            .toEqual(argumentDefinition);
        expect(trait.arguments.length)
            .toEqual(1);
        expect(trait.arguments.allItems[0])
            .toEqual(argumentDefinition);
        expect(trait.resolvedArguments)
            .toBeFalsy();
        expect(trait.arguments.allItems[0].owner)
            .toEqual(trait);

        trait.resolvedArguments = true;
        trait.arguments.push('nameOfTrait', 'valueOfTrait');
        expect(trait.arguments.length)
            .toEqual(2);
        expect(trait.arguments.allItems[1].name)
            .toEqual('nameOfTrait');
        expect(trait.arguments.allItems[1].value)
            .toEqual('valueOfTrait');
        expect(trait.arguments.allItems[1].owner)
            .toEqual(trait);
    });

    it('TestCdmArgumentCollectionInsert', () => {
        const trait: CdmTraitReference = generateTrait();
        const toInsert: CdmArgumentDefinition = new CdmArgumentDefinition(trait.ctx, 'nameOfArg');

        const arg1: CdmArgumentDefinition = trait.arguments.push('arg1');
        const arg2: CdmArgumentDefinition = trait.arguments.push('arg2');

        trait.resolvedArguments = true;

        trait.arguments.insert(1, toInsert);
        expect(trait.arguments.length)
            .toEqual(3);
        expect(trait.resolvedArguments)
            .toBeFalsy();
        expect(trait.arguments.allItems[0])
            .toEqual(arg1);
        expect(trait.arguments.allItems[1])
            .toEqual(toInsert);
        expect(trait.arguments.allItems[2])
            .toEqual(arg2);
        expect(trait.arguments.allItems[1].owner)
            .toEqual(trait);
        expect(trait.arguments.allItems[1].name)
            .toEqual('nameOfArg');
    });

    it('TestCdmArgumentCollectionAddRange', () => {
        const trait: CdmTraitReference = generateTrait();
        trait.resolvedArguments = true;

        const argList: CdmArgumentDefinition[] = [];
        let argumentDefinition: CdmArgumentDefinition = new CdmArgumentDefinition(trait.ctx, undefined);
        argumentDefinition.name = 'Arg1';
        argumentDefinition.value = '123';

        argList.push(argumentDefinition);

        const valOfArg2: CdmManifestDefinition = generateManifest('C:\\Nothing');
        argumentDefinition = new CdmArgumentDefinition(trait.ctx, undefined);
        argumentDefinition.name = 'arg2';
        argumentDefinition.value = valOfArg2;
        trait.resolvedArguments = true;
        argList.push(argumentDefinition);

        trait.arguments.concat(argList);

        expect(trait.arguments.length)
            .toEqual(2);
        expect(trait.resolvedArguments)
            .toEqual(false);
        expect(trait.arguments.allItems[0].name)
            .toEqual('Arg1');
        expect(trait.arguments.item('Arg1').value)
            .toEqual('123');
        expect(trait.arguments.allItems[0].owner)
            .toEqual(trait);
        expect(trait.arguments.allItems[1].name)
            .toEqual('arg2');
        expect(trait.arguments.item('arg2').value)
            .toEqual(valOfArg2);
        expect(trait.arguments.allItems[1].owner)
            .toEqual(trait);
    });

    it('TestCdmArgumentCollectionFetchValueOrOnlyValue', () => {
        const trait: CdmTraitReference = generateTrait();

        trait.resolvedArguments = true;
        trait.arguments.push(undefined, 'valueOfTrait');
        let value: any = trait.arguments.fetchValue('nameOfTrait');
        // This is what is needed by current code.
        expect(value)
            .toEqual('valueOfTrait');

        const argumentDefinition: CdmArgumentDefinition = new CdmArgumentDefinition(trait.ctx, undefined);

        trait.resolvedArguments = true;
        trait.arguments.push(argumentDefinition);

        trait.resolvedArguments = true;
        trait.arguments.push('traitName', 'value of a named trait');

        value = trait.arguments.fetchValue('traitName');
        expect(value)
            .toEqual('value of a named trait');
    });

    it('TestCdmArgumentCollectionUpdateArgument', () => {
        const trait: CdmTraitReference = generateTrait();

        trait.arguments.push('nameOfTrait', 'valueOfTrait');
        trait.arguments.push('nameOfOtherTrait', 'ValueOfOtherTrait');

        trait.arguments.updateArgument('nameOfOtherTrait', 'UpdatedValue');
        trait.arguments.updateArgument('ThirdArgumentName', 'ThirdArgumentValue');

        expect(trait.arguments.length)
            .toEqual(3);
        expect(trait.arguments.allItems[0].value)
            .toEqual('valueOfTrait');
        expect(trait.arguments.allItems[1].value)
            .toEqual('UpdatedValue');
        expect(trait.arguments.allItems[2].name)
            .toEqual('ThirdArgumentName');
        expect(trait.arguments.allItems[2].value)
            .toEqual('ThirdArgumentValue');
        expect(trait.arguments.allItems[2].owner)
            .toEqual(trait);
    });

    it('TestCdmCollectionAddPopulatesInDocumentWithVisit', () => {
        const manifest: CdmManifestDefinition = generateManifest('C:/nothing');
        const entityReference: CdmLocalEntityDeclarationDefinition = new CdmLocalEntityDeclarationDefinition(manifest.ctx, 'entityName');
        const trait: CdmTraitReferenceBase = entityReference.exhibitsTraits.push('theTrait');
        const argument: CdmArgumentDefinition = (trait as CdmTraitReference).arguments.push('GreatArgumentName', 'GreatValue');
        manifest.entities.push(entityReference);

        expect(manifest)
            .toBe(manifest.inDocument);
        expect(manifest)
            .toBe(entityReference.inDocument);
        expect(manifest)
            .toBe(trait.inDocument);
        expect(manifest)
            .toBe(argument.inDocument);
    });

    function generateTrait(): CdmTraitReference {
        const manifest: CdmManifestDefinition = generateManifest('C:\\Nothing');

        return new CdmTraitReference(manifest.ctx, 'traitName', false, false);
    }
});
