// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmE2ERelationship,
    CdmEntityDefinition,
    cdmLogCode,
    CdmManifestDeclarationDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    cdmRelationshipDiscoveryStyle
} from '../../../internal';
import { LocalAdapter } from '../../../Storage';
import { testHelper } from '../../testHelper';

// tslint:disable-next-line: max-func-body-length
describe('Cdm/Relationship/Relationship', () => {
    const testsSubpath: string = 'Cdm/Relationship';

    /**
     * Testing calculation of relationships and that those relationships are properly added to manifest objects
     */
    it('TestCalculateRelationshipsAndPopulateManifests', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestCalculateRelationshipsAndPopulateManifests');

        const rootManifest: CdmManifestDefinition = await corpus.createRootManifest('local:/default.manifest.cdm.json');
        const subManifestPath: string = corpus.storage.createAbsoluteCorpusPath(rootManifest.subManifests.allItems[0].definition);
        const subManifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>(subManifestPath);

        const expectedAllManifestRels: CdmE2ERelationship[] =
            JSON.parse(testHelper.getExpectedOutputFileContent(
                testsSubpath,
                'TestCalculateRelationshipsAndPopulateManifests',
                'expectedAllManifestRels.json'
            )) as CdmE2ERelationship[];
        const expectedAllSubManifestRels: CdmE2ERelationship[] =
            JSON.parse(testHelper.getExpectedOutputFileContent(
                testsSubpath,
                'TestCalculateRelationshipsAndPopulateManifests',
                'expectedAllSubManifestRels.json'
            )) as CdmE2ERelationship[];

        await corpus.calculateEntityGraphAsync(rootManifest);
        await rootManifest.populateManifestRelationshipsAsync();

        // check that each relationship has been created correctly
        verifyRelationships(rootManifest, expectedAllManifestRels);
        verifyRelationships(subManifest, expectedAllSubManifestRels);
        done();
    });

    /**
     * Testing calculation of relationships and that those relationships are
     * properly added to manifest objects setting the populate flag to Exclusive
     */
    it('TestCalculateRelationshipsAndPopulateManifestsWithExclusiveFlag', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestCalculateRelationshipsAndPopulateManifests');

        const rootManifest: CdmManifestDefinition = await corpus.createRootManifest('local:/default.manifest.cdm.json');
        const subManifestPath: string = corpus.storage.createAbsoluteCorpusPath(rootManifest.subManifests.allItems[0].definition);
        const subManifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>(subManifestPath);

        await corpus.calculateEntityGraphAsync(rootManifest);
        // make sure only relationships where to and from entities are in the manifest are found with the "exclusive" option is passed in
        await rootManifest.populateManifestRelationshipsAsync(cdmRelationshipDiscoveryStyle.exclusive);

        const expectedExclusiveManifestRels: CdmE2ERelationship[] =
            JSON.parse(testHelper.getExpectedOutputFileContent(
                testsSubpath,
                'TestCalculateRelationshipsAndPopulateManifests',
                'expectedExclusiveManifestRels.json'
            )) as CdmE2ERelationship[];
        const expectedExclusiveSubManifestRels: CdmE2ERelationship[] =
            JSON.parse(testHelper.getExpectedOutputFileContent(
                testsSubpath,
                'TestCalculateRelationshipsAndPopulateManifests',
                'expectedExclusiveSubManifestRels.json'
            )) as CdmE2ERelationship[];

        // check that each relationship has been created correctly
        verifyRelationships(rootManifest, expectedExclusiveManifestRels);
        verifyRelationships(subManifest, expectedExclusiveSubManifestRels);
        done();
    });

    /**
     * Testing calculation of relationships and that those relationships are
     * properly added to manifest objects setting the populate flag to None
     */
    it('TestCalculateRelationshipsAndPopulateManifestsWithNoneFlag', async (done) => {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestCalculateRelationshipsAndPopulateManifests');

        const rootManifest: CdmManifestDefinition = await corpus.createRootManifest('local:/default.manifest.cdm.json');
        const subManifestPath: string = corpus.storage.createAbsoluteCorpusPath(rootManifest.subManifests.allItems[0].definition);
        const subManifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>(subManifestPath);

        const expectedZeroRelationships: number = 0;

        await corpus.calculateEntityGraphAsync(rootManifest);
        // make sure no relationships are added when "none" relationship option is passed in
        await rootManifest.populateManifestRelationshipsAsync(cdmRelationshipDiscoveryStyle.none);

        expect(rootManifest.relationships.length)
            .toBe(expectedZeroRelationships);
        expect(subManifest.relationships.length)
            .toBe(expectedZeroRelationships);

        done();
    });

    /**
     * Testing calculation of relationships and that those relationships are
     * properly added to manifest objects
     */
    it('TestCalculateRelationshipsOnResolvedEntities', async (done) => {
        const expectedResolvedExcManifestRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestCalculateRelationshipsOnResolvedEntities',
            'expectedResolvedExcManifestRels.json')) as CdmE2ERelationship[];
        const expectedResolvedExcSubManifestRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestCalculateRelationshipsOnResolvedEntities',
            'expectedResolvedExcSubManifestRels.json')) as CdmE2ERelationship[];
        const expectedResolvedManifestRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestCalculateRelationshipsOnResolvedEntities',
            'expectedResolvedManifestRels.json')) as CdmE2ERelationship[];
        const expectedResolvedSubManifestRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestCalculateRelationshipsOnResolvedEntities',
            'expectedResolvedSubManifestRels.json')) as CdmE2ERelationship[];
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestCalculateRelationshipsOnResolvedEntities');

        const rootManifest: CdmManifestDefinition =
            await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');
        const resolvedManifest: CdmManifestDefinition = await loadAndResolveManifest(corpus, rootManifest, '-resolved');
        const subManifestPath: string = corpus.storage.createAbsoluteCorpusPath(resolvedManifest.subManifests.allItems[0].definition);
        const subManifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>(subManifestPath);

        // using createResolvedManifest will only populate exclusive relationships
        verifyRelationships(resolvedManifest, expectedResolvedExcManifestRels);
        verifyRelationships(subManifest, expectedResolvedExcSubManifestRels);

        // check that each relationship has been created correctly with the all flag
        await resolvedManifest.populateManifestRelationshipsAsync();
        await subManifest.populateManifestRelationshipsAsync();
        verifyRelationships(resolvedManifest, expectedResolvedManifestRels);
        verifyRelationships(subManifest, expectedResolvedSubManifestRels);

        // it is not enough to check if the relationships are correct.
        // We need to check if the incoming and outgoing relationships are
        // correct as well. One being correct can cover up the other being wrong
        // A
        const aEnt: CdmEntityDefinition =
            await corpus.fetchObjectAsync<CdmEntityDefinition>(resolvedManifest.entities.allItems[0].entityPath, resolvedManifest);
        const aInRels: CdmE2ERelationship[] = corpus.fetchIncomingRelationships(aEnt);
        const aOutRels: CdmE2ERelationship[] = corpus.fetchOutgoingRelationships(aEnt);
        expect(aInRels.length)
            .toBe(0);
        expect(aOutRels.length)
            .toBe(1);
        expect(aOutRels[0].fromEntity)
            .toBe('local:/A-resolved.cdm.json/A');
        expect(aOutRels[0].toEntity)
            .toBe('local:/B-resolved.cdm.json/B');
        // B
        const bEnt: CdmEntityDefinition =
            await corpus.fetchObjectAsync<CdmEntityDefinition>(resolvedManifest.entities.allItems[1].entityPath, resolvedManifest);
        const bInRels: CdmE2ERelationship[] = corpus.fetchIncomingRelationships(bEnt);
        const bOutRels: CdmE2ERelationship[] = corpus.fetchOutgoingRelationships(bEnt);
        expect(bInRels.length)
            .toBe(2);
        expect(bInRels[0].fromEntity)
            .toBe('local:/A-resolved.cdm.json/A');
        expect(bInRels[0].toEntity)
            .toBe('local:/B-resolved.cdm.json/B');
        expect(bInRels[1].fromEntity)
            .toBe('local:/sub/C-resolved.cdm.json/C');
        expect(bInRels[1].toEntity)
            .toBe('local:/B-resolved.cdm.json/B');
        expect(bOutRels.length)
            .toBe(0);
        // C
        const cEnt: CdmEntityDefinition =
            await corpus.fetchObjectAsync<CdmEntityDefinition>(subManifest.entities.allItems[0].entityPath, subManifest);
        const cInRels: CdmE2ERelationship[] = corpus.fetchIncomingRelationships(cEnt);
        const cOutRels: CdmE2ERelationship[] = corpus.fetchOutgoingRelationships(cEnt);
        expect(cInRels.length)
            .toBe(0);
        expect(cOutRels.length)
            .toBe(2);
        expect(cOutRels[0].fromEntity)
            .toBe('local:/sub/C-resolved.cdm.json/C');
        expect(cOutRels[0].toEntity)
            .toBe('local:/B-resolved.cdm.json/B');
        expect(cOutRels[1].fromEntity)
            .toBe('local:/sub/C-resolved.cdm.json/C');
        expect(cOutRels[1].toEntity)
            .toBe('local:/sub/D-resolved.cdm.json/D');
        // D
        const dEnt: CdmEntityDefinition =
            await corpus.fetchObjectAsync<CdmEntityDefinition>(subManifest.entities.allItems[1].entityPath, subManifest);
        const dInRels: CdmE2ERelationship[] = corpus.fetchIncomingRelationships(dEnt);
        const dOutRels: CdmE2ERelationship[] = corpus.fetchOutgoingRelationships(dEnt);
        expect(dInRels.length)
            .toBe(1);
        expect(dInRels[0].fromEntity)
            .toBe('local:/sub/C-resolved.cdm.json/C');
        expect(dInRels[0].toEntity)
            .toBe('local:/sub/D-resolved.cdm.json/D');
        expect(dOutRels.length)
            .toBe(0);
        // E
        const eEnt: CdmEntityDefinition =
            await corpus.fetchObjectAsync<CdmEntityDefinition>(resolvedManifest.entities.allItems[2].entityPath, resolvedManifest);
        const eInRels: CdmE2ERelationship[] = corpus.fetchIncomingRelationships(eEnt);
        const eOutRels: CdmE2ERelationship[] = corpus.fetchOutgoingRelationships(eEnt);
        expect(eInRels.length)
            .toBe(1);
        expect(eInRels[0].fromEntity)
            .toBe('local:/sub/F-resolved.cdm.json/F');
        expect(eInRels[0].toEntity)
            .toBe('local:/E-resolved.cdm.json/E');
        expect(eOutRels.length)
            .toBe(0);
        // F
        const fEnt: CdmEntityDefinition =
            await corpus.fetchObjectAsync<CdmEntityDefinition>(subManifest.entities.allItems[2].entityPath, subManifest);
        const fInRels: CdmE2ERelationship[] = corpus.fetchIncomingRelationships(fEnt);
        const fOutRels: CdmE2ERelationship[] = corpus.fetchOutgoingRelationships(fEnt);
        expect(fInRels.length)
            .toBe(0);
        expect(fOutRels.length)
            .toBe(1);
        expect(fOutRels[0].fromEntity)
            .toBe('local:/sub/F-resolved.cdm.json/F');
        expect(fOutRels[0].toEntity)
            .toBe('local:/E-resolved.cdm.json/E');
        done();
    });

    /**
     * Testing calculating relationships for the special kind of attribute that uses the "select one" directive
     */
    it('TestCalculateRelationshipsForSelectsOneAttribute', async (done) => {
        const expectedRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestCalculateRelationshipsForSelectsOneAttribute',
            'expectedRels.json')) as CdmE2ERelationship[];
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestCalculateRelationshipsForSelectsOneAttribute');
        corpus.storage.mount('cdm', new LocalAdapter(testHelper.schemaDocumentsPath));

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/selectsOne.manifest.cdm.json');

        await corpus.calculateEntityGraphAsync(manifest);
        await manifest.populateManifestRelationshipsAsync();

        // check that each relationship has been created correctly
        verifyRelationships(manifest, expectedRels);
        done();
    });

    /**
     * Test the relationship calculation when using a replace as foreign key operation while extending an entity.
     */
    it('testExtendsEntityAndReplaceAsForeignKey', async (done) => {
        const testName = 'TestExtendsEntityAndReplaceAsForeignKey';
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);

        const manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        await corpus.calculateEntityGraphAsync(manifest);
        // Check if the warning was logged.
        testHelper.expectCdmLogCodeEquality(corpus, cdmLogCode.WarnProjFKWithoutSourceEntity, true);

        await manifest.populateManifestRelationshipsAsync();
        expect(manifest.relationships.length)
            .toEqual(0);
        done();
    });

    /**
     * Test relationships are generated correctly when the document name and entity name do not match
     */
    it('TestRelationshipsEntityAndDocumentNameDifferent', async (done) => {
        const expectedRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestRelationshipsEntityAndDocumentNameDifferent',
            'expectedRels.json')) as CdmE2ERelationship[];
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestRelationshipsEntityAndDocumentNameDifferent');

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/main.manifest.cdm.json');

        await corpus.calculateEntityGraphAsync(manifest);
        await manifest.populateManifestRelationshipsAsync();

        // check that each relationship has been created correctly
        verifyRelationships(manifest, expectedRels);
        done();
    });

    /**
     * Test that multiple relationships are generated when there are references to multiple entities
     */
    it('TestRelationshipToMultipleEntities', async (done) => {
        const expectedRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestRelationshipToMultipleEntities',
            'expectedRels.json')) as CdmE2ERelationship[];
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestRelationshipToMultipleEntities');

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/main.manifest.cdm.json');

        await corpus.calculateEntityGraphAsync(manifest);
        await manifest.populateManifestRelationshipsAsync();

        // check that each relationship has been created correctly
        verifyRelationships(manifest, expectedRels);
        done();
    });

    /**
     * Test that relationships between entities in different namespaces are created correctly
     */
    it('TestRelationshipToDifferentNamespace', async (done) => {
        const expectedRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestRelationshipToDifferentNamespace',
            'expectedRels.json')) as CdmE2ERelationship[];
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestRelationshipToDifferentNamespace');

        // entity B will be in a different namespace
        corpus.storage.mount('differentNamespace', new LocalAdapter(`${testHelper.getInputFolderPath(testsSubpath, 'TestRelationshipToDifferentNamespace')}\\differentNamespace`));

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/main.manifest.cdm.json');

        await corpus.calculateEntityGraphAsync(manifest);
        await manifest.populateManifestRelationshipsAsync();

        // check that each relationship has been created correctly
        verifyRelationships(manifest, expectedRels);
        done();
    });
});

