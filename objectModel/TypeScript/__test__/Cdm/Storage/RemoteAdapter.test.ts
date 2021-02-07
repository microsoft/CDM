// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmManifestDefinition } from '../../../internal';
import { testHelper } from '../../testHelper';

describe('Cdm.Storage.ResourceAdapter', () => {
    const testsSubpath: string = 'Storage';

    /**
     * Test that with a remote adapter configured, the partition paths get properly turned to their mapped keys.
     */
    it('TestModelJsonRemoteAdapterConfig', async () => {
        const corpus = testHelper.getLocalCorpus(testsSubpath, 'TestModelJsonRemoteAdapterConfig');
        
        const manifest = await corpus.fetchObjectAsync<CdmManifestDefinition>('model.json');

        // Confirm that the partition URL has been mapped to 'contoso' by RemoteAdapter

        // Manifest loaded from model.json should not be null
        expect(manifest).not.toBeNull();
        // There should be only one entity loaded from model.json
        expect(manifest.entities.allItems.length).toBe(1);
        // There should be only one partition attached to the entity loaded from model.json
        expect(manifest.entities.allItems[0].dataPartitions.allItems.length).toBe(1);
        // The partition location loaded from model.json did not match
        expect(manifest.entities.allItems[0].dataPartitions.allItems[0].location).toBe('remote:/contoso/some/path/partition-data.csv');
    });
});