# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, Union, List, TYPE_CHECKING
from cdm.objectmodel import CdmEntityDeclarationDefinition

from cdm.enums import CdmObjectType
from cdm.utilities import logger

from .cdm_collection import CdmCollection
if TYPE_CHECKING:
    from .cdm_entity_declaration_def import CdmEntityDeclarationDefinition
    from .cdm_entity_def import CdmEntityDefinition


class CdmEntityCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF)

    def append(self, obj: Union[str, 'CdmEntityDefinition', 'CdmEntityDeclarationDefinition'],
               entity_path: Optional[str] = None, simple_ref: bool = False) -> 'CdmEntityDeclarationDefinition':
        if isinstance(obj, str):
            obj = super().append(obj, simple_ref)
            obj.entity_path = entity_path
            return obj

        if isinstance(obj, CdmEntityDeclarationDefinition):
            return super().append(obj, simple_ref)

        if not obj.owner:
            logger.error(CdmEntityCollection.__name__, self.ctx,
                         'Expected entity to have an \'Owner\' document set. Cannot create entity declaration to add to manifest.', self.append.__name__)
            return None

        entity_declaration = self.ctx.corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF,
                                                         obj.entity_name, simple_ref)  # type: CdmEntityDeclarationDefinition
        entity_declaration.owner = self.owner
        entity_declaration.entity_path = self.ctx.corpus.storage.create_relative_corpus_path(
            '{}/{}'.format(obj.owner.at_corpus_path, obj.entity_name), self.owner.in_document)
        entity_declaration.explanation = obj.explanation
        return super().append(entity_declaration)

    def extend(self, entity_list: Union[List['CdmEntityDefinition'], List['CdmEntityDeclarationDefinition']]) -> None:
        for entity in entity_list:
            self.append(entity)

    def remove(self, obj: 'CdmEntityDefinition') -> None:
        for entity in self:
            if obj.entity_name == entity.entity_name:
                return super().remove(entity)
