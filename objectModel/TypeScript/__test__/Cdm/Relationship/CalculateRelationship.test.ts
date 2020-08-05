// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import * as fs from 'fs';
import { EOL } from 'os';
import {
    CdmCollection,
    CdmCorpusDefinition,
    CdmE2ERelationship,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
} from '../../../internal';
import { testHelper } from '../../testHelper';
import { testUtils } from '../../testUtils';
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

        await testRun(testName, entityName);
    });

    /**
     * Non projection scenario with the referenced entity not having any primary key
     */
    it('TestSimpleWithoutId', async () => {
        const testName: string = 'TestSimpleWithoutId';
        const entityName: string = 'Sales';

        await testRun(testName, entityName);
    });

    /**
     * Projection scenario with the referenced entity not having any primary key
     */
    it('TestWithoutIdProj', async () => {
        const testName: string = 'TestWithoutIdProj';
        const entityName: string = 'Sales';

        await testRun(testName, entityName);
    });

    /**
     * Projection with composite keys
     */
    it('TestCompositeProj', async () => {
        const testName: string = 'TestCompositeProj';
        const entityName: string = 'Sales';

        await testRun(testName, entityName);
    });

    /**
     * Projection with nested composite keys
     */
    it('TestNestedCompositeProj', async () => {
        const testName: string = 'TestNestedCompositeProj';
        const entityName: string = 'Sales';

        await testRun(testName, entityName);
    });

    /**
     * Projection with IsPolymorphicSource property set to true
     */
    it('TestPolymorphicProj', async () => {
        const testName: string = 'TestPolymorphicProj';
        const entityName: string = 'Person';

        await testRun(testName, entityName);
    });

    /**
     * Common test code for these test cases
     */
    async function testRun(testName: string, entityName: string): Promise<void> {
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
        const resolvedEntity: CdmEntityDefinition = await testUtils.getResolvedEntity(corpus, entity, ['referenceOnly']);
        const actualAttrCtx: string = getAttributeContextString(resolvedEntity, entityName, actualOutputFolder);

        const expectedAttrCtx: string = fs.readFileSync(`${expectedOutputFolder}/AttrCtx_${entityName}.txt`).toString();

        expect(actualAttrCtx)
            .toEqual(expectedAttrCtx);

        await corpus.calculateEntityGraphAsync(manifest);
        await manifest.populateManifestRelationshipsAsync();
        const actualRelationshipsString: string = listRelationships(corpus, entity, actualOutputFolder, entityName);

        const expectedRelationshipsString: string = fs.readFileSync(`${expectedOutputFolder}/REL_${entityName}.txt`).toString();

        expect(actualRelationshipsString)
            .toEqual(expectedRelationshipsString);

        const outputFolder: CdmFolderDefinition = corpus.storage.fetchRootFolder('output');
        outputFolder.documents.push(manifest);

        const manifestFileName: string = 'saved.manifest.cdm.json';
        await manifest.saveAsAsync(manifestFileName, true);
        const actualManifestPath: string = `${actualOutputFolder}/${manifestFileName}`;
        if (!fs.existsSync(actualManifestPath)) {
            fail('Unable to save manifest with relationship');
        } else {
            const savedManifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>(`output:/${manifestFileName}`);
            const actualSavedManifestRel: string = getRelationshipStrings(savedManifest.relationships);
            const expectedSavedManifestRel: string = fs.readFileSync(`${expectedOutputFolder}/MANIFEST_REL_${entityName}.txt`).toString();
            expect(actualSavedManifestRel)
                .toEqual(expectedSavedManifestRel);
        }
    }

    /**
     * Get a string version of the relationship collection
     */
    function getRelationshipStrings(relationships: CdmCollection<CdmE2ERelationship>): string {
        let bldr: string = '';
        for (const rel of relationships.allItems) {
            bldr += `${rel.name}|${rel.toEntity}|${rel.toEntityAttribute}|${rel.fromEntity}|${rel.fromEntityAttribute}`;
            bldr += endOfLine;
        }

        return bldr;
    }

    /**
     * List the incoming and outgoing relationships
     */
    function listRelationships(corpus: CdmCorpusDefinition, entity: CdmEntityDefinition, actualOutputFolder: string, entityName: string): string {
        let bldr: string = '';

        bldr += `Incoming Relationships For: ${entity.entityName}:`;
        bldr += endOfLine;
        // Loop through all the relationships where other entities point to this entity.
        for (const relationship of corpus.fetchIncomingRelationships(entity)) {
            bldr += printRelationship(relationship);
            bldr += endOfLine;
        }

        console.log(`Outgoing Relationships For: ${entity.entityName}:`);
        // Now loop through all the relationships where this entity points to other entities.
        for (const relationship of corpus.fetchOutgoingRelationships(entity)) {
            bldr += printRelationship(relationship);
            bldr += endOfLine;
        }

        return bldr;
    }

    /**
     * Print the relationship
     */
    function printRelationship(relationship: CdmE2ERelationship): string {
        let bldr: string = '';

        if (relationship.name) {
            bldr += `  Name: ${relationship.name}`;
            bldr += endOfLine;
        }

        bldr += `  FromEntity: ${relationship.fromEntity}`;
        bldr += endOfLine;
        bldr += `  FromEntityAttribute: ${relationship.fromEntityAttribute}`;
        bldr += endOfLine;
        bldr += `  ToEntity: ${relationship.toEntity}`;
        bldr += endOfLine;
        bldr += `  ToEntityAttribute: ${relationship.toEntityAttribute}`;
        bldr += endOfLine;
        bldr += endOfLine;
        console.log(bldr);

        return bldr;
    }

    /**
     * Check the attribute context for these test scenarios
     */
    function getAttributeContextString(resolvedEntity: CdmEntityDefinition, entityName: string, actualOutputFolder: string): string {
        return (new AttributeContextUtil()).getAttributeContextStrings(resolvedEntity, resolvedEntity.attributeContext);
    }
});
