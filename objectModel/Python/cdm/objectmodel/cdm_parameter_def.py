# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Any, Optional, TYPE_CHECKING

from cdm.enums import CdmObjectType
from cdm.utilities import ResolveOptions, logger
from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

from .cdm_attribute_ref import CdmAttributeReference
from .cdm_object import CdmObject
from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmCorpusContext, CdmDataTypeReference
    from cdm.utilities import FriendlyFormatNode, lang_utils, VisitCallback


class CdmParameterDefinition(CdmObjectDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        self._TAG = CdmParameterDefinition.__name__

        # the parameter name.
        self.name = name

        # the parameter explanation.
        self.explanation = None  # type: Optional[str]

        # the parameter default value.
        self.default_value = None  # type: Optional[CdmArgumentValue]

        # if the parameter is required.
        self.required = False  # type: Optional[bool]

        # the parameter data type reference.
        self.data_type_ref = None  # type: Optional[CdmDataTypeReference]

        # Internal

        self._declared_path = None  # type: Optional[str]

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.PARAMETER_DEF

    def is_derived_from(self, base, res_opt=None):
        return False

    def get_name(self) -> str:
        return self.name

    def _const_type_check(self, res_opt: 'ResolveOptions', wrt_doc: 'CdmDocumentDefinition', argument_value: Any) -> 'CdmArgumentValue':
        ctx = self.ctx
        replacement = argument_value
        # if parameter type is entity, then the value should be an entity or ref to one
        # same is true of 'dataType' dataType
        ref = self.data_type_ref
        if not ref:
            return replacement

        dt = ref.fetch_object_definition(res_opt)
        if not dt:
            logger.error(self.ctx, self._TAG, '_const_type_check', self.at_corpus_path, CdmLogCode.ERR_UNRECOGNIZED_DATA_TYPE, self.name)
            return None

        # compare with passed in value or default for parameter
        p_value = argument_value
        if p_value is None:
            p_value = self.default_value
            replacement = p_value

        if p_value is not None:
            if dt.is_derived_from('cdmObject', res_opt):
                expected_types = []
                expected = None
                if dt.is_derived_from('entity', res_opt):
                    expected_types.append(CdmObjectType.CONSTANT_ENTITY_DEF)
                    expected_types.append(CdmObjectType.ENTITY_REF)
                    expected_types.append(CdmObjectType.ENTITY_DEF)
                    expected_types.append(CdmObjectType.PROJECTION_DEF)
                    expected = 'entity'
                elif dt.is_derived_from('attribute', res_opt):
                    expected_types.append(CdmObjectType.ATTRIBUTE_REF)
                    expected_types.append(CdmObjectType.TYPE_ATTRIBUTE_DEF)
                    expected_types.append(CdmObjectType.ENTITY_ATTRIBUTE_DEF)
                    expected = 'attribute'
                elif dt.is_derived_from('dataType', res_opt):
                    expected_types.append(CdmObjectType.DATA_TYPE_REF)
                    expected_types.append(CdmObjectType.DATA_TYPE_DEF)
                    expected = 'dataType'
                elif dt.is_derived_from('purpose', res_opt):
                    expected_types.append(CdmObjectType.PURPOSE_REF)
                    expected_types.append(CdmObjectType.PURPOSE_DEF)
                    expected = 'purpose'
                elif dt.is_derived_from('trait', res_opt):
                    expected_types.append(CdmObjectType.TRAIT_REF)
                    expected_types.append(CdmObjectType.TRAIT_DEF)
                    expected = 'trait'
                elif dt.is_derived_from('traitGroup', res_opt):
                    expected_types.append(CdmObjectType.TRAIT_GROUP_REF)
                    expected_types.append(CdmObjectType.TRAIT_GROUP_DEF)
                    expected = 'traitGroup'
                elif dt.is_derived_from('attributeGroup', res_opt):
                    expected_types.append(CdmObjectType.ATTRIBUTE_GROUP_REF)
                    expected_types.append(CdmObjectType.ATTRIBUTE_GROUP_DEF)
                    expected = 'attributeGroup'

                if not expected_types:
                    logger.error(self.ctx, self._TAG, '_const_type_check', wrt_doc.at_corpus_path, CdmLogCode.ERR_UNEXPECTED_DATA_TYPE,
                                 self.name)

                # if a string constant, resolve to an object ref.
                found_type = CdmObjectType.ERROR
                if isinstance(p_value, CdmObject):
                    found_type = p_value.object_type

                found_desc = ctx._relative_path
                if isinstance(p_value, str):
                    if p_value == 'this.attribute' and expected == 'attribute':
                        # will get sorted out later when resolving traits
                        found_type = CdmObjectType.ATTRIBUTE_REF
                    else:
                        found_desc = p_value
                        from cdm.objectmodel import CdmObjectReference
                        seek_res_att = CdmObjectReference._offset_attribute_promise(p_value)
                        if seek_res_att >= 0:
                            # get an object there that will get resolved later after resolved attributes
                            replacement = CdmAttributeReference(self.ctx, p_value, True)
                            replacement.in_document = wrt_doc
                            found_type = CdmObjectType.ATTRIBUTE_REF
                        else:
                            lu = ctx.corpus._resolve_symbol_reference(res_opt, wrt_doc, p_value,
                                                                      CdmObjectType.ERROR, True)
                            if lu:
                                if expected == 'attribute':
                                    replacement = CdmAttributeReference(self.ctx, p_value, True)
                                    replacement.in_document = wrt_doc
                                    found_type = CdmObjectType.ATTRIBUTE_REF
                                else:
                                    replacement = lu
                                    if isinstance(replacement, CdmObject):
                                        found_type = replacement.object_type

                if expected_types.index(found_type) == -1:
                    logger.error(self.ctx, self._TAG, wrt_doc.at_corpus_path,
                                 CdmLogCode.ERR_RESOLUTION_FAILURE,
                                 self.get_name(), expected, found_desc)
                else:
                    logger.info(self.ctx, self._TAG, self._const_type_check.__name__,
                                wrt_doc.at_corpus_path, 'resolved \'{}\''.format(found_desc))

        return replacement

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmParameterDefinition'] = None) -> 'CdmParameterDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmParameterDefinition(self.ctx, self.name)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.name = self.name

        def_val = None
        if self.default_value:
            if isinstance(self.default_value, CdmObject):
                def_val = self.default_value.copy(res_opt)
            elif isinstance(self.default_value, dict):
                def_val = dict(self.default_value)
            else:
                def_val = self.default_value

        copy.explanation = self.explanation
        copy.default_value = def_val
        copy.required = self.required
        copy.data_type_ref = self.data_type_ref.copy(res_opt) if self.data_type_ref else None

        return copy

    def validate(self) -> bool:
        if not bool(self.name):
            missing_fields = ['named']
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if isinstance(self.default_value, CdmObject) and self.default_value.visit('{}/defaultValue/'.format(path), pre_children, post_children):
            return True

        if self.data_type_ref and self.data_type_ref.visit('{}/dataType/'.format(path), pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
