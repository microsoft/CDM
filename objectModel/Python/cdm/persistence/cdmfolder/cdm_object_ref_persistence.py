from typing import Optional

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmObjectReference
from cdm.persistence import persistence_layer
from cdm.utilities import ResolveOptions, CopyOptions

from . import utils
from .types import AttributeGroupReference, CdmJsonType, \
    DataTypeReference, EntityReference, PurposeReference, TraitReference


class CdmObjectRefPersistence:
    @staticmethod
    def to_data(instance: CdmObjectReference, res_opt: ResolveOptions, options: CopyOptions) -> CdmJsonType:
        # We don't know what object we are creating to initialize to any
        copy = None
        replace = None

        if instance.named_reference:
            identifier = utils.copy_identifier_ref(instance, res_opt, options)
            if instance.simple_named_reference:
                return identifier

            replace = CdmObjectRefPersistence._copy_ref_data(instance, res_opt, copy, identifier, options)

            if replace:
                copy = replace

        elif instance.explicit_reference:
            er_copy = persistence_layer.to_data(instance.explicit_reference, res_opt, 'CdmFolder', options)
            replace = CdmObjectRefPersistence._copy_ref_data(instance, res_opt, copy, er_copy, options)

            if replace:
                copy = replace

        if instance.applied_traits:
            # We don't know if the object we are copying has applied traits or not and hence use any
            copy.appliedTraits = utils.array_copy_data(res_opt, instance.applied_traits, options)

        return copy

    # TODO: Another (well-rested) set of eyes should check this function -MPL
    @staticmethod
    def _copy_ref_data(instance: CdmObjectReference, res_opt: ResolveOptions,
                       copy: CdmJsonType, ref_to: CdmJsonType, options: CopyOptions) -> Optional[CdmJsonType]:

        if instance.object_type == CdmObjectType.ATTRIBUTE_GROUP_REF:
            copy = AttributeGroupReference()
            copy.attributeGroupReference = ref_to
            return copy
        elif instance.object_type == CdmObjectType.DATA_TYPE_REF:
            copy = DataTypeReference()
            copy.dataTypeReference = ref_to
            return copy
        elif instance.object_type == CdmObjectType.ENTITY_REF:
            copy = EntityReference()
            copy.entityReference = ref_to
            return copy
        elif instance.object_type == CdmObjectType.PURPOSE_REF:
            copy = PurposeReference()
            copy.purposeReference = ref_to
            return copy
        elif instance.object_type == CdmObjectType.TRAIT_REF:
            copy = TraitReference()
            copy.traitReference = ref_to
            copy.arguments = utils.array_copy_data(res_opt, instance.arguments, options)
            return copy
        else:
            return None
