# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, List, Optional, TYPE_CHECKING

from cdm.objectmodel import CdmArgumentValue, CdmCorpusContext, CdmAttributeItem, CdmObjectReference, \
    CdmTraitReference, CdmTraitGroupReference, CdmCollection
from cdm.utilities import JObject, IdentifierRef, ResolveOptions, CopyOptions

from .attribute_group_reference_persistence import AttributeGroupReferencePersistence
from .data_type_reference_persistence import DataTypeReferencePersistence
from .entity_attribute_persistence import EntityAttributePersistence
from .entity_reference_persistence import EntityReferencePersistence
from .purpose_reference_persistence import PurposeReferencePersistence
from .trait_reference_persistence import TraitReferencePersistence
from .trait_group_reference_persistence import TraitGroupReferencePersistence
from .type_attribute_persistence import TypeAttributePersistence
from .types import AttributeGroupReference, CdmJsonType, EntityAttribute, TypeAttribute, TraitGroupReference, \
    TraitReference

if TYPE_CHECKING:
    pass


def create_trait_reference_array(ctx: CdmCorpusContext,
                                 obj: Optional[List[Union[str, TraitReference, TraitGroupReference]]]) \
        -> Optional[List[Union[CdmTraitReference, CdmTraitGroupReference]]]:
    """
    Converts a JSON object to a CdmCollection of TraitReferences.
    If object is not a list, returns None.
    """

    if not obj or not isinstance(obj, List):
        # Nothing to do
        return None

    result = []

    for elem in obj:
        if not isinstance(elem, str) and elem.traitGroupReference is not None:
            result.append(TraitGroupReferencePersistence.from_data(ctx, elem))
        else:
            result.append(TraitReferencePersistence.from_data(ctx, elem))

    return result


def add_list_to_cdm_collection(cdm_collection: CdmCollection, the_list: List) -> None:
    """Adds all elements of a list to a CdmCollection"""
    if cdm_collection is not None and the_list is not None:
        for element in the_list:
            cdm_collection.append(element)


def create_constant(ctx: CdmCorpusContext, obj: CdmJsonType) -> Optional[CdmArgumentValue]:
    """Creates a CDM object from a JSON object"""
    if obj is None:
        return None

    if isinstance(obj, str) or not isinstance(obj, JObject):
        return obj

    if obj.get('purpose') or obj.get('dataType') or obj.get('entity'):
        if obj.get('dataType'):
            return TypeAttributePersistence.from_data(ctx, obj)
        elif obj.get('entity'):
            return EntityAttributePersistence.from_data(ctx, obj)
        return obj
    elif obj.get('purposeReference'):
        return PurposeReferencePersistence.from_data(ctx, obj)
    elif obj.get('traitReference'):
        return TraitReferencePersistence.from_data(ctx, obj)
    elif obj.get('traitGroupReference'):
        return TraitGroupReferencePersistence.from_data(ctx, obj)
    elif obj.get('dataTypeReference'):
        return DataTypeReferencePersistence.from_data(ctx, obj)
    elif obj.get('entityReference'):
        return EntityReferencePersistence.from_data(ctx, obj)
    elif obj.get('attributeGroupReference'):
        return AttributeGroupReferencePersistence.from_data(ctx, obj)
    else:
        return obj


def create_attribute(ctx: CdmCorpusContext, obj: Union[str, 'AttributeGroupReference', 'EntityAttribute', 'TypeAttribute'], entity_name: Optional[str] = None) -> Optional['CdmAttributeItem']:
    """Converts a JSON object to an Attribute object"""
    if obj is None:
        return None
    if isinstance(obj, str) or 'attributeGroupReference' in obj:
        return AttributeGroupReferencePersistence.from_data(ctx, obj, entity_name)
    if 'entity' in obj:
        return EntityAttributePersistence.from_data(ctx, obj)
    if 'name' in obj:
        return TypeAttributePersistence.from_data(ctx, obj, entity_name)
    return None


def create_attribute_array(ctx: CdmCorpusContext, obj: Optional[List[Union[str, AttributeGroupReference, EntityAttribute, TypeAttribute]]], entity_name: Optional[str] = None) \
        -> Optional[List[CdmAttributeItem]]:
    """Converts a JSON object to a CdmCollection of attributes"""

    if obj is None:
        return None

    result = []
    for elem in obj:
        result.append(create_attribute(ctx, elem, entity_name))

    return result


def copy_identifier_ref(obj_ref: CdmObjectReference, res_opt: ResolveOptions, options: CopyOptions) -> Union[str, 'IdentifierRef']:
    identifier = obj_ref.named_reference

    if options is None or not options.string_refs:
        return identifier

    resolved = obj_ref.fetch_object_definition(res_opt)

    if resolved is None:
        return identifier

    ident_ref = IdentifierRef()
    ident_ref.corpus_path = resolved.at_corpus_path
    ident_ref.identifier = identifier

    return ident_ref

def _property_from_data_to_string(value) -> Optional[str]:
    if value is not None and value != '' and isinstance(value, str):
        return value
    if isinstance(value, int):
        return str(value)
    return None

def _property_from_data_to_int(value) -> Optional[int]:
    if value is None or isinstance(value, int):
        return value
    if isinstance(value, str):
        try:
            return int(value)
        except ValueError:
            # string is not a valid number
            pass
    return None

def _property_from_data_to_bool(value) -> Optional[bool]:
    if value is None or isinstance(value, bool):
        return value
    if isinstance(value, str):
        if value in ['True', 'true']:
            return True
        elif value in ['False', 'false']:
            return False
    return None
