# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import setuptools

setuptools.setup(
    name='commondatamodel-objectmodel-cdmstandards',
    version='2.8.0',
    author='Microsoft',
    description='The Common Data Model standard schema and entities',
    url='https://github.com/microsoft/CDM/tree/master/objectModel/Python',
    packages=['schema_documents'],
    include_package_data=True,
    classifiers=[
        'Programming Language :: Python :: 3.5',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent'
    ]
)