function verifyRelationships(manifest: CdmManifestDefinition, expectedRelationships: CdmE2ERelationship[]): void {
    expect(manifest.relationships.length)
        .toBe(expectedRelationships.length);

    for (const expectedRel of expectedRelationships) {
        const found: CdmE2ERelationship[] = manifest.relationships.allItems.filter((x: CdmE2ERelationship) =>
            x.fromEntity === expectedRel.fromEntity
            && x.fromEntityAttribute === expectedRel.fromEntityAttribute
            && x.toEntity === expectedRel.toEntity
            && x.toEntityAttribute === expectedRel.toEntityAttribute
            && ((!x.name && !expectedRel.name)
                || x.name === expectedRel.name)
        );
        expect(found.length)
            .toBe(1);
    }
}

async function loadAndResolveManifest(
    corpus: CdmCorpusDefinition,
    manifest: CdmManifestDefinition,
    renameSuffix: string
): Promise<CdmManifestDefinition> {
    const resolvedManifest: CdmManifestDefinition =
        await manifest.createResolvedManifestAsync(manifest.manifestName + renameSuffix, '{n}-resolved.cdm.json');
    for (const subManifestDecl of manifest.subManifests) {
        const subManifest: CdmManifestDefinition =
            await corpus.fetchObjectAsync<CdmManifestDefinition>(subManifestDecl.definition, manifest);
        const resolvedSubManifest: CdmManifestDefinition = await loadAndResolveManifest(corpus, subManifest, renameSuffix);
        const resolvedDecl: CdmManifestDeclarationDefinition =
            corpus.MakeObject<CdmManifestDeclarationDefinition>(cdmObjectType.manifestDeclarationDef, resolvedSubManifest.manifestName);
        resolvedDecl.definition = corpus.storage.createRelativeCorpusPath(resolvedSubManifest.atCorpusPath, resolvedManifest);
        resolvedManifest.subManifests.push(resolvedDecl);
    }

    return resolvedManifest;
}
