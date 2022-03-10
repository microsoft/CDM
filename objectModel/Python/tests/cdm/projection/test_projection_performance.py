# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import time
import unittest
from cdm.utilities.resolve_options import ResolveOptions

from tests.common import TestHelper, async_test
from cdm.objectmodel import CdmTypeAttributeDefinition


class ProjectionPerformanceTest(unittest.TestCase):
    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'ProjectionPerformanceTest')

    @async_test
    async def test_projection_performance_on_load(self):
        """A test class for testing the performance of projection operations"""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'TestProjectionPerformanceOnLoad')
        entity = await corpus.fetch_object_async('largeProjectionEntity.cdm.json/largeProjectionEntity')
        operation = entity.attributes[0].entity.explicit_reference.operations[0]
        attGroup = operation.new_attribute.explicit_reference

        # add a large number of attributes to the projection
        for i in range(10000):
            attGroup.members.append(CdmTypeAttributeDefinition(corpus.ctx, 'a' + str(i)))
        start = time.time()
        # reindex the entity to run through the visit function
        await entity.in_document._index_if_needed(ResolveOptions(entity.in_document), True)
        stop = time.time()
        self.assertLess(stop - start, 500)
