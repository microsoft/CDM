from typing import Union, List, Optional, TYPE_CHECKING

from cdm.objectmodel import CdmArgumentValue, CdmCorpusContext, CdmAttributeItem, CdmObjectReference, CdmTraitReference
from cdm.persistence import PersistenceLayer
from cdm.utilities import JObject, IdentifierRef, ResolveOptions, CopyOptions

from .attribute_group_reference_persistence import AttributeGroupReferencePersistence
from .data_type_reference_persistence import DataTypeReferencePersistence
from .entity_attribute_persistence import EntityAttributePersistence
from .entity_reference_persistence import EntityReferencePersistence
from .purpose_reference_persistence import PurposeReferencePersistence
from .trait_reference_persistence import TraitReferencePersistence
from .type_attribute_persistence import TypeAttributePersistence
from .types import AttributeGroupReference, CdmJsonType, EntityAttribute, TypeAttribute


if TYPE_CHECKING:
    from cdm.objectmodel import CdmCollection, CdmObject


def create_trait_reference_array(ctx: CdmCorpusContext, obj: Optional[List[Union[str, CdmTraitReference]]]) -> Optional[List[CdmTraitReference]]:
    """
    Converts a JSON object to a CdmCollection of TraitReferences.
    If object is not a list, returns None.
    """

    if not obj or not isinstance(obj, List):
        # Nothing to do
        return None

    result = []

    for elem in obj:
        result.append(TraitReferencePersistence.from_data(ctx, elem))

    return result


def array_copy_data(res_opt: ResolveOptions, source: Union['CdmCollection', List['CdmObject']], options: CopyOptions) -> Optional[List]:
    """Creates a list object that is a copy of the input IEnumerable object"""
    if not source:
        return None

    casted = []

    for elem in source:
        if elem:
            data = PersistenceLayer.to_data(elem, res_opt, 'CdmFolder', options)
            casted.append(data)

    return casted


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
    elif obj.get('dataTypeReference'):
        return DataTypeReferencePersistence.from_data(ctx, obj)
    elif obj.get('entityReference'):
        return EntityReferencePersistence.from_data(ctx, obj)
    elif obj.get('attributeGroupReference'):
        return AttributeGroupReferencePersistence.from_data(ctx, obj)
    else:
        return obj


def create_attribute(ctx: CdmCorpusContext, obj: Union[str, 'AttributeGroupReference', 'EntityAttribute', 'TypeAttribute']) -> Optional['CdmAttributeItem']:
    """Converts a JSON object to an Attribute object"""
    if obj is None:
        return None
    if isinstance(obj, str) or 'attributeGroupReference' in obj:
        return AttributeGroupReferencePersistence.from_data(ctx, obj)
    if 'entity' in obj:
        return EntityAttributePersistence.from_data(ctx, obj)
    if 'name' in obj:
        return TypeAttributePersistence.from_data(ctx, obj)
    return None


def create_attribute_array(ctx: CdmCorpusContext, obj: Optional[List[Union[str, AttributeGroupReference, EntityAttribute, TypeAttribute]]]) \
        -> Optional[List[CdmAttributeItem]]:
    """Converts a JSON object to a CdmCollection of attributes"""

    if obj is None:
        return None

    result = []
    for elem in obj:
        result.append(create_attribute(ctx, elem))

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
