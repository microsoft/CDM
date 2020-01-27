import unittest
from tests.common import async_test
from cdm.objectmodel import CdmTraitReference, CdmArgumentDefinition, CdmLocalEntityDeclarationDefinition
from .cdm_collection_helper_functions import generate_manifest


class CdmArgumentCollectionTests(unittest.TestCase):
    @async_test
    def test_cdm_argument_collection_add(self):
        trait = self._generate_trait()
        argument_definition = CdmArgumentDefinition(trait.ctx, None)

        trait._resolved_arguments = True
        self.assertEqual(0, len(trait.arguments))
        added_argument = trait.arguments.append(argument_definition)
        self.assertEqual(argument_definition, added_argument)
        self.assertEqual(1, len(trait.arguments))
        self.assertEqual(argument_definition, trait.arguments[0])
        self.assertFalse(trait._resolved_arguments)
        self.assertEqual(trait, trait.arguments[0].owner)

        trait._resolved_arguments = True
        trait.arguments.append('nameOfTrait', 'ValueOfTrait')
        self.assertEqual(2, len(trait.arguments))
        self.assertEqual('nameOfTrait', trait.arguments[1].name)
        self.assertEqual('ValueOfTrait', trait.arguments[1].value)
        self.assertEqual(trait, trait.arguments[1].owner)

    @async_test
    def test_cdm_argument_collection_insert(self):
        trait = self._generate_trait()
        to_insert = CdmArgumentDefinition(trait.ctx, None)
        arg1 = trait.arguments.append('arg1')
        arg2 = trait.arguments.append('arg2')
        trait._resolved_arguments = True
        trait.arguments.insert(1, to_insert)

        self.assertEqual(3, len(trait.arguments))
        self.assertFalse(trait._resolved_arguments)
        self.assertEqual(arg1, trait.arguments[0])
        self.assertEqual(to_insert, trait.arguments[1])
        self.assertEqual(arg2, trait.arguments[2])
        self.assertEqual(trait, trait.arguments[1].owner)

    @async_test
    def test_cdm_argument_collection_add_range(self):
        trait = self._generate_trait()
        trait._resolved_arguments = True
        arg_list = []

        argument_definition = CdmArgumentDefinition(trait.ctx, 'Arg1')
        argument_definition.value = 123
        arg_list.append(argument_definition)

        argument_definition = CdmArgumentDefinition(trait.ctx, 'Arg2')
        valOfArg2 = generate_manifest('C://Nothing')
        argument_definition.value = valOfArg2
        arg_list.append(argument_definition)

        trait.arguments.extend(arg_list)
        self.assertEqual(2, len(trait.arguments))
        self.assertFalse(trait._resolved_arguments)
        self.assertEqual('Arg1', trait.arguments[0].name)
        self.assertEqual(123, trait.arguments[0].value)
        self.assertEqual(trait, trait.arguments[0].owner)
        self.assertEqual('Arg2', trait.arguments[1].name)
        self.assertEqual(valOfArg2, trait.arguments[1].value)

    @async_test
    def test_cdm_argument_collection_fetch_value_or_only_value(self):
        trait = self._generate_trait()
        trait._resolved_arguments = True
        trait.arguments.append(None, 'ValueOfTrait')

        value = trait.arguments.fetch_value('NameOfTrait')
        # This is what is needed by current code.
        self.assertEqual('ValueOfTrait', value)

        argumentDefinition = CdmArgumentDefinition(trait.ctx, None)

        trait.ResolvedArguments = True
        trait.arguments.append(argumentDefinition)

        trait.ResolvedArguments = True
        trait.arguments.append('TraitName', 'Value of a named trait')

        value = trait.arguments.fetch_value('TraitName')
        self.assertEqual('Value of a named trait', value)

    @async_test
    def test_cdm_argument_collection_update_argument(self):
        trait = self._generate_trait()

        trait.arguments.append('NameOfTrait', 'ValueOfTrait')
        trait.arguments.append('NameOfOtherTrait', 'ValueOfOtherTrait')

        trait.arguments.update_argument('NameOfOtherTrait', 'UpdatedValue')
        trait.arguments.update_argument('ThirdArgumentName', 'ThirdArgumentValue')

        self.assertEqual(3, len(trait.arguments))
        self.assertEqual('ValueOfTrait', trait.arguments[0].value)
        self.assertEqual('UpdatedValue', trait.arguments[1].value)
        self.assertEqual('ThirdArgumentName', trait.arguments[2].name)
        self.assertEqual('ThirdArgumentValue', trait.arguments[2].value)
        self.assertEqual(trait, trait.arguments[2].owner)

    def test_cdm_collection_add_populates_in_document_with_visit(self):
        manifest = generate_manifest('C:\\Nothing')
        entity_reference = CdmLocalEntityDeclarationDefinition(manifest.ctx, 'entityName')
        trait = entity_reference.exhibits_traits.append('theTrait')
        argument = trait.arguments.append('GreatArgumentName', 'GreatValue')

        manifest.entities.append(entity_reference)

        self.assertEqual(manifest, manifest.in_document)
        self.assertEqual(manifest, entity_reference.in_document)
        self.assertEqual(manifest, trait.in_document)
        self.assertEqual(manifest, argument.in_document)

    def _generate_trait(self) -> 'CdmTraitReference':
        manifest = generate_manifest('C:\\Nothing')
        return CdmTraitReference(manifest.ctx, 'traitName', False)
