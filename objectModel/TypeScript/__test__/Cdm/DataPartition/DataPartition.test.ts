// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCorpusDefinition,
    CdmDataPartitionDefinition,
    CdmLocalEntityDeclarationDefinition,
    CdmManifestDefinition,
    CdmTraitReference,
    fileStatusCheckOptions
} from '../../../internal';
import { testHelper } from '../../testHelper';

// tslint:disable-next-line: max-func-body-length
describe('Cdm/DataPartition/DataPartition', () => {
    /**
     * The path between TestDataPath and TestName.
     */
    const testsSubpath: string = 'Cdm/DataPartition';

    /**
     * Tests refreshing files that match the regular expression
     */
    it('TestRefreshesDataPartition', async () => {
        const cdmCorpus: CdmCorpusDefinition = testHelper.getLocalCorpus(testsSubpath, 'TestRefreshesDataPartition');
        const cdmManifest: CdmManifestDefinition = await cdmCorpus.fetchObjectAsync<CdmManifestDefinition>('local:/partitions.manifest.cdm.json');
        const fileStatusCheckOptions: fileStatusCheckOptions = { includeDataPartitionSize: true };

        const partitionEntity: CdmLocalEntityDeclarationDefinition = cdmManifest.entities.allItems[0] as CdmLocalEntityDeclarationDefinition;
        expect(partitionEntity.dataPartitions.length)
            .toBe(1);
        const partition: CdmDataPartitionDefinition = partitionEntity.dataPartitions.allItems[0];

        await cdmManifest.fileStatusCheckAsync(undefined, undefined, fileStatusCheckOptions);

        const localTraitIndex: number = partition.exhibitsTraits.indexOf('is.partition.size');
        expect(localTraitIndex)
            .not.toBe(-1);
        const localTrait: CdmTraitReference = partition.exhibitsTraits.allItems[localTraitIndex] as CdmTraitReference;
        expect(localTrait.namedReference)
            .toBe('is.partition.size');
        expect(localTrait.arguments.allItems[0].value)
            .toBe(2);
    });
});
