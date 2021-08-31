// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { 
    CdmCorpusDefinition,
    CdmFolderDefinition 
} from '../../internal';

describe('Cdm.Storage.StorageManager', () => {
    /**
     * Tests if CreateAbsoluteCorpusPath works correctly when provided with a path that contains a colon character.
     */
    it('TestCreateAbsoluteCorpusPathWithColon', () => {
        var corpus = new CdmCorpusDefinition();
        const folder: CdmFolderDefinition = corpus.storage.fetchRootFolder('local');

        var absoluteNamespace: string = 'namespace:/';
        var fileName: string = 'dataPartition.csv@snapshot=2020-05-10T02:47:46.0039374Z';
        var subFolderPath: string = 'some/sub/folder:with::colon/';

        // Cases where the path provided is relative.
        expect(corpus.storage.createAbsoluteCorpusPath(fileName, folder))
            .toEqual(`local:/${fileName}`);
        expect(corpus.storage.createAbsoluteCorpusPath(`${subFolderPath}${fileName}`, folder))
            .toEqual(`local:/${subFolderPath}${fileName}`);

        // Cases where the path provided is absolute.
        expect(corpus.storage.createAbsoluteCorpusPath(`${absoluteNamespace}${fileName}`, folder))
            .toEqual(`${absoluteNamespace}${fileName}`);
        expect(corpus.storage.createAbsoluteCorpusPath(`${absoluteNamespace}${subFolderPath}${fileName}`, folder))
            .toEqual(`${absoluteNamespace}${subFolderPath}${fileName}`);
    });
});