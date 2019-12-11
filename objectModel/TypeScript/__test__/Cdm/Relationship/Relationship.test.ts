import {
    CdmCorpusDefinition,
    CdmE2ERelationship,
    CdmEntityDefinition,
    CdmManifestDeclarationDefinition,
    CdmManifestDefinition,
    cdmObjectType,
    cdmRelationshipDiscoveryStyle,
    cdmStatusLevel
} from '../../../internal';
import { LocalAdapter } from '../../../StorageAdapter';
import { testHelper } from '../../testHelper';

// tslint:disable-next-line: max-func-body-length
describe('Cdm/Relationship/Relationship', () => {
    const testsSubpath: string = 'Cdm/Relationship';

    /**
     * Testing calculation of relationships and that those relationships are properly added to manifest objects
     */
    it('TestCalculateRelationshipsAndPopulateManifests', async (done) => {
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestCalculateRelationshipsAndPopulateManifests');

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

        const expectedRelationshipsForRootManifestAll: number = 5;
        const expectedRelationshipsForSubManifestAll: number = 7;
        const expectedRelationshipsForRootManifestExclusive: number = 3;
        const expectedRelationshipsForSubManifestExclusive: number = 3;
        const expectedZeroRelationships: number = 0;
        const exactlyOneInstance: number = 1;

        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.setEventCallback((level, msg) => { }, cdmStatusLevel.error);
        corpus.storage.mount('local', new LocalAdapter(testInputPath));
        corpus.storage.defaultNamespace = 'local';

        const rootManifest: CdmManifestDefinition = await corpus.createRootManifest('local:/default.manifest.cdm.json');
        const subManifestPath: string = corpus.storage.createAbsoluteCorpusPath(rootManifest.subManifests.allItems[0].definition);
        const subManifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>(subManifestPath);

        await corpus.calculateEntityGraphAsync(rootManifest);
        await rootManifest.populateManifestRelationshipsAsync();

        expect(rootManifest.relationships.length)
            .toBe(expectedRelationshipsForRootManifestAll);
        expect(subManifest.relationships.length)
            .toBe(expectedRelationshipsForSubManifestAll);

        // check that each relationship has been created correctly
        for (const expectedRel of expectedAllManifestRels) {
            const found: CdmE2ERelationship[] = rootManifest.relationships.allItems.filter((x: CdmE2ERelationship) => {
                return x.fromEntity === expectedRel.fromEntity
                    && x.fromEntityAttribute === expectedRel.fromEntityAttribute
                    && x.toEntity === expectedRel.toEntity
                    && x.toEntityAttribute === expectedRel.toEntityAttribute;
            });
            expect(found.length)
                .toBe(exactlyOneInstance);
        }

        for (const expectedSubRel of expectedAllSubManifestRels) {
            const found: CdmE2ERelationship[] = subManifest.relationships.allItems.filter((x: CdmE2ERelationship) => {
                return x.fromEntity === expectedSubRel.fromEntity
                    && x.fromEntityAttribute === expectedSubRel.fromEntityAttribute
                    && x.toEntity === expectedSubRel.toEntity
                    && x.toEntityAttribute === expectedSubRel.toEntityAttribute;
            });
            expect(found.length)
                .toBe(exactlyOneInstance);
        }

        // make sure only relationships where to and from entities are in the manifest are found with the "exclusive" option is passed in
        await rootManifest.populateManifestRelationshipsAsync(cdmRelationshipDiscoveryStyle.exclusive);

        expect(rootManifest.relationships.length)
            .toBe(expectedRelationshipsForRootManifestExclusive);
        expect(subManifest.relationships.length)
            .toBe(expectedRelationshipsForSubManifestExclusive);

        // check that each relationship has been created correctly
        for (const expectedRel of expectedExclusiveManifestRels) {
            const found: CdmE2ERelationship[] = rootManifest.relationships.allItems.filter((x: CdmE2ERelationship) => {
                return x.fromEntity === expectedRel.fromEntity
                    && x.fromEntityAttribute === expectedRel.fromEntityAttribute
                    && x.toEntity === expectedRel.toEntity
                    && x.toEntityAttribute === expectedRel.toEntityAttribute;
            });
            expect(found.length)
                .toBe(exactlyOneInstance);
        }

        for (const expectedSubRel of expectedExclusiveSubManifestRels) {
            const found: CdmE2ERelationship[] = subManifest.relationships.allItems.filter((x: CdmE2ERelationship) => {
                return x.fromEntity === expectedSubRel.fromEntity
                    && x.fromEntityAttribute === expectedSubRel.fromEntityAttribute
                    && x.toEntity === expectedSubRel.toEntity
                    && x.toEntityAttribute === expectedSubRel.toEntityAttribute;
            });
            expect(found.length)
                .toBe(exactlyOneInstance);
        }

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
        const expectedResolvedManifestRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestCalculateRelationshipsOnResolvedEntities',
            'expectedResolvedManifestRels.json')) as CdmE2ERelationship[];
        const expectedResolvedSubManifestRels: CdmE2ERelationship[] = JSON.parse(testHelper.getExpectedOutputFileContent(
            testsSubpath,
            'TestCalculateRelationshipsOnResolvedEntities',
            'expectedResolvedSubManifestRels.json')) as CdmE2ERelationship[];
        const testInputPath: string = testHelper.getInputFolderPath(testsSubpath, 'TestCalculateRelationshipsOnResolvedEntities');
        const corpus: CdmCorpusDefinition = new CdmCorpusDefinition();
        corpus.setEventCallback((level, msg) => { }, cdmStatusLevel.error);
        corpus.storage.mount('local', new LocalAdapter(testInputPath));
        corpus.storage.defaultNamespace = 'local';
        const rootManifest: CdmManifestDefinition =
            await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');
        const resolvedManifest: CdmManifestDefinition = await loadAndResolveManifest(corpus, rootManifest, '-resolved');
        const subManifestPath: string = corpus.storage.createAbsoluteCorpusPath(resolvedManifest.subManifests.allItems[0].definition);
        const subManifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>(subManifestPath);
        // using createResolvedManifest will only populate exclusive relationships
        expect(resolvedManifest.relationships.length)
            .toBe(expectedResolvedManifestRels.length);
        expect(subManifest.relationships.length)
            .toBe(expectedResolvedSubManifestRels.length);
        // check that each relationship has been created correctly
        for (const expectedRel of expectedResolvedManifestRels) {
            const found: CdmE2ERelationship[] = resolvedManifest.relationships.allItems.filter((x: CdmE2ERelationship) =>
                x.fromEntity === expectedRel.fromEntity
                && x.fromEntityAttribute === expectedRel.fromEntityAttribute
                && x.toEntity === expectedRel.toEntity
                && x.toEntityAttribute === expectedRel.toEntityAttribute
            );
            expect(found.length)
                .toBe(1);
        }
        for (const expectedSubRel of expectedResolvedSubManifestRels) {
            const found: CdmE2ERelationship[] = subManifest.relationships.allItems.filter((x: CdmE2ERelationship) =>
                x.fromEntity === expectedSubRel.fromEntity
                && x.fromEntityAttribute === expectedSubRel.fromEntityAttribute
                && x.toEntity === expectedSubRel.toEntity
                && x.toEntityAttribute === expectedSubRel.toEntityAttribute
            );
            expect(found.length)
                .toBe(1);
        }
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
            .toBe(1);
        expect(bInRels[0].fromEntity)
            .toBe('local:/A-resolved.cdm.json/A');
        expect(bInRels[0].toEntity)
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
        // TODO: this should point to the resolved entity, currently an open bug
        expect(cOutRels[0].toEntity)
            .toBe('local:/B.cdm.json/B');
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

        done();
    });
});

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
