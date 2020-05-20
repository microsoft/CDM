# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING

from cdm.enums import CdmAttributeContextType, CdmObjectType
from cdm.utilities import ResolveOptions, logger, Errors

from .cdm_collection import CdmCollection
from .cdm_object_def import CdmObjectDefinition
from .cdm_references_entities import CdmReferencesEntities

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmAttributeItem, CdmCollection, CdmCorpusContext, CdmObjectReference


class CdmAttributeGroupDefinition(CdmObjectDefinition, CdmReferencesEntities):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # the attribute group name.
        self.attribute_group_name = name  # type: str

        # the attribute group context.
        self.attribute_context = None  # type: Optional[CdmAttributeContextReference]

        # Internal

        self._members = CdmCollection(self.ctx, self, CdmObjectType.TYPE_ATTRIBUTE_DEF)  # type: CdmCollection[CdmAttributeItem]

        self._TAG = CdmAttributeGroupDefinition.__name__

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.ATTRIBUTE_GROUP_DEF

    @property
    def members(self) -> 'CdmCollection[CdmAttributeItem]':
        """the attribute members."""
        return self._members

    def _add_attribute_def(self, attribute_def: 'CdmAttributeItem') -> 'CdmAttributeItem':
        self.members.append(attribute_def)
        return attribute_def

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        from cdm.resolvedmodel import ResolvedAttributeSetBuilder
        from cdm.utilities import AttributeContextParameters

        rasb = ResolvedAttributeSetBuilder()

        if under:
            acp_att_grp = AttributeContextParameters(
                under=under,
                type=CdmAttributeContextType.ATTRIBUTE_GROUP,
                name=self.get_name(),
                regarding=self,
                include_traits=False)
            under = rasb.ras.create_attribute_context(res_opt, acp_att_grp)

        if self.members:
            for att in self.members:
                acp_att = None
                if under:
                    acp_att = AttributeContextParameters(
                        under=under,
                        type=CdmAttributeContextType.ATTRIBUTE_DEFINITION,
                        name=att.fetch_object_definition_name(),
                        regarding=att,
                        include_traits=False)
                rasb.merge_attributes(att._fetch_resolved_attributes(res_opt, acp_att))
        rasb.ras.attribute_context = under

        # things that need to go away
        rasb.remove_requested_atts()

        return rasb

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        from cdm.resolvedmodel import ResolvedTraitSet

        # get only the elevated traits from attributes first, then add in all traits from this definition
        if self.members:
            rts_elevated = ResolvedTraitSet(res_opt)
            for att in self.members:
                rts_att = att._fetch_resolved_traits(res_opt)
                if rts_att and rts_att.has_elevated:
                    rts_elevated = rts_elevated.merge_set(rts_att, True)
            rtsb.merge_traits(rts_elevated)

        self._construct_resolved_traits_def(None, rtsb, res_opt)

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmAttributeGroupDefinition'] = None) -> 'CdmAttributeGroupDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self)

        if not host:
            copy = CdmAttributeGroupDefinition(self.ctx, self.attribute_group_name)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.attribute_group_name = self.attribute_group_name
            copy.members.clear()

        copy.attribute_context = self.attribute_context.copy(res_opt) if self.attribute_context else None

        for att in self.members:
            copy.members.append(att.copy())

        self._copy_def(res_opt, copy)
        return copy

    def get_name(self) -> str:
        return self.attribute_group_name

    def fetch_resolved_entity_references(self, res_opt: Optional['ResolveOptions'] = None) -> 'ResolvedEntityReferenceSet':
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        from cdm.resolvedmodel import ResolvedEntityReferenceSet

        rers = ResolvedEntityReferenceSet(res_opt)
        for member in self.members:
            rers.add(member.fetch_resolved_entity_references(res_opt))

        return rers

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        return False

    def validate(self) -> bool:
        if not bool(self.attribute_group_name):
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, ['attribute_group_name']))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from + self.attribute_group_name
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.attribute_context and self.attribute_context.visit('{}/attributeContext/'.format(path), pre_children, post_children):
            return True

        if self.members and self.members._visit_array('{}/members/'.format(path), pre_children, post_children):
            return True

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
