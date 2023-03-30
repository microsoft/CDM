# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmObjectReference
from cdm.persistence import PersistenceLayer
from cdm.utilities import ResolveOptions, CopyOptions, copy_data_utils
from cdm.utilities.string_utils import StringUtils

from . import utils
from .types import AttributeGroupReference, CdmJsonType, \
    DataTypeReference, EntityReference, PurposeReference, TraitReference, TraitGroupReference


class CdmObjectRefPersistence:
    @staticmethod
    def to_data(instance: CdmObjectReference, res_opt: ResolveOptions, options: CopyOptions) -> CdmJsonType:
        # We don't know what object we are creating to initialize to any
        copy = None
        replace = None

        if not StringUtils.is_blank_by_cdm_standard(instance.named_reference):
            identifier = utils.copy_identifier_ref(instance, res_opt, options)
            if instance.simple_named_reference:
                return identifier

            replace = CdmObjectRefPersistence._copy_ref_data(instance, res_opt, copy, identifier, options)

            if replace:
                copy = replace

        elif instance.explicit_reference:
            er_copy = PersistenceLayer.to_data(instance.explicit_reference, res_opt, options, PersistenceLayer.CDM_FOLDER)
            replace = CdmObjectRefPersistence._copy_ref_data(instance, res_opt, copy, er_copy, options)

            if replace:
                copy = replace

        if instance.optional is not None:
            copy.optional = instance.optional

        if instance.applied_traits:
            # We don't know if the object we are copying has applied traits or not and hence use any
            copy.appliedTraits = copy_data_utils._array_copy_data(res_opt, instance.applied_traits, options)

        return copy

    # TODO: Another (well-rested) set of eyes should check this function -MPL
    @staticmethod
    def _copy_ref_data(instance: CdmObjectReference, res_opt: ResolveOptions,
                       copy: CdmJsonType, ref_to: CdmJsonType, options: CopyOptions) -> Optional[CdmJsonType]:
        from cdm.persistence.cdmfolder.trait_reference_persistence import TraitReferencePersistence

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
            copy.arguments = copy_data_utils._array_copy_data(res_opt, instance.arguments, options)
            copy.verb = TraitReferencePersistence.to_data(instance.verb, res_opt, options) if instance.verb else None
            return copy
        elif instance.object_type == CdmObjectType.TRAIT_GROUP_REF:
            copy = TraitGroupReference()
            copy.traitGroupReference = ref_to
            return copy
        else:
            return None
