// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmFolderCollection,
    CdmFolderDefinition,
    CdmManifestDefinition
} from '../../../internal';
import {generateManifest} from './CdmCollectionHelperFunctions';

describe ('Cdm/CdmCollection/CdmFolderCollection', () => {
    it ('TestFolderCollectionAdd', () => {
        const manifest: CdmManifestDefinition = generateManifest();
        const parentFolder : CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'parentFolder');
        parentFolder.namespace = 'theNamespace';
        parentFolder.folderPath = 'parentFolderPath/';

        const childFolders : CdmFolderCollection = parentFolder.childFolders;
        const childFolder : CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'childFolder1');

        expect(childFolders.length)
            .toEqual(0);
        const addedChildFolder: CdmFolderDefinition = childFolders.push(childFolder);
        expect(childFolders.length)
            .toEqual(1);
        expect(childFolders.allItems[0])
            .toEqual(childFolder);
        expect(addedChildFolder)
            .toEqual(childFolder);
        expect(childFolder.ctx)
            .toEqual(manifest.ctx);
        expect(childFolder.name)
            .toEqual('childFolder1');
        expect(childFolder.owner)
            .toEqual(parentFolder);
        expect(childFolder.namespace)
            .toEqual('theNamespace');
        expect(childFolder.folderPath)
            .toEqual(`${parentFolder.folderPath}${childFolder.name}/`);
    });

    it ('TestFolderCollectionInsert', () => {
        const manifest: CdmManifestDefinition = generateManifest();
        const parentFolder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'parentFolder');
        parentFolder.inDocument = manifest;
        parentFolder.namespace = 'namespace';
        parentFolder.folderPath = 'parentFolderPath/';

        const childFolders: CdmFolderCollection = parentFolder.childFolders;
        const childFolder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'childFolder1');

        const child1: CdmFolderDefinition = childFolders.push('child1');
        const child2: CdmFolderDefinition = childFolders.push('child2');
        manifest.isDirty = false;

        childFolders.insert(1, childFolder);

        expect(childFolders.length)
            .toEqual(3);
        expect(manifest.isDirty)
            .toBeTruthy();
        expect(childFolders.allItems[0])
            .toEqual(child1);
        expect(childFolders.allItems[1])
            .toEqual(childFolder);
        expect(childFolders.allItems[2])
            .toEqual(child2);
        expect(childFolder.ctx)
            .toEqual(manifest.ctx);
        expect(childFolder.name)
            .toEqual('childFolder1');
        expect(childFolder.owner)
            .toEqual(parentFolder);
        expect(childFolder.namespace)
            .toEqual('namespace');
        expect(childFolder.folderPath)
            .toEqual(`${parentFolder.folderPath}${childFolder.name}/`);
    });

    it ('TestFolderCollectionAddWithNameParameter', () => {
        const manifest: CdmManifestDefinition = generateManifest();
        const parentFolder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'parentFolder');
        parentFolder.namespace = 'namespace';
        parentFolder.folderPath = 'parentFolderPath/';

        const childFolders: CdmFolderCollection = parentFolder.childFolders;

        expect(childFolders.length)
            .toEqual(0);
        const childFolder : CdmFolderDefinition = childFolders.push('childFolder1');
        expect(childFolders.length)
            .toEqual(1);
        expect(childFolders.allItems[0])
            .toEqual(childFolder);
        expect(childFolder.ctx)
            .toEqual(manifest.ctx);
        expect(childFolder.name)
            .toEqual('childFolder1');
        expect(childFolder.owner)
            .toEqual(parentFolder);
        expect(childFolder.namespace)
            .toEqual('namespace');
        expect(childFolder.folderPath)
            .toEqual(`${parentFolder.folderPath}${childFolder.name}/`);
    });

    it ('TestFolderCollectionAddRange', () => {
        const manifest: CdmManifestDefinition = generateManifest();
        const parentFolder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'parentFolder');
        parentFolder.namespace = 'namespace';
        parentFolder.folderPath = 'parentFolderPath/';

        const childFolders: CdmFolderCollection = parentFolder.childFolders;
        const childFolder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'childFolder1');
        const childFolder2 : CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'childFolder2');
        const childList : CdmFolderDefinition[] = [childFolder, childFolder2];

        expect(childFolders.length)
            .toEqual(0);
        childFolders.concat(childList);
        expect(childFolders.length)
            .toEqual(2);
        expect(childFolders.allItems[0])
            .toEqual(childFolder);
        expect(childFolder.ctx)
            .toEqual(manifest.ctx);
        expect(childFolder.name)
            .toEqual('childFolder1');
        expect(childFolder.owner)
            .toEqual(parentFolder);
        expect(childFolder.namespace)
            .toEqual('namespace');
        expect(childFolder.folderPath)
            .toEqual(`${parentFolder.folderPath}${childFolder.name}/`);
    });

    it ('TestFolderCollectionRemove', () => {
        const manifest: CdmManifestDefinition = generateManifest();
        const parentFolder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'parentFolder');
        parentFolder.namespace = 'namespace';
        parentFolder.folderPath = 'parentFolderPath/';

        const childFolders: CdmFolderCollection = parentFolder.childFolders;
        const childFolder: CdmFolderDefinition = new CdmFolderDefinition(manifest.ctx, 'childFolder1');

        expect(childFolders.length)
            .toEqual(0);
        childFolders.push(childFolder);
        expect(childFolders.length)
            .toEqual(1);
        childFolders.remove(childFolder);
        expect(childFolders.length)
            .toEqual(0);
    });
});
