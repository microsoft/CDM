# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest


class ProjectionResolutionCommonUtilUnitTest(unittest.TestCase):
    """Unit test for ProjectionResolutionCommonUtil functions"""

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestProjectionResolutionCommonUtil')

    res_opts_combinations = [
        [],
        ['referenceOnly'],
        ['normalized'],
        ['structured'],
        ['referenceOnly', 'normalized'],
        ['referenceOnly', 'structured'],
        ['normalized', 'structured'],
        ['referenceOnly', 'normalized', 'structured']
    ]

    # TODO (sukanyas): Need to add Tests
