// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import * as path from 'path';
import { EOL } from 'os';
import {
    CdmArgumentDefinition,
    CdmCollection,
    CdmConstantEntityDefinition,
    CdmCorpusDefinition,
    CdmE2ERelationship,
    CdmEntityDefinition,
    CdmEntityReference,
    CdmFolderDefinition,
    CdmManifestDefinition,
    CdmTraitReferenceBase,
    CdmTraitReference
} from '../../../internal';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';
import { AttributeContextUtil } from '../Projection/AttributeContextUtil';

/**
 * Test to validate calculateEntityGraphAsync function
 */
describe('Cdm/Relationship/CalculateRelationshipTest', () => {
    /**
     * Platform-specific line separator
     */
    const endOfLine: string = EOL;

    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Relationship/TestCalculateRelationship';

    /**
     * Non projection scenario with the referenced entity having a primary key
     */
    it('TestSimpleWithId', async () => {
        const testName: string = 'TestSimpleWithId';
        const entityName: string = 'Sales';

        await testRun(testName, entityName, false);
    });

    /**
     * Projection scenario with the referenced entity not having any primary key
     */
    it('TestWithoutIdProj', async () => {
        const testName: string = 'TestWithoutIdProj';
        const entityName: string = 'Sales';

        await testRun(testName, entityName, true);
    });

    /**
     *
     */
    it('TestDiffRefLocation', async () => {
        const testName: string = 'TestDiffRefLocation';
        const entityName: string = 'Sales';

        await testRun(testName, entityName, true);
    });

    /**
     * Projection with composite keys
     */
    it('TestCompositeProj', async () => {
        const testName: string = 'TestCompositeProj';
        const entityName: string = 'Sales';

        await testRun(testName, entityName, true);
    });

    /**
     * Projection with nested composite keys
     */
    it('TestNestedCompositeProj', async () => {
        const testName: string = 'TestNestedCompositeProj';
        const entityName: string = 'Sales';

        await testRun(testName, entityName, true);
    });

    /**
     * Non projection scenario with selectsSubAttribute set to one
     */
    it('TestPolymorphicWithoutProj', async () => {
        const testName: string = 'TestPolymorphicWithoutProj';
        const entityName: string = 'CustomPerson';

        await testRun(testName, entityName, false);
    });

    /**
     * Projection with IsPolymorphicSource property set to true
     */
    it('TestPolymorphicProj', async () => {
        const testName: string = 'TestPolymorphicProj';
        const entityName: string = 'Person';

        await testRun(testName, entityName, true);
    });

    /**
     * Test a composite key relationship with a polymorphic entity
     */
    it('TestCompositeKeyPolymorphicRelationship', async () => {
        const testName: string = 'TestCompositeKeyPolymorphicRelationship';
        const entityName: string = 'Person';

        await testRun(testName, entityName, true);
    });

    /**
     * Test a composite key relationship with multiple entity attribute but not polymorphic
     */
    it('TestCompositeKeyNonPolymorphicRelationship', async () => {
        const testName: string = 'TestCompositeKeyNonPolymorphicRelationship';
        const entityName: string = 'Person';

        await testRun(testName, entityName, true);
    });

    /**
     * Common test code for these test cases
     */
    async function testRun(testName: string, entityName: string, isEntitySet: boolean, updateExpectedOutput: boolean = false): Promise<void> {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const inputFolder: string = testHelper.getInputFolderPath(testsSubpath, testName);
        const expectedOutputFolder: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const actualOutputFolder: string = testHelper.getActualOutputFolderPath(testsSubpath, testName);

        if (!fs.existsSync(actualOutputFolder)) {
            fs.mkdirSync(actualOutputFolder, { recursive: true });
        }

        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');
        expect(manifest)
            .toBeTruthy();
        const entity: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entity)
            .toBeTruthy();
        const resolvedEntity: CdmEntityDefinition = await projectionTestUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);
        assertEntityShapeInReslovedEntity(resolvedEntity, isEntitySet);

        await AttributeContextUtil.validateAttributeContext(expectedOutputFolder, entityName, resolvedEntity, updateExpectedOutput);

        await corpus.calculateEntityGraphAsync(manifest);
        await manifest.populateManifestRelationshipsAsync();
        const actualRelationshipsString: string = listRelationships(corpus, entity, actualOutputFolder, entityName);

        const relationshipsFilename: string = `REL_${entityName}.txt`;
        fs.writeFileSync(path.join(actualOutputFolder, relationshipsFilename), actualRelationshipsString);

        const expectedRelationshipsStringFilePath: string = path.resolve(path.join(expectedOutputFolder, relationshipsFilename));
        const expectedRelationshipsString: string = fs.readFileSync(expectedRelationshipsStringFilePath).toString();

        expect(actualRelationshipsString)
            .toEqual(expectedRelationshipsString);

        const outputFolder: CdmFolderDefinition = corpus.storage.fetchRootFolder('output');
        outputFolder.documents.push(manifest);

        const manifestFileName: string = 'saved.manifest.cdm.json';
        await manifest.saveAsAsync(manifestFileName, true);
        const actualManifestPath: string = `${actualOutputFolder}/${manifestFileName}`;

        if (!fs.existsSync(actualManifestPath)) {
            throw new Error('Unable to save manifest with relationship');
        } else {
            const savedManifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>(`output:/${manifestFileName}`);
            const actualSavedManifestRel: string = getRelationshipStrings(savedManifest.relationships);
            const manifestRelationshipsFilename: string = `MANIFEST_REL_${entityName}.txt`;
            fs.writeFileSync(path.join(actualOutputFolder, manifestRelationshipsFilename), actualSavedManifestRel);
            const expectedSavedManifestRel: string = fs.readFileSync(path.join(expectedOutputFolder, manifestRelationshipsFilename)).toString();
            expect(actualSavedManifestRel)
                .toEqual(expectedSavedManifestRel);
        }
    }

    /**
     * Check if the entity shape is correct in entity reference.
     */
    function assertEntityShapeInReslovedEntity(resolvedEntity: CdmEntityDefinition, isEntitySet: boolean): void {
        for (const att of resolvedEntity.attributes) {
            if (att && att.appliedTraits) {
                for (const traitRef of att.appliedTraits) {
                    if (traitRef.namedReference === 'is.linkedEntity.identifier' && (traitRef as CdmTraitReference).arguments.length > 0) {
                        const constEnt: CdmConstantEntityDefinition = ((traitRef as CdmTraitReference).arguments.allItems[0].value as CdmEntityReference).fetchObjectDefinition<CdmConstantEntityDefinition>();
                        if (constEnt) {
                            if (isEntitySet) {
                                expect('entitySet')
                                    .toEqual(constEnt.entityShape.namedReference)
                            } else {
                                expect('entityGroupSet')
                                    .toEqual(constEnt.entityShape.namedReference)
                            }
                            return;
                        }
                    }
                }
            }
        }
        throw new Error('Unable to find entity shape from resolved model.');
    }

    /**
     * Get a string version of the relationship collection
     */
    function getRelationshipStrings(relationships: CdmCollection<CdmE2ERelationship>): string {
        let bldr: string = '';
        for (const rel of relationships.allItems) {
            bldr += `${rel.name ? rel.name : ''}|${rel.toEntity}|${rel.toEntityAttribute}|${rel.fromEntity}|${rel.fromEntityAttribute}`;
            bldr += endOfLine;
        }

        return bldr;
    }

    /**
     * Get a string version of one relationship
     */
    function getRelationshipString(rel: CdmE2ERelationship): string {
        let nameAndPipe: string = '';
        if (rel.name) {
            nameAndPipe = `${rel.name}|`
        }

        return `${nameAndPipe}${rel.toEntity}|${rel.toEntityAttribute}|${rel.fromEntity}|${rel.fromEntityAttribute}`;
    }

    /**
     * List the incoming and outgoing relationships
     */
    function listRelationships(corpus: CdmCorpusDefinition, entity: CdmEntityDefinition, actualOutputFolder: string, entityName: string): string {
        let bldr: string = '';
        const relCache: Set<string> = new Set<string>();

        bldr += `Incoming Relationships For: ${entity.entityName}:` + endOfLine;
        // Loop through all the relationships where other entities point to this entity.
        for (const relationship of corpus.fetchIncomingRelationships(entity)) {
            const cacheKey: string = getRelationshipString(relationship);
            if (!relCache.has(cacheKey)) {
                bldr += printRelationship(relationship) + endOfLine;
                relCache.add(cacheKey);
            }
        }

        console.log(`Outgoing Relationships For: ${entity.entityName}:`);
        // Now loop through all the relationships where this entity points to other entities.
        for (const relationship of corpus.fetchOutgoingRelationships(entity)) {
            const cacheKey: string = getRelationshipString(relationship);
            if (!relCache.has(cacheKey)) {
                bldr += printRelationship(relationship) + endOfLine;
                relCache.add(cacheKey);
            }
        }

        return bldr;
    }

    /**
     * Print the relationship
     */
    function printRelationship(relationship: CdmE2ERelationship): string {
        let bldr: string = '';

        if (relationship.name) {
            bldr += `  Name: ${relationship.name}` + endOfLine;
        }

        bldr += `  FromEntity: ${relationship.fromEntity}` + endOfLine;
        bldr += `  FromEntityAttribute: ${relationship.fromEntityAttribute}` + endOfLine;
        bldr += `  ToEntity: ${relationship.toEntity}` + endOfLine;
        bldr += `  ToEntityAttribute: ${relationship.toEntityAttribute}` + endOfLine;

        if (relationship.exhibitsTraits != undefined && relationship.exhibitsTraits.length != 0) {
            bldr += '  ExhibitsTraits:' + endOfLine;
            var orderedAppliedTraits = relationship.exhibitsTraits.allItems.sort((a, b) => a.namedReference?.localeCompare(b.namedReference));
            orderedAppliedTraits.forEach((trait: CdmTraitReferenceBase) => {
                bldr += `      ${trait.namedReference}` + endOfLine;

                if (trait instanceof CdmTraitReference) {
                    (trait as CdmTraitReference).arguments.allItems.forEach((args: CdmArgumentDefinition) => {
                        var attrCtxUtil = new AttributeContextUtil();
                        bldr += `          ${attrCtxUtil.getArgumentValuesAsString(args)}` + endOfLine;
                    });
                }
            });
        }

        bldr += endOfLine;
        console.log(bldr);

        return bldr;
    }

    /**
     * Check the attribute context for these test scenarios
     */
    function getAttributeContextString(resolvedEntity: CdmEntityDefinition, entityName: string, actualOutputFolder: string): string {
        return (new AttributeContextUtil()).getAttributeContextStrings(resolvedEntity);
    }
});
