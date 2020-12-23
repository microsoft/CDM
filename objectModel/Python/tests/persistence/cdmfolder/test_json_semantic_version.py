# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import os
import unittest

from cdm.enums import CdmStatusLevel

from tests.common import async_test, TestHelper

class JsonSemanticVersionTest(unittest.TestCase):
    """Set of tests to verify behavior of loading a document with different semantic versions."""
    # The path between test_data_path and test_name.
    tests_subpath = os.path.join('Persistence', 'CdmFolder', 'JsonSemanticVersionTest')

    @async_test
    async def test_loading_unsupported_version(self):
        """Test loading a document with a semantic version bigger than the one supported."""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_loading_unsupported_version')
        error_count = 0

        def callback_resolved(level, message):
            nonlocal error_count
            if 'This ObjectModel version supports json semantic version' in message and level == CdmStatusLevel.WARNING:
                error_count += 1

        # Test loading a resolved document.
        corpus.set_event_callback(callback_resolved, CdmStatusLevel.WARNING)
        await corpus.fetch_object_async('local:/resolvedDoc.cdm.json')  # type: CdmDocumentDefinition
        if error_count != 1:
            self.fail('Should have logged a warning.')
        error_count = 0

        def callback_logical(level, message):
            nonlocal error_count
            if 'This ObjectModel version supports json semantic version' in message and level == CdmStatusLevel.ERROR:
                error_count += 1

        # Test loading a logical document.
        corpus.set_event_callback(callback_logical, CdmStatusLevel.ERROR)
        await corpus.fetch_object_async('local:/logicalDoc.cdm.json')  # type: CdmDocumentDefinition
        if error_count != 1:
            self.fail('Should have logged an error.')
        error_count = 0

        def callback_missing(level, message):
            nonlocal error_count
            if 'jsonSemanticVersion is a required property of a document.' in message and level == CdmStatusLevel.WARNING:
                error_count += 1

        # Test loading a document missing the jsonSemanticVersion property.
        corpus.set_event_callback(callback_missing, CdmStatusLevel.WARNING)
        await corpus.fetch_object_async('local:/missingDoc.cdm.json')  # type: CdmDocumentDefinition
        if error_count != 1:
            self.fail('Should have logged a warning for missing property.')

    @async_test
    async def test_loading_invalid_version(self):
        """Test loading a document with an invalid semantic version."""
        corpus = TestHelper.get_local_corpus(self.tests_subpath, 'test_loading_invalid_version')
        error_count = 0

        def callback_resolved(level, message):
            nonlocal error_count
            if 'jsonSemanticVersion must be set using the format <major>.<minor>.<patch>.' in message and level == CdmStatusLevel.WARNING:
                error_count += 1

        # Test loading a version format "a.0.0".
        corpus.set_event_callback(callback_resolved, CdmStatusLevel.WARNING)
        await corpus.fetch_object_async('local:/invalidVersionDoc.cdm.json')  # type: CdmDocumentDefinition
        if error_count != 1:
            self.fail('Should have logged a warning.')
        error_count = 0
        
        # Test loading a version format "1.0".
        corpus.set_event_callback(callback_resolved, CdmStatusLevel.WARNING)
        await corpus.fetch_object_async('local:/invalidFormatDoc.cdm.json')  # type: CdmDocumentDefinition
        if error_count != 1:
            self.fail('Should have logged a warning.')
