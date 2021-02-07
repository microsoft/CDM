// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmCorpusDefinition, CdmFolderDefinition } from '../../../internal';

/**
 * Tests the behavior of the fetchChildFolderFromPath function.
 */
// tslint:disable-next-line: max-func-body-length
describe('Cdm/FolderDetinition', () => {
    it ('testfetchChildFolderFromPath' , () => {
        const corpus = new CdmCorpusDefinition();
        let rootFolder = new CdmFolderDefinition(corpus.ctx, "");

        let folderPath = "/";
        let childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
        expect(childFolder.folderPath)
            .toEqual(folderPath);

        folderPath = "/";
        childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
        expect(childFolder.folderPath)
            .toEqual(folderPath);

        folderPath = "/core";
        childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
        expect(childFolder.folderPath)
            .toEqual("/");

        folderPath = "/core";
        childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
        expect(childFolder.folderPath)
            .toEqual(`${folderPath}/`);

        folderPath = "/core/";
        childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
        expect(childFolder.folderPath)
            .toEqual(folderPath);

        folderPath = "/core/";
        childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
        expect(childFolder.folderPath)
            .toEqual(folderPath);

        folderPath = "/core/applicationCommon";
        childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
        expect(childFolder.folderPath)
            .toEqual("/core/");

        folderPath = "/core/applicationCommon";
        childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
        expect(childFolder.folderPath)
            .toEqual(`${folderPath}/`);

        folderPath = "/core/applicationCommon/";
        childFolder = rootFolder.fetchChildFolderFromPath(folderPath, false);
        expect(childFolder.folderPath)
            .toEqual(folderPath);

        folderPath = "/core/applicationCommon/";
        childFolder = rootFolder.fetchChildFolderFromPath(folderPath, true);
        expect(childFolder.folderPath)
            .toEqual(folderPath);
    });
});