# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Callable, List, Optional, Union, TYPE_CHECKING

from cdm.enums import CdmAttributeContextType, CdmObjectType
from cdm.utilities import ResolveOptions, logger, Errors

from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmEntityReference
    from cdm.utilities import VisitCallback


class WhereParams:
    def __init__(self, result, new_value):
        self.result = result
        self.new_value = new_value


class CdmConstantEntityDefinition(CdmObjectDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # the constant entity name.
        self.constant_entity_name = name  # type: str

        # the constant entity shape.
        self.entity_shape = None  # type: Optional[CdmEntityReference]

        # the constant entity constant values.
        self.constant_values = []  # type: List[List[str]]

        self._TAG = CdmConstantEntityDefinition.__name__

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.CONSTANT_ENTITY_DEF

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        from cdm.resolvedmodel import ResolvedAttributeSetBuilder
        from cdm.utilities import AttributeContextParameters

        rasb = ResolvedAttributeSetBuilder()
        acp_ent = None
        if under:
            acp_ent = AttributeContextParameters(
                under=under,
                type=CdmAttributeContextType.ENTITY,
                name=self.entity_shape.fetch_object_definition_name(),
                regarding=self.entity_shape,
                include_traits=True)

        if self.entity_shape:
            rasb.merge_attributes(self.entity_shape._fetch_resolved_attributes(res_opt, acp_ent))

        # things that need to go away
        rasb.remove_requested_atts()

        return rasb

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        pass

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmConstantEntityDefinition'] = None) -> 'CdmConstantEntityDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmConstantEntityDefinition(self.ctx, self.constant_entity_name)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.constant_entity_name = self.constant_entity_name

        copy.entity_shape = self.entity_shape.copy(res_opt)
        copy.constant_values = self.constant_values  # is a deep copy needed?
        self._copy_def(res_opt, copy)

        return copy

    def get_name(self) -> str:
        # make up a name if one not given
        if not self.constant_entity_name:
            if self.entity_shape:
                return 'Constant' + self.entity_shape.fetch_object_definition_name()
            return 'ConstantEntity'
        return self.constant_entity_name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def _find_value(self, res_opt: 'ResolveOptions', att_return: Union[str, int], att_search: Union[str, int],
                    value_search: str, order: int, action: Callable[[str, WhereParams], str], where_params: WhereParams):
        """the world's smallest complete query processor..."""
        result_att = -1
        search_att = -1

        if isinstance(att_return, int):
            result_att = att_return

        if isinstance(att_search, int):
            search_att = att_search

        if result_att == -1 or search_att == -1:
            # metadata library
            ras = self._fetch_resolved_attributes(res_opt)  # type: ResolvedAttributeSet

            # query validation and binding
            if ras is not None:
                l = ras._set.size

                for i in range(0, l):
                    name = ras._set[i].resolved_name  # type: str
                    if result_att == -1 and name == att_return:
                        result_att = i
                    if search_att == -1 and name == att_search:
                        search_att = i
                    if result_att >= 0 and search_att >= 0:
                        break

        # rowset processing
        if result_att >= 0 and search_att >= 0:
            increment = 1
            if order == -1:
                # traverse the list in reverse order
                increment = -1
            if self.constant_values:
                for value in self.constant_values[::increment]:
                    if value[search_att] == value_search:
                        value[result_att] = action(value[result_att], where_params)
                        return
        return

    def _fetch_constant_value(self, res_opt: 'ResolveOptions', att_return: Union[str, int],
                              att_search: Union[str, int], value_search: str, order: int) -> str:
        """returns constantValue.att_return where constantValue.att_search equals value_search."""
        where_params = WhereParams(None, None)
        self._find_value(res_opt, att_return, att_search, value_search, order, self._fetch_constant_value_result, where_params)
        return where_params.result

    def _update_constant_value(self, res_opt: 'ResolveOptions', att_return: Union[str, int], new_value: str,
                               att_search: Union[str, int], value_search: str, order: int) -> str:
        """sets constantValue.att_return = newValue where constantValue.att_search equals value_search."""
        where_params = WhereParams(None, new_value)
        self._find_value(res_opt, att_return, att_search, value_search, order, self._update_constant_value_result, where_params)
        return where_params.result

    def _fetch_constant_value_result(self, found: str, where_params: WhereParams) -> str:
        where_params.result = found
        return found

    def _update_constant_value_result(self, found: str, where_params: WhereParams) -> str:
        where_params.result = found
        return where_params.new_value

    def validate(self) -> bool:
        if self.constant_values is None:
            path_split = self._declared_path.split('/')
            entity_name = path_split[0] if path_split else ''
            logger.warning(self._TAG, self.ctx, 'constant entity \'{}\' defined without a constant value.'.format(entity_name))
        if not bool(self.entity_shape):
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, ['entity_shape']))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from + (self.constant_entity_name if self.constant_entity_name else '(unspecified)')
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.entity_shape and self.entity_shape.visit('{}/entityShape/'.format(path), pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
