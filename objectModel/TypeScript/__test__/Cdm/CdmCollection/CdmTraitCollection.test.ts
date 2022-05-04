// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmManifestDefinition,
    CdmTraitDefinition,
    CdmTraitReference,
    CdmTraitReferenceBase,
    constants,
    ResolvedTraitSetBuilder
} from '../../../internal';
import { generateManifest } from './CdmCollectionHelperFunctions';

// tslint:disable-next-line: max-func-body-length
describe('Cdm/CdmCollection/CdmTraitCollection', () => {
    it('TestCdmTraitCollectionAdd', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'traitName', undefined);
        const otherTrait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'Name of other trait', undefined);
        manifest.traitCache = new Map<string, ResolvedTraitSetBuilder>();

        const addedTrait: CdmTraitReferenceBase = manifest.exhibitsTraits.push(trait);
        const addedOtherTrait: CdmTraitReferenceBase = manifest.exhibitsTraits.push(otherTrait);
        const listOfArgs: [string, any][] = [[constants.INCREMENTAL_PATTERN_PARAMETER_NAME, 'test'], ['fullDataPartitionPatternName', 'name']]
        const addedIncrementalTrait: CdmTraitReferenceBase = manifest.exhibitsTraits.push(constants.INCREMENTAL_TRAIT_NAME, listOfArgs);

        expect(manifest.traitCache)
            .toBeUndefined();
        expect(manifest.exhibitsTraits.length)
            .toEqual(3);
        expect(manifest.exhibitsTraits.allItems[0].explicitReference)
            .toEqual(trait);
        expect(manifest.exhibitsTraits.allItems[1].explicitReference)
            .toEqual(otherTrait);
        expect(manifest.exhibitsTraits.allItems[0])
            .toEqual(addedTrait);
        expect(manifest.exhibitsTraits.allItems[1])
            .toEqual(addedOtherTrait);
        expect(manifest.exhibitsTraits.allItems[2])
            .toEqual(addedIncrementalTrait);
        expect((manifest.exhibitsTraits.allItems[2] as CdmTraitReference).arguments.length)
            .toEqual(2);
        expect((manifest.exhibitsTraits.allItems[2] as CdmTraitReference).arguments.fetchValue(constants.INCREMENTAL_PATTERN_PARAMETER_NAME))
            .toEqual('test');
        expect((manifest.exhibitsTraits.allItems[2] as CdmTraitReference).arguments.fetchValue('fullDataPartitionPatternName'))
            .toEqual('name');            
    });

    it('TestCdmTraitCollectionInsert', () => {
        const manifest: CdmManifestDefinition = generateManifest();
        const trait: CdmTraitReference = new CdmTraitReference(manifest.ctx, 'traitName', false, false);
        const otherTrait: CdmTraitReference = new CdmTraitReference(manifest.ctx, 'name of other trait', false, false);

        manifest.traitCache = new Map<string, ResolvedTraitSetBuilder>();

        manifest.exhibitsTraits.insert(0, trait);
        manifest.exhibitsTraits.insert(0, otherTrait);

        expect(manifest.traitCache)
            .toBeUndefined();
        expect(manifest.exhibitsTraits.length)
            .toEqual(2);
        expect(manifest.exhibitsTraits.allItems[0])
            .toEqual(otherTrait);
        expect(manifest.exhibitsTraits.allItems[1])
            .toEqual(trait);

        expect(manifest.exhibitsTraits.allItems[0].owner)
            .toEqual(manifest);
    });

    it('CdmTraitCollectionAddRange', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'traitName', undefined);
        const otherTrait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'name of other trait', undefined);

        const traitList: CdmTraitDefinition[] = [trait, otherTrait];

        manifest.exhibitsTraits.concat(traitList);

        expect(manifest.exhibitsTraits.length)
            .toEqual(2);
        expect(manifest.exhibitsTraits.allItems[0].explicitReference)
            .toEqual(trait);
        expect(manifest.exhibitsTraits.allItems[1].explicitReference)
            .toEqual(otherTrait);

        expect(manifest.exhibitsTraits.allItems[0].owner)
            .toEqual(manifest);
    });

    it('CdmTraitCollectionRemove', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'traitName', undefined);
        const otherTrait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'name of other trait', undefined);

        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);

        expect(manifest.exhibitsTraits.length)
            .toEqual(2);
        manifest.traitCache = new Map<string, ResolvedTraitSetBuilder>();
        let removed: boolean = manifest.exhibitsTraits.remove(trait);
        expect(removed)
            .toBeTruthy();
        expect(manifest.exhibitsTraits.length)
            .toEqual(1);
        expect(manifest.traitCache)
            .toBeUndefined();

        // try to remove a second time
        removed = manifest.exhibitsTraits.remove(trait);
        expect(removed)
            .toBeFalsy();
        expect(manifest.exhibitsTraits.length)
            .toEqual(1);
        expect(manifest.exhibitsTraits.allItems[0].explicitReference)
            .toEqual(otherTrait);

        removed = manifest.exhibitsTraits.remove('name of other trait');
        expect(removed)
            .toBeTruthy();
        expect(manifest.exhibitsTraits.length)
            .toEqual(0);

        manifest.exhibitsTraits.push(trait);
        expect(manifest.exhibitsTraits.length)
            .toEqual(1);

        removed = manifest.exhibitsTraits.remove(manifest.exhibitsTraits.allItems[0]);
        expect(removed)
            .toBeTruthy();
        expect(manifest.exhibitsTraits.length)
            .toEqual(0);
    });

    it('CdmTraitCollectionRemoveAt', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'traitName', undefined);
        const otherTrait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'name of other trait', undefined);

        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);
        manifest.traitCache = new Map<string, ResolvedTraitSetBuilder>();

        manifest.exhibitsTraits.remove(trait);
        expect(manifest.traitCache)
            .toBeUndefined();
        manifest.exhibitsTraits.push(trait);
        manifest.traitCache = new Map<string, ResolvedTraitSetBuilder>();
        manifest.exhibitsTraits.removeAt(1);
        expect(manifest.traitCache)
            .toBeUndefined();
        expect(manifest.exhibitsTraits.length)
            .toEqual(1);
        expect(manifest.exhibitsTraits.allItems[0].explicitReference)
            .toEqual(otherTrait);
    });

    it('CdmTraitCollectionIndexOf', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'traitName', undefined);
        const otherTrait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'name of other trait', undefined);

        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);

        let index: number = manifest.exhibitsTraits.indexOf(trait);
        expect(index)
            .toEqual(0);
        index = manifest.exhibitsTraits.indexOf(otherTrait);
        expect(index)
            .toEqual(1);

        index = manifest.exhibitsTraits.indexOf(manifest.exhibitsTraits.allItems[0]);
        expect(index)
            .toEqual(0);
        index = manifest.exhibitsTraits.indexOf(manifest.exhibitsTraits.allItems[1]);
        expect(index)
            .toEqual(1);

        index = manifest.exhibitsTraits.indexOf('traitName');
        expect(index)
            .toEqual(0);
        index = manifest.exhibitsTraits.indexOf('name of other trait');
        expect(index)
            .toEqual(1);
    });

    it('CdmTraitCollectionRemoveOnlyFromProperty', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitReference = new CdmTraitReference(manifest.ctx, 'traitName', undefined, undefined);
        const otherTrait: CdmTraitReference = new CdmTraitReference(manifest.ctx, 'name of other trait', undefined, undefined);

        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);

        expect(trait.isFromProperty)
            .toBeFalsy();
        expect(otherTrait.isFromProperty)
            .toBeFalsy();

        expect(manifest.exhibitsTraits.length)
            .toEqual(2);
        let removed: boolean = manifest.exhibitsTraits.remove(trait, true);
        expect(removed)
            .toBeFalsy();
        expect(manifest.exhibitsTraits.length)
            .toEqual(2);

        otherTrait.isFromProperty = true;

        removed = manifest.exhibitsTraits.remove(otherTrait, true);
        expect(removed)
            .toBeTruthy();
        expect(manifest.exhibitsTraits.length)
            .toEqual(1);
        expect(manifest.exhibitsTraits.allItems[0])
            .toEqual(trait);
    });

    it('CdmTraitCollectionRemovePrioritizeFromProperty', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitReference = new CdmTraitReference(manifest.ctx, 'traitName', undefined, undefined);
        const otherTrait: CdmTraitReference = new CdmTraitReference(manifest.ctx, 'name of other trait', undefined, undefined);

        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);

        const traitCopyFromProperty: CdmTraitReference = new CdmTraitReference(manifest.ctx, 'traitName', false, false);
        traitCopyFromProperty.isFromProperty = true;
        manifest.exhibitsTraits.push(traitCopyFromProperty);

        expect(trait.isFromProperty)
            .toBeFalsy();
        expect(otherTrait.isFromProperty)
            .toBeFalsy();
        expect(traitCopyFromProperty.isFromProperty)
            .toBeTruthy();

        expect(manifest.exhibitsTraits.length)
            .toEqual(3);
        const removed: boolean = manifest.exhibitsTraits.remove('traitName');
        expect(removed)
            .toBeTruthy();
        expect(manifest.exhibitsTraits.length)
            .toEqual(2);
        expect(manifest.exhibitsTraits.allItems[0])
            .toEqual(trait);
        expect(manifest.exhibitsTraits.allItems[1])
            .toEqual(otherTrait);
    });

    it('CdmTraitCollectionRemoveTraitDefinitionPrioritizeFromProperty', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'traitName', undefined);
        const otherTrait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'name of other trait', undefined);

        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);
        manifest.exhibitsTraits.push(trait);
        (manifest.exhibitsTraits.allItems[2] as CdmTraitReference).isFromProperty = true;
        manifest.exhibitsTraits.push(otherTrait);
        manifest.exhibitsTraits.push(trait);
        (manifest.exhibitsTraits.allItems[4] as CdmTraitReference).isFromProperty = true;
        manifest.exhibitsTraits.push(otherTrait);
        expect(manifest.exhibitsTraits.length)
            .toEqual(6);
        expect((manifest.exhibitsTraits.allItems[2] as CdmTraitReference).isFromProperty)
            .toBeTruthy();
        const removed: boolean = manifest.exhibitsTraits.remove(trait);
        expect(removed)
            .toBeTruthy();
        expect((manifest.exhibitsTraits.allItems[0].explicitReference as CdmTraitDefinition).traitName)
            .toEqual('traitName');
        expect((manifest.exhibitsTraits.allItems[2].explicitReference as CdmTraitDefinition).traitName)
            .toEqual('name of other trait');
        expect((manifest.exhibitsTraits.allItems[3].explicitReference as CdmTraitDefinition).traitName)
            .toEqual('traitName');
    });

    it('CdmTraitCollectionIndexOfOnlyFromProperty', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'traitName', undefined);
        const otherTrait: CdmTraitDefinition = new CdmTraitDefinition(manifest.ctx, 'name of other trait', undefined);

        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);

        expect((manifest.exhibitsTraits.allItems[0] as CdmTraitReference).isFromProperty)
            .toBeFalsy();
        expect((manifest.exhibitsTraits.allItems[1] as CdmTraitReference).isFromProperty)
            .toBeFalsy();

        let index: number = manifest.exhibitsTraits.indexOf(trait.traitName, true);
        expect(index)
            .toEqual(-1);

        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);
        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);

        expect(manifest.exhibitsTraits.length)
            .toEqual(6);
        (manifest.exhibitsTraits.allItems[2] as CdmTraitReference).isFromProperty = true;
        index = manifest.exhibitsTraits.indexOf(trait.traitName, true);
        expect(index)
            .toEqual(2);
        index = manifest.exhibitsTraits.indexOf(trait.traitName);
        expect(index)
            .toEqual(2);
    });

    it('CdmTraitCollectionClear', () => {
        const manifest: CdmManifestDefinition = generateManifest();

        const trait: CdmTraitReference = new CdmTraitReference(manifest.ctx, 'traitName', undefined, undefined);
        const otherTrait: CdmTraitReference = new CdmTraitReference(manifest.ctx, 'name of other trait', undefined, undefined);

        manifest.exhibitsTraits.push(trait);
        manifest.exhibitsTraits.push(otherTrait);
        manifest.traitCache = new Map<string, ResolvedTraitSetBuilder>();

        manifest.exhibitsTraits.clear();
        expect(manifest.exhibitsTraits.length)
            .toEqual(0);
        expect(manifest.traitCache)
            .toBeUndefined();
    });
});
