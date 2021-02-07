# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import unittest
from tests.common import async_test
from cdm.objectmodel import CdmFolderDefinition
from .cdm_collection_helper_functions import generate_manifest


class CdmFolderCollectionTests(unittest.TestCase):
    @async_test
    def test_folder_collection_add(self):
        manifest = generate_manifest('C:\\Root\\Path')

        parent_folder = CdmFolderDefinition(manifest.ctx, 'ParentFolder')
        parent_folder.namespace = 'TheNamespace'
        parent_folder.folder_path = 'ParentFolderPath/'

        child_folders = parent_folder.child_folders
        child_folder = CdmFolderDefinition(manifest.ctx, 'ChildFolder1')

        self.assertEqual(0, len(child_folders))
        added_child_folder = child_folders.append(child_folder)
        self.assertEqual(1, len(child_folders))
        self.assertEqual(child_folder, child_folders[0])
        self.assertEqual(child_folder, added_child_folder)
        self.assertEqual(manifest.ctx, child_folder.ctx)
        self.assertEqual('ChildFolder1', child_folder.name)
        self.assertEqual(parent_folder, child_folder.owner)
        self.assertEqual('TheNamespace', child_folder.namespace)
        self.assertEqual(parent_folder.folder_path + child_folder.name + '/', child_folder.folder_path)

    @async_test
    def test_cdm_trait_collection_insert(self):
        manifest = generate_manifest('C:\\Root\\Path')
        parent_folder = CdmFolderDefinition(manifest. ctx, 'ParentFolder')
        parent_folder.in_document = manifest
        parent_folder.namespace = 'TheNamespace'
        parent_folder.folder_path = 'ParentFolderPath/'

        child_folders = parent_folder.child_folders
        child_folder = CdmFolderDefinition(manifest.ctx, 'ChildFolder1')

        child1 = child_folders.append('child1')
        child2 = child_folders.append('child2')
        child_folder._is_dirty = False

        child_folders.insert(1, child_folder)

        self.assertEqual(3, len(child_folders))
        self.assertTrue(manifest._is_dirty)
        self.assertEqual(child1, child_folders[0])
        self.assertEqual(child_folder, child_folders[1])
        self.assertEqual(child2, child_folders[2])
        self.assertEqual(manifest.ctx, child_folder.ctx)
        self.assertEqual('ChildFolder1', child_folder.name)
        self.assertEqual(parent_folder, child_folder.owner)
        self.assertEqual('TheNamespace', child_folder.namespace)
        self.assertEqual(parent_folder.folder_path + child_folder.name + '/', child_folder.folder_path)

    @async_test
    def test_folder_collection_add_with_name_parameter(self):
        manifest = generate_manifest('C:\\Root\\Path')
        parent_folder = CdmFolderDefinition(manifest. ctx, 'ParentFolder')
        parent_folder.namespace = 'TheNamespace'
        parent_folder.folder_path = 'ParentFolderPath/'

        child_folders = parent_folder.child_folders

        self.assertEqual(0, len(child_folders))
        child_folder = child_folders.append('ChildFolder1')
        self.assertEqual(1, len(child_folders))
        self.assertEqual(child_folder, child_folders[0])
        self.assertEqual(manifest.ctx, child_folder.ctx)
        self.assertEqual('ChildFolder1', child_folder.name)
        self.assertEqual(parent_folder, child_folder.owner)
        self.assertEqual('TheNamespace', child_folder.namespace)
        self.assertEqual(parent_folder.folder_path + child_folder.name + '/', child_folder.folder_path)

    @async_test
    def test_folder_collection_add_range(self):
        manifest = generate_manifest('C:\\Root\\Path')
        parent_folder = CdmFolderDefinition(manifest. ctx, 'ParentFolder')
        parent_folder.namespace = 'TheNamespace'
        parent_folder.folder_path = 'ParentFolderPath/'

        child_folders = parent_folder.child_folders
        child_folder = CdmFolderDefinition(manifest.ctx, 'ChildFolder1')
        child_folder2 = CdmFolderDefinition(manifest.ctx, 'ChildFolder2')

        child_list = [child_folder, child_folder2]

        self.assertEqual(0, len(child_folders))
        child_folders.extend(child_list)
        self.assertEqual(2, len(child_folders))
        self.assertEqual(child_folder, child_folders[0])
        self.assertEqual(manifest.ctx, child_folder.ctx)
        self.assertEqual('ChildFolder1', child_folder.name)
        self.assertEqual(parent_folder, child_folder.owner)
        self.assertEqual('TheNamespace', child_folder.namespace)
        self.assertEqual(parent_folder.folder_path + child_folder.name + '/', child_folder.folder_path)

        self.assertEqual(child_folder2, child_folders[1])
        self.assertEqual('ChildFolder2', child_folder2.name)
        self.assertEqual(parent_folder, child_folder2.owner)
        self.assertEqual('TheNamespace', child_folder2.namespace)
        self.assertEqual(parent_folder.folder_path + child_folder2.name + '/', child_folder2.folder_path)

    @async_test
    def test_folder_collection_remove(self):
        manifest = generate_manifest('C:\\Root\\Path')
        parent_folder = CdmFolderDefinition(manifest. ctx, 'ParentFolder')
        parent_folder.namespace = 'TheNamespace'
        parent_folder.folder_path = 'ParentFolderPath/'

        child_folders = parent_folder.child_folders
        child_folder = CdmFolderDefinition(manifest.ctx, 'ChildFolder1')

        self.assertEqual(0, len(child_folders))
        child_folders.append(child_folder)
        self.assertEqual(1, len(child_folders))
        child_folders.remove(child_folder)
        self.assertEqual(0, len(child_folders))
