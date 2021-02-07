# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from unittest import TestCase

from cdm.objectmodel import CdmAttributeContext, CdmAttributeReference, CdmCollection, CdmAttributeItem, \
    CdmTypeAttributeDefinition, CdmAttributeGroupReference


class ObjectValidator:
    """Helper class that supports validation of the actual object wrt expected object."""

    @staticmethod
    def validate_attribute_context(test: 'TestCase', expected: 'AttributeContextExpectedValue', actual: 'CdmAttributeContext') -> None:
        if not expected or not actual:
            test.assertIsNone(expected)
            test.assertIsNone(actual)
            return

        test.assertEqual(expected.type.lower(), actual.type.name.lower().replace('_', ''))
        test.assertEqual(expected.name, actual.name);
        if actual.parent:
            test.assertEqual(expected.parent, actual.parent.named_reference)
        if expected.definition and actual.definition:
            test.assertEqual(expected.definition, actual.definition.named_reference)
        exp_count = 0
        if expected.contexts and len(expected.contexts) > 0:
            exp_count += len(expected.contexts)
        if expected.context_strings and len(expected.context_strings) > 0:
            exp_count += len(expected.context_strings)
        test.assertEqual(exp_count, len(actual.contents))

        ac = 0
        acs = 0
        for i in range(len(actual.contents)):
            if isinstance(actual.contents[i], CdmAttributeContext):
                ObjectValidator.validate_attribute_context(test,expected.contexts[ac], actual.contents[i])
                ac += 1
            elif isinstance(actual.contents[i], CdmAttributeReference):
                exp = expected.context_strings[acs]
                act = actual.contents[i]  # type: CdmAttributeReference
                test.assertEqual(exp, act.named_reference)
            else:
                raise NotImplementedError('validate_attribute_context: isinstance(Unknown)')

    @staticmethod
    def validate_attributes_collection(test, expected: 'List[AttributeExpectedValue]', actual: 'CdmCollection[CdmAttributeItem]') -> None:
        test.assertEqual(len(expected), len(actual))
        for i in range(len(actual)):
            if isinstance(actual[i], CdmTypeAttributeDefinition):
                exp = expected[i]
                act = actual[i]  # type: CdmTypeAttributeDefinition
                ObjectValidator.validate_type_attribute_definition(test, exp, act)
            elif isinstance(actual[i], CdmAttributeGroupReference):
                exp = expected[i]
                act = actual[i]  # type: CdmAttributeGroupReference
                ObjectValidator.validate_attribute_group_ref(test, exp, act)

    @staticmethod
    def validate_type_attribute_definition(test, expected: 'AttributeExpectedValue', actual: 'CdmTypeAttributeDefinition') -> None:
        test.assertEqual(expected.data_format.lower(), actual.data_format.value.lower())
        test.assertEqual(expected.data_type, actual.data_type)
        test.assertEqual(expected.description, actual.description)
        test.assertEqual(expected.display_name, actual.display_name)
        test.assertEqual(expected.explanation, actual.explanation)
        test.assertEqual(expected.is_nullable, actual.is_nullable)
        test.assertEqual(expected.is_primary_key, actual.is_primary_key)
        test.assertEqual(expected.is_read_only, actual.is_read_only)
        test.assertEqual(expected.maximum_length, actual.maximum_length)
        test.assertEqual(expected.maximum_value, actual.maximum_value)
        test.assertEqual(expected.minimum_value, actual.minimum_value)
        test.assertEqual(expected.name, actual.name)
        test.assertEqual(expected.purpose, actual.purpose)
        test.assertEqual(expected.source_name, actual.source_name)
        if expected.source_ordering:
            test.assertEqual(expected.source_ordering, actual.source_ordering)

    @staticmethod
    def validate_attribute_group_ref(test, expected: 'AttributeExpectedValue', actual: 'CdmAttributeGroupReference') -> None:
        if expected.attribute_group_name or expected.members:
            if actual.explicit_reference:
                actual_obj = actual.explicit_reference

                if expected.attribute_group_name:
                    test.assertEqual(expected.attribute_group_name, actual_obj.attribute_group_name)
                if expected.attribute_context:
                    test.assertEqual(expected.attribute_context, actual_obj.attribute_context.named_reference)
                if expected.members:
                    test.assertEqual(len(expected.members), len(actual_obj._members))

                    for i in range(len(actual_obj._members)):
                        if isinstance(actual_obj._members[i], CdmTypeAttributeDefinition):
                            exp = expected.members[i]
                            act = actual_obj._members[i]  # type: CdmTypeAttributeDefinition
                            ObjectValidator.validate_type_attribute_definition(test, exp, act)
                        elif isinstance(actual_obj._members[i], CdmAttributeGroupReference):
                            exp = expected.members[i]
                            act = actual_obj._members[i]  # type: CdmAttributeGroupReference
                            ObjectValidator.validate_attribute_group_ref(test, exp, act)
                        else:
                            raise NotImplementedError('Unknown type!')


class AttributeContextExpectedValue:
    """Class to contain AttributeContext's expected values."""

    def __init__(self):
        self.type = None  # type: str
        self.name = None  # type: str
        self.parent = None  # type: str
        self.definition = None  # type: str
        self.contexts = None  # type: List[AttributeContextExpectedValue]
        self.context_strings = None  # type: List[str]


class AttributeExpectedValue:
    """Class to contain Attribute's expected values."""

    def __init__(self):
        self.data_format = None  # type: str
        self.data_type = None  # type: str
        self.description = None  # type: str
        self.display_name = None  # type: str
        self.explanation = None  # type: str
        self.is_nullable = False  # type: bool
        self.is_primary_key = False  # type: bool
        self.is_read_only = False  # type: bool
        self.maximum_length = None  # type: str
        self.maximum_value = None  # type: str
        self.minimum_value = None  # type: str
        self.name = None  # type: str
        self.purpose = None  # type: str
        self.source_name = None  # type: str
        self.source_ordering = 0  # type: int
        self.attribute_context = None  # type: str
        self.attribute_group_name = None  # type: str
        self.members = None  # type: List[AttributeExpectedValue]
