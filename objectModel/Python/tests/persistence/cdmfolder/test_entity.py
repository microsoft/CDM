import os
import unittest

from cdm.storage import LocalAdapter
from cdm.objectmodel import CdmCorpusDefinition, CdmTypeAttributeDefinition

from tests.common import async_test

from . import ROOT_PATH


class TestEntity(unittest.TestCase):
    @async_test
    async def test_entity_properties(self):
        test_input_path = os.path.join(ROOT_PATH, 'entity')
        corpus = CdmCorpusDefinition()
        corpus.ctx.update_logging_options(level='WARNING')
        corpus.storage.mount('local', LocalAdapter(test_input_path))
        corpus.storage.default_namespace = 'local'

        obj = await corpus.fetch_object_async('local:/entA.cdm.json/Entity A')
        att = obj.attributes[0]  # type: CdmTypeAttributeDefinition
        result = next(filter(lambda x: x.named_reference == 'is.constrained', att.applied_traits), None)

        self.assertIsNotNone(result)
        self.assertEqual(att.maximum_length, 30)
        self.assertIsNone(att.maximum_value)
        self.assertIsNone(att.minimum_value)

        # removing the only argument should remove the trait
        att.maximum_length = None
        result = next(filter(lambda x: x.named_reference == 'is.constrained', att.applied_traits), None)
        self.assertIsNone(att.maximum_length)
        self.assertIsNone(result)
