﻿# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union, Optional, cast
from cdm.enums import CdmObjectType
from cdm.objectmodel import CdmCorpusContext, CdmEntityReference, CdmProjection

from . import utils
from .cdm_object_ref_persistence import CdmObjectRefPersistence
from .constant_entity_persistence import ConstantEntityPersistence
from .projections.projection_persistence import ProjectionPersistence
from .types import EntityReference


class EntityReferencePersistence(CdmObjectRefPersistence):
    @staticmethod
    def from_data(ctx: CdmCorpusContext, data: Union[str, EntityReference]) -> Optional[CdmEntityReference]:
        if not data:
            return None

        simple_reference = True
        entity = None

        if isinstance(data, str):
            entity = data
        else:
            entity = EntityReferencePersistence._get_entity_reference(ctx, data)
            simple_reference = False

        entity_reference = ctx.corpus.make_ref(CdmObjectType.ENTITY_REF, entity, simple_reference)

        if not isinstance(data, str) and entity_reference:
            utils.add_list_to_cdm_collection(entity_reference.applied_traits,
                                             utils.create_trait_reference_array(ctx, data.get('appliedTraits')))

        return entity_reference

    @staticmethod
    def to_data(instance: 'CdmEntityReference', res_opt: 'ResolveOptions', options: 'CopyOptions') -> 'EntityReference':
        if not instance:
            return None

        if instance.explicit_reference and isinstance(instance.explicit_reference, CdmProjection):
            return ProjectionPersistence.to_data(cast('CdmProjection', instance.explicit_reference), res_opt, options)
        else:
            return CdmObjectRefPersistence.to_data(instance, res_opt, options)

    @staticmethod
    def _get_entity_reference(ctx: 'CdmCorpusContext', data) -> 'CdmObject':
        from .entity_persistence import EntityPersistence

        entity = None
        if isinstance(data.entityReference, str):
            entity = data.entityReference
        elif data.entityReference and data.entityReference.get('entityShape'):
            entity = ConstantEntityPersistence.from_data(ctx, data.entityReference)
        elif data.get('source') or data.get('operations'):
            entity = ProjectionPersistence.from_data(ctx, data)
        else:
            entity = EntityPersistence.from_data(ctx, data.entityReference)
        return entity
