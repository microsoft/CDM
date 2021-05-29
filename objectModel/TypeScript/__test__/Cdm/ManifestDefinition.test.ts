// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmEntityDeclarationDefinition,
    CdmE2ERelationship,
    CdmManifestDeclarationDefinition,
    CdmManifestDefinition,
    CdmTraitReferenceBase
} from '../../internal';

describe('Cdm/ManifestDefinitionTests', () => {
    /**
     * Tests if the copy function creates copies of the sub objects
     */
    it('testManifestCopy', () => {
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        const manifest: CdmManifestDefinition = new CdmManifestDefinition(corpus.ctx, 'name');

        const entityName: string = 'entity';
        const subManifestName: string = 'subManifest';
        const relationshipName: string = 'relName';
        const traitName: string = "traitName";

        const entityDec: CdmEntityDeclarationDefinition = manifest.entities.push(entityName);
        const subManifest: CdmManifestDeclarationDefinition = manifest.subManifests.push(subManifestName);
        const relationship: CdmE2ERelationship = manifest.relationships.push(relationshipName);
        const trait: CdmTraitReferenceBase = manifest.exhibitsTraits.push(traitName);

        const copy: CdmManifestDefinition = manifest.copy() as CdmManifestDefinition;
        copy.entities.allItems[0].entityName = 'newEntity';
        copy.subManifests.allItems[0].manifestName = 'newSubManifest';
        copy.relationships.allItems[0].name = 'newRelName';
        copy.exhibitsTraits.allItems[0].namedReference = 'newTraitName';

        expect(entityDec.entityName)
            .toBe(entityName);
        expect(subManifest.manifestName)
            .toBe(subManifestName);
        expect(relationship.name)
            .toBe(relationshipName);
        expect(trait.namedReference)
            .toBe(traitName);
    });
});
