from typing import Optional, Union

from cdm.enums import CdmObjectType

from .cdm_collection import CdmCollection, T
from .cdm_entity_def import CdmEntityDefinition
from .cdm_local_entity_declaration_def import CdmLocalEntityDeclarationDefinition


class CdmEntityCollection(CdmCollection):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject'):
        super().__init__(ctx, owner, CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF)

    def append(self, obj: Union[str, T], entity_path: Optional[str] = None) -> None:
        if not isinstance(obj, str):
            if obj.object_type == CdmObjectType.ENTITY_DEF:
                entity = obj  # type: CdmEntityDefinition
                if not entity.owner:
                    raise Exception('Expected entity to have an "Owner" document set. Cannot create entity declaration to add to manifest.')

                obj = self.ctx.corpus.make_object(CdmObjectType.LOCAL_ENTITY_DECLARATION_DEF, entity.get_name())  # type: CdmLocalEntityDeclarationDefinition
                obj.explanation = entity.explanation
                obj.entity_path = self.ctx.corpus.storage.create_relative_corpus_path(
                    '{}/{}'.format(entity.owner.at_corpus_path, entity.get_name()), self.owner.in_document)
        else:
            obj = self.ctx.corpus.make_object(self.default_type, obj)
            obj.entity_path = entity_path

        return super().append(obj)

    def remove(self, obj: 'CdmObject'):
        if obj.object_type == CdmObjectType.ENTITY_DEF:
            for entity in self:
                if entity.entity_name == obj.entity_name:
                    super().remove(entity)
        else:
            super().remove(obj)
