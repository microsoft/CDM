# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmStatusLevel

from tests.cdm.projection.attribute_context_util import AttributeContextUtil
from tests.common import async_test
from tests.utilities.projection_test_utils import ProjectionTestUtils


class ForwardCompatibilityTest(unittest.TestCase):
    """Tests all the projections will not break the OM even if not implemented."""

    # The path between TestDataPath and TestName.
    tests_subpath = os.path.join('Cdm', 'Projection', 'TestForwardCompatibility')

    @async_test
    async def test_all_operations(self):
        """Tests running all the projections (includes projections that are not implemented)."""
        test_name = 'TestAllOperations'
        entity_name = test_name
        corpus = ProjectionTestUtils.get_local_corpus(self.tests_subpath, test_name)

        def callback(level: CdmStatusLevel, message: str):
            if message.find('Projection operation not implemented yet.') == -1:
                self.fail('Some unexpected failure - {}!'.format(message))
        corpus.set_event_callback(callback, CdmStatusLevel.ERROR)

        await ProjectionTestUtils.load_entity_for_resolution_option_and_save(self, corpus, test_name, self.tests_subpath, entity_name, ['referenceOnly'])

