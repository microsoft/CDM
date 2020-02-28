# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection

if TYPE_CHECKING:
    from .cdm_object_def import CdmObjectDefinition

internal_declaration_types = set([CdmObjectType.ENTITY_DEF, CdmObjectType.PARAMETER_DEF, CdmObjectType.TRAIT_DEF, CdmObjectType.PURPOSE_DEF,
                                  CdmObjectType.DATA_TYPE_DEF, CdmObjectType.TYPE_ATTRIBUTE_DEF, CdmObjectType.ENTITY_ATTRIBUTE_DEF,
                                  CdmObjectType.ATTRIBUTE_GROUP_DEF, CdmObjectType.CONSTANT_ENTITY_DEF, CdmObjectType.ATTRIBUTE_CONTEXT_DEF,
                                  CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, CdmObjectType.REFERENCED_ENTITY_DECLARATION_DEF])


class CdmDefinitionCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.ENTITY_DEF)

    def append(self, obj: Union[str, 'CdmObjectDefinition'], of_type: Optional['CdmObjectType'] = None, simple_ref: Optional[bool] = False) -> 'CdmObjectDefinition':
        """
        If a object definition is provided adds it to the list otherwise
        creates a object with type 'of_type' if provided or an EntityDefinition if not.
        """
        if obj is not None and not isinstance(obj, str):
            return super().append(obj)
        if of_type is not None and of_type in internal_declaration_types:
            obj = self.ctx.corpus.make_object(of_type, obj, simple_ref)
            return super().append(obj)

        return super().append(obj, simple_ref)
