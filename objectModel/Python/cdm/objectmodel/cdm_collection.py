from typing import Generic, List, TypeVar, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_object import CdmObject

if TYPE_CHECKING:
    from cdm.utilities import VisitCallback

    from .cdm_corpus_context import CdmCorpusContext

T = TypeVar('T', bound=CdmObject, covariant=True)


class CdmCollection(list, Generic[T]):
    def __init__(self, ctx: 'CdmCorpusContext', owner: 'CdmObject', default_type: 'CdmObjectType') -> None:
        super().__init__(self)
        self.ctx = ctx
        self.owner = owner  # type: T
        self.default_type = default_type  # type: CdmObjectType

    def append(self, obj: Union[str, 'T'], simple_ref: bool = False) -> 'CdmObject':
        if isinstance(obj, (list, CdmCollection)):
            raise Exception('add called with a list. You should call extend instead')

        if not isinstance(obj, str):
            obj.owner = self.owner
            super().append(obj)
        else:
            obj = self.ctx.corpus.make_object(self.default_type, obj, simple_ref)
            super().append(obj)

        return obj

    def extend(self, obj: List[Union['T', str]]) -> None:
        self.__add__(obj)

    def remove(self, curr_object: 'T') -> bool:
        try:
            super().remove(curr_object)
            return True
        except ValueError:
            return False

    def item(self, name: str) -> 'T':
        for x in self:
            if x.fetch_object_definition_name() == name:
                return x
        return None

    def _visit_array(self, path: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        result = False

        for item in self:
            if item and item.visit(path, pre_children, post_children):
                result = True
                break

        return result

    def __add__(self, obj: List[Union['T', str]]):
        if not obj:
            return

        if isinstance(obj, (list, CdmCollection)):
            for element in obj:
                self.append(element)
        else:
            self.ctx.logger.error('unsupported type to extend', 'extend')
