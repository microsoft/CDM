// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeResolutionDirectiveSet,
    CdmCorpusDefinition,
    CdmEntityDefinition,
    CdmFolderDefinition,
    CdmManifestDefinition,
    resolveOptions
} from '../../../internal';
import { testHelper } from '../../testHelper';
import { projectionTestUtils } from '../../Utilities/projectionTestUtils';
import { AttributeContextUtil } from './AttributeContextUtil';

describe('Cdm/Projection/ProjectionFKTest', () => {
    const resOptsCombinations: string[][] = [
        [],
        ['referenceOnly'],
        ['normalized'],
        ['structured'],
        ['referenceOnly', 'normalized'],
        ['referenceOnly', 'structured'],
        ['normalized', 'structured'],
        ['referenceOnly', 'normalized', 'structured']
    ];

    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/Projection/TestProjectionFK';

    it('TestEntityAttribute', async () => {
        const testName: string = 'TestEntityAttribute';
        const entityName: string = 'SalesEntityAttribute';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestEntityAttributeProj', async () => {
        const testName: string = 'TestEntityAttributeProj';
        const entityName: string = 'SalesEntityAttribute';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestSourceWithEA', async () => {
        const testName: string = 'TestSourceWithEA';
        const entityName: string = 'SalesSourceWithEA';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestSourceWithEAProj', async () => {
        const testName: string = 'TestSourceWithEAProj';
        const entityName: string = 'SalesSourceWithEA';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestGroupFK', async () => {
        const testName: string = 'TestGroupFK';
        const entityName: string = 'SalesGroupFK';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestGroupFKProj', async () => {
        const testName: string = 'TestGroupFKProj';
        const entityName: string = 'SalesGroupFK';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestNestedFKProj', async () => {
        const testName: string = 'TestNestedFKProj';
        const entityName: string = 'SalesNestedFK';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestPolymorphic', async () => {
        const testName: string = 'TestPolymorphic';
        const entityName: string = 'PersonPolymorphicSource';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestPolymorphicProj', async () => {
        const testName: string = 'TestPolymorphicProj';
        const entityName: string = 'PersonPolymorphicSource';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestPolymorphicFKProj', async () => {
        const testName: string = 'TestPolymorphicFKProj';
        const entityName: string = 'PersonPolymorphicSourceFK';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestArraySource', async () => {
        const testName: string = 'TestArraySource';
        const entityName: string = 'SalesArraySource';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestArraySourceProj', async () => {
        const testName: string = 'TestArraySourceProj';
        const entityName: string = 'SalesArraySource';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestForeignKey', async () => {
        const testName: string = 'TestForeignKey';
        const entityName: string = 'SalesForeignKey';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestForeignKeyProj', async () => {
        const testName: string = 'TestForeignKeyProj';
        const entityName: string = 'SalesForeignKey';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestForeignKeyAlways', async () => {
        const testName: string = 'TestForeignKeyAlways';
        const entityName: string = 'SalesForeignKeyAlways';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    it('TestCompositeKeyProj', async () => {
        const testName: string = 'TestCompositeKeyProj';
        const entityName: string = 'SalesCompositeKey';

        for (const resOpt of resOptsCombinations) {
            await loadEntityForResolutionOptionAndSave(testName, entityName, resOpt);
        }
    });

    async function loadEntityForResolutionOptionAndSave(testName: string, entityName: string, resOpts: string[]): Promise<void> {
        const corpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, testName);
        const manifest: CdmManifestDefinition = await corpus.fetchObjectAsync<CdmManifestDefinition>('local:/default.manifest.cdm.json');

        const expectedOutputPath: string = testHelper.getExpectedOutputFolderPath(testsSubpath, testName);
        const fileNameSuffix: string = projectionTestUtils.getResolutionOptionNameSuffix(resOpts);

        const entSalesForeignKeyProjection: CdmEntityDefinition = await corpus.fetchObjectAsync<CdmEntityDefinition>(`local:/${entityName}.cdm.json/${entityName}`, manifest);
        expect(entSalesForeignKeyProjection)
            .toBeTruthy();
        const resolvedSalesForeignKeyProjection: CdmEntityDefinition = await saveResolved(corpus, manifest, testName, entSalesForeignKeyProjection, resOpts);
        expect(resolvedSalesForeignKeyProjection)
            .toBeTruthy();
        await AttributeContextUtil.validateAttributeContext(corpus, expectedOutputPath, `${entityName}${fileNameSuffix}`, resolvedSalesForeignKeyProjection);
    }

    async function saveResolved(corpus: CdmCorpusDefinition, manifest: CdmManifestDefinition, testName: string, inputEntity: CdmEntityDefinition, resolutionOptions: string[]): Promise<CdmEntityDefinition> {
        const roHashSet: Set<string> = new Set<string>();
        for (let i: number = 0; i < resolutionOptions.length; i++) {
            roHashSet.add(resolutionOptions[i]);
        }

        const fileNameSuffix: string = projectionTestUtils.getResolutionOptionNameSuffix(resolutionOptions);

        const resolvedEntityName: string = `Resolved_${inputEntity.entityName}${fileNameSuffix}.cdm.json`;

        const ro: resolveOptions = new resolveOptions(inputEntity.inDocument);
        ro.directives = new AttributeResolutionDirectiveSet(roHashSet);

        const resolvedFolder: CdmFolderDefinition = corpus.storage.fetchRootFolder('output');
        const resolvedEntity: CdmEntityDefinition = await inputEntity.createResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder);

        return resolvedEntity;
    }
});
