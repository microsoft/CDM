# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Optional, TYPE_CHECKING, cast

from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils
from cdm.enums import CdmAttributeContextType, CdmObjectType
from cdm.utilities import ResolveOptions, logger
from cdm.resolvedmodel import ResolvedAttributeSet

from .cdm_collection import CdmCollection
from .cdm_object_def import CdmObjectDefinition
from .cdm_references_entities import CdmReferencesEntities
from .cdm_attribute_item import CdmAttributeItem

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmAttributeItem, CdmCollection, CdmCorpusContext, CdmObjectReference


class CdmAttributeGroupDefinition(CdmObjectDefinition, CdmReferencesEntities):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)
        self._TAG = CdmAttributeGroupDefinition.__name__

        # the attribute group name.
        self.attribute_group_name = name  # type: str

        # the attribute group context.
        self.attribute_context = None  # type: Optional[CdmAttributeContextReference]

        # Internal

        self._members = CdmCollection(self.ctx, self, CdmObjectType.TYPE_ATTRIBUTE_DEF)  # type: CdmCollection[CdmAttributeItem]


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
        all_under = under  # type: CdmAttributeContext

        if under:
            acp_att_grp = AttributeContextParameters(
                under=under,
                type=CdmAttributeContextType.ATTRIBUTE_GROUP,
                name=self.get_name(),
                regarding=self,
                include_traits=False)
            under = rasb._resolved_attribute_set.create_attribute_context(res_opt, acp_att_grp)

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
                ras_from_att = att._fetch_resolved_attributes(res_opt, acp_att)  # type: ResolvedAttributeSet
                # before we just merge, need to handle the case of 'attribute restatement' AKA an entity with an attribute having the same name as an attribute
                # from a base entity. thing might come out with different names, if they do, then any attributes owned by a similar named attribute before
                # that didn't just pop out of that same named attribute now need to go away.
                # mark any attributes formerly from this named attribute that don't show again as orphans
                rasb._resolved_attribute_set.mark_orphans_for_removal(cast(CdmAttributeItem, att).fetch_object_definition_name, ras_from_att)
                rasb.merge_attributes(ras_from_att)

        rasb._resolved_attribute_set.attribute_context = all_under  # context must be the one expected from the caller's pov.

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
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmAttributeGroupDefinition(self.ctx, self.attribute_group_name)
        else:
            copy = host
            copy.attribute_group_name = self.attribute_group_name
            copy.members.clear()

        copy.attribute_context = self.attribute_context.copy(res_opt) if self.attribute_context else None

        for att in self.members:
            copy.members.append(att.copy(res_opt))

        self._copy_def(res_opt, copy)
        return copy

    def get_name(self) -> str:
        return self.attribute_group_name

    def fetch_resolved_entity_references(self, res_opt: Optional['ResolveOptions'] = None) -> 'ResolvedEntityReferenceSet':
        """Deprecated: for internal use only"""

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
            missing_fields = ['attribute_group_name']
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = self._fetch_declared_path(path_from)

        if pre_children and pre_children(self, path):
            return False

        if self.attribute_context:
            self.attribute_context.owner = self
            if self.attribute_context.visit('{}/attributeContext/'.format(path), pre_children, post_children):
                return True

        if self.members and self.members._visit_array('{}/members/'.format(path), pre_children, post_children):
            return True

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
