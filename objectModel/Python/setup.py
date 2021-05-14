# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
from os.path import isfile, join
from os import listdir
from shutil import copystat, ignore_patterns, rmtree, copy2
import distutils.cmd
import distutils.log
import setuptools

from typing import List, Optional


class CopyResourcesCommand(distutils.cmd.Command):
    """A command which is copying the resources from SchemaDocuments."""

    description = 'Copy resources from schema documents into this project.'  # type: Optional[str]

    user_options = []  # type: List

    def copy_files(self, from_path, to_path, paths_to_ignore):
        """Copies top-level files from the source folder to destination folder."""

        names = os.listdir(from_path)
        ignored_names = paths_to_ignore(from_path, names)

        os.makedirs(to_path)

        for name in names:
            if name in ignored_names:
                continue
            srcname = os.path.join(from_path, name)
            dstname = os.path.join(to_path, name)
            if os.path.isfile(srcname):
                copy2(srcname, dstname)

        copystat(from_path, to_path)

    def copy_and_overwrite(self, from_path, to_path, paths_to_ignore):
        """Copies the folder from path and overwrites the to path folder."""
        self.copy_files(from_path, to_path, ignore_patterns(*paths_to_ignore))

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        print("Copying files from schema documents....")
        root_path = os.getcwd()

        paths_to_ignore = ['*.manifest.cdm.json', '*.0.6.cdm.json', '*.0.7.cdm.json', '*.0.8.cdm.json', '*.0.8.1.cdm.json',
                           '*.0.9.cdm.json', '*.git*', '*.jpg', '*.md']

        paths_to_copy = ['.', 'cdmfoundation', 'extensions']

        to_path_root = '{}/resources/'.format(root_path)

        if os.path.exists(to_path_root):
            rmtree(to_path_root)

        for path in paths_to_copy:
            self.copy_and_overwrite('{}/../../schemaDocuments/{}'.format(root_path, path), '{}/resources/{}'.format(root_path, path), paths_to_ignore)


def list_files_in_folder(folders):
    """Finds all files in a folder, used by data files in setuptools as it has to be in this format."""
    path = '/'.join(folders)
    if os.path.exists(path):
        return [join(*folders, f) for f in listdir(path) if isfile(join(*folders, f))]


with open("README.md", "r") as fh:
    long_description = fh.read()

with open("requirements.txt", "r") as fh:
    requirements = fh.readlines()

with open("test_requirements.txt", "r") as fh:
    test_requirements = fh.readlines()

setuptools.setup(
    name="commondatamodel-objectmodel",
    version="1.2.0",
    author="Microsoft",
    description="Common Data Model Object Model library for Python",
    url="https://github.com/pypa/commondatamodel-objectmodel",
    packages=setuptools.find_packages(),
    install_requires=[req for req in requirements if req[:2] != "# "],
    data_files=[
        ('resources', list_files_in_folder(['resources'])),
        ('resources/extensions', list_files_in_folder(['resources', 'extensions'])),
    ],
    classifiers=[
        "Programming Language :: Python :: 3.5",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent"
    ],
    cmdclass={
        'copy_resources': CopyResourcesCommand
    }
)
