# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import TYPE_CHECKING

from cdm.enums import CdmObjectType, CdmLogCode
from cdm.objectmodel.cdm_collection import CdmCollection
from cdm.persistence.cdmfolder.types import OperationAlterTraits
from cdm.utilities.logging import logger

from .operation_base_persistence import OperationBasePersistence
from .. import utils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmOperationAlterTraits
    from cdm.utilities import ResolveOptions, CopyOptions

_TAG = 'OperationAlterTraitsPersistence'


class OperationAlterTraitsPersistence:
    """Operation AlterTraits persistence"""

    @staticmethod
    def from_data(ctx: 'CdmCorpusContext', data: 'OperationAlterTraits') -> 'CdmOperationAlterTraits':
        if not data:
            return None

        alter_traits_op = OperationBasePersistence.from_data(ctx,
            CdmObjectType.OPERATION_ALTER_TRAITS_DEF, data)  # type: CdmOperationAlterTraits

        if 'traitsToAdd' in data:
            alter_traits_op.traits_to_add = CdmCollection(ctx, alter_traits_op, CdmObjectType.TRAIT_REF)
            utils.add_list_to_cdm_collection(alter_traits_op.traits_to_add, utils.create_trait_reference_array(ctx, data.traitsToAdd))
        if 'traitsToRemove' in data:
            alter_traits_op.traits_to_remove = CdmCollection(ctx, alter_traits_op, CdmObjectType.TRAIT_REF)
            utils.add_list_to_cdm_collection(alter_traits_op.traits_to_remove, utils.create_trait_reference_array(ctx, data.traitsToRemove))
        alter_traits_op.arguments_contain_wildcards = data.argumentsContainWildcards

        if isinstance(data.applyTo, str):
            alter_traits_op.apply_to = [data.applyTo]
        elif isinstance(data.applyTo, list):
            alter_traits_op.apply_to = data.applyTo
        elif data.applyTo is not None:
            logger.error(ctx, _TAG, OperationAlterTraitsPersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_PROJ_UNSUPPORTED_PROP, 'applyTo', 'string or list of strings')

        if isinstance(data.applyToTraits, str):
            alter_traits_op.apply_to_traits = [data.applyToTraits]
        elif isinstance(data.applyToTraits, list):
            alter_traits_op.apply_to_traits = data.applyToTraits
        elif data.applyToTraits is not None:
            logger.error(ctx, _TAG, OperationAlterTraitsPersistence.from_data.__name__, None, CdmLogCode.ERR_PERSIST_PROJ_UNSUPPORTED_PROP, 'applyToTraits', 'string or list of strings')

        return alter_traits_op

    @staticmethod
    def to_data(instance: 'CdmOperationAlterTraits', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'OperationAlterTraits':
        if not instance:
            return None

        obj = OperationBasePersistence.to_data(instance, res_opt, options)  # type: OperationAlterTraits
        obj.traitsToAdd = instance.traits_to_add
        obj.traitsToRemove = instance.traits_to_remove
        obj.argumentsContainWildcards = instance.arguments_contain_wildcards
        obj.applyTo = instance.apply_to
        obj.applyToTraits = instance.apply_to_traits

        return obj
