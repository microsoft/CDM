# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmStatusLevel
from cdm.objectmodel import CdmEntityDefinition
from .resolution_test_utils import resolve_save_debugging_file_and_assert

from tests.common import async_test, TestHelper


class EntityResolutionTraitGroup(unittest.TestCase):
    tests_sub_path = os.path.join('Cdm', 'Resolution', 'EntityResolution')

    @async_test
    async def test_resolved_trait_group_e2e(self):
        """Verify success case and make sure the entities are resolved"""

        await resolve_save_debugging_file_and_assert(self, self.tests_sub_path,
                                                     'TestResolvedTraitGroup', 'E2EResolution')

    @async_test
    async def test_traits_from_trait_group(self):
        """
        Verify that the traits are assigned appropriately.
        AND no errors or warnings are thrown.
        If the optional traitgroups are not ignored, then this will fail.
        """
        corpus = TestHelper.get_local_corpus(self.tests_sub_path, 'TestResolvedTraitGroup')

        def callback(status_level: 'CdmStatusLevel', message: str):
            self.fail('Received {} message: {}'.format(status_level, message))
        corpus.set_event_callback(callback, CdmStatusLevel.WARNING)

        ent = await corpus.fetch_object_async('local:/E2EResolution/Contact.cdm.json/Contact')  # type: CdmEntityDefinition
        await ent.create_resolved_entity_async('Contact_')
