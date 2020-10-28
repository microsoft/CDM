# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
from os.path import isfile, join
from os import listdir
from shutil import copytree, ignore_patterns, rmtree
import distutils.cmd
import distutils.log
import setuptools

from typing import List, Optional


class CopyResourcesCommand(distutils.cmd.Command):
    """A command which is copying the resources from SchemaDocuments."""

    description = 'Copy resources from schema documents into this project.'  # type: Optional[str]

    user_options = []  # type: List

    def copy_and_overwrite(self, from_path, to_path, paths_to_ignore):
        """Copies the folder from path and overwrites the to path folder."""
        if os.path.exists(to_path):
            rmtree(to_path)
        copytree(from_path, to_path, ignore=ignore_patterns(*paths_to_ignore))

    def initialize_options(self):
        pass

    def finalize_options(self):
        pass

    def run(self):
        print("Copying files from schema documents....")
        root_path = os.getcwd()

        paths_to_ignore = ['*.manifest.cdm.json', '*.0.6.cdm.json', '*.0.7.cdm.json', '*.0.8.cdm.json', '*.0.8.1.cdm.json',
                           '*.0.9.cdm.json', '*.1.0.cdm.json', '*core*', '*office*', '*.git*', '*.jpg', '*.md']

        self.copy_and_overwrite('{}/../../schemaDocuments/'.format(root_path), '{}/resources/'.format(root_path), paths_to_ignore)


def list_files_in_folder(folders):
    """Finds all files in a folder, used by data files in setuptools as it has to be in this format."""
    path = '/'.join(folders)
    if os.path.exists(path):
        return [join(*folders, f) for f in listdir(path) if isfile(join(*folders, f))]


with open("README.md", "r") as fh:
    long_description = fh.read()

dependencies = [
    "adal==1.2.4",
    "asn1crypto==0.24.0",
    "astroid==2.2.5",
    "atomicwrites==1.3.0",
    "attrs==19.1.0",
    "certifi==2019.6.16",
    "cffi==1.12.3",
    "chardet==3.0.4",
    "colorama==0.4.1",
    "cryptography==2.8",
    "idna==2.8",
    "importlib-metadata==0.19",
    "lazy-object-proxy==1.3.1",
    "nest-asyncio==1.4.0",
    "mccabe==0.6.1",
    "more-itertools==7.2.0",
    "packaging==19.1",
    "pathlib2==2.3.4",
    "pluggy==0.12.0",
    "py==1.8.0",
    "pycodestyle==2.5.0",
    "pycparser==2.19",
    "PyJWT==1.7.1",
    "pyparsing==2.4.2",
    "python-dateutil==2.8.0",
    "regex==2019.8.19",
    "requests==2.22.0",
    "rope==0.14.0",
    "six==1.12.0",
    "typed-ast==1.4.0",
    "typing-extensions==3.7.4",
    "urllib3==1.25.8",
    "wcwidth==0.1.7",
    "wrapt==1.11.1",
    "zipp==0.5.2"
]
setuptools.setup(
    name="commondatamodel-objectmodel",
    version="1.0.12",
    author="Microsoft",
    description="Common Data Model Object Model library for Python",
    url="https://github.com/pypa/commondatamodel-objectmodel",
    packages=setuptools.find_packages(),
    install_requires=dependencies,
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
