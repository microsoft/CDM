# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

import functools
from typing import Any, cast, Dict, Iterable, List, Optional, Set, Union, TYPE_CHECKING

from cdm.enums import CdmAttributeContextType, CdmObjectType
from cdm.persistence import PersistenceLayer
from cdm.resolvedmodel import AttributeResolutionContext, ResolvedAttributeSet
from cdm.utilities import AttributeContextParameters, logger, ResolveOptions, Errors

from .cdm_attribute_context import CdmAttributeContext
from .cdm_collection import CdmCollection
from .cdm_object import CdmObject
from .cdm_object_def import CdmObjectDefinition
from .cdm_references_entities import CdmReferencesEntities
from ..resolvedmodel.projections.projection_directive import ProjectionDirective
from ..utilities.string_utils import StringUtils

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmAttributeGroupDefinition, CdmAttributeGroupReference, \
        CdmAttributeItem, CdmAttributeReference, CdmAttributeResolutionGuidanceDefinition, CdmCollection, \
        CdmCorpusContext, CdmDocumentDefinition, \
        CdmEntityAttributeDefinition, CdmEntityReference, CdmFolderDefinition, CdmTraitReference, \
        CdmTypeAttributeDefinition
    from cdm.resolvedmodel import ResolvedAttribute, ResolvedAttributeSetBuilder, ResolvedEntityReferenceSet, \
        ResolvedTraitSetBuilder, TraitSpec
    from cdm.utilities import FriendlyFormatNode, TraitToPropertyMap, VisitCallback


class CdmEntityDefinition(CdmObjectDefinition, CdmReferencesEntities):
    def __init__(self, ctx: 'CdmCorpusContext', name: str, extends_entity: Optional['CdmEntityReference']) -> None:
        super().__init__(ctx)

        # the entity attribute Context.
        self.attribute_context = None  # type: Optional[CdmAttributeContext]

        # the entity entity name.
        self.entity_name = name  # type: str

        # the entity extended by this entity.
        self.extends_entity = extends_entity  # type: Optional[CdmEntityReference]

        # the resolution guidance for attributes taken from the entity extended by this entity
        self.extends_entity_resolution_guidance = None  # type: Optional[CdmAttributeResolutionGuidanceDefinition]

        # --- internal ---
        self._rasb = None  # type: Optional[ResolvedAttributeSetBuilder]
        self._resolving_entity_references = False  # type: bool
        self._attributes = CdmCollection(self.ctx, self, CdmObjectType.TYPE_ATTRIBUTE_DEF)  # type: CdmCollection
        self._ttpm = None  # type: Optional[TraitToPropertyMap]

        self._TAG = CdmEntityDefinition.__name__

    @property
    def attributes(self) -> 'CdmCollection[CdmAttributeItem]':
        """the entity attributes."""
        return self._attributes

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.ENTITY_DEF

    @property
    def source_name(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('sourceName'))

    @source_name.setter
    def source_name(self, val: str) -> None:
        self._trait_to_property_map._update_property_value('sourceName', val)

    @property
    def description(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('description'))

    @description.setter
    def description(self, val: str) -> None:
        self._trait_to_property_map._update_property_value('description', val)

    @property
    def display_name(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('displayName'))

    @display_name.setter
    def display_name(self, val: str) -> None:
        self._trait_to_property_map._update_property_value('displayName', val)

    @property
    def version(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('version'))

    @version.setter
    def version(self, val: str) -> None:
        self._trait_to_property_map._update_property_value('version', val)

    @property
    def cdm_schemas(self) -> List[str]:
        return cast(List[str], self._trait_to_property_map._fetch_property_value('cdmSchemas'))

    @cdm_schemas.setter
    def cdm_schemas(self, val: List[str]) -> None:
        self._trait_to_property_map._update_property_value('cdmSchemas', val)

    @property
    def primary_key(self) -> str:
        return cast(str, self._trait_to_property_map._fetch_property_value('primaryKey'))

    @property
    def _trait_to_property_map(self) -> 'TraitToPropertyMap':
        from cdm.utilities import TraitToPropertyMap

        if not self._ttpm:
            self._ttpm = TraitToPropertyMap(self)
        return self._ttpm

    def _add_attribute_def(self, attribute_def: 'CdmAttributeItem') -> 'CdmAttributeItem':
        self.attributes.append(attribute_def)
        return attribute_def

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext'] = None) -> 'ResolvedAttributeSetBuilder':
        # find and cache the complete set of attributes
        # attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
        # an extended entity, traits applied to extended entity, exhibited traits of main entity,
        # the (datatype or entity) used as an attribute, traits applied to that datatype or entity,
        # the relationsip of the attribute, the attribute definition itself and included attribute groups,
        #  any traits applied to the attribute.
        from cdm.resolvedmodel import ResolvedAttributeSetBuilder
        from cdm.utilities import AttributeContextParameters

        self._rasb = ResolvedAttributeSetBuilder()
        self._rasb.ras.attribute_context = under

        if self.extends_entity:
            ext_ref = self.extends_entity
            extends_ref_under = None
            acp_ext_ent = None

            if under:
                acp_ext = AttributeContextParameters(
                    under=under,
                    type=CdmAttributeContextType.ENTITY_REFERENCE_EXTENDS,
                    name='extends',
                    regarding=None,
                    include_traits=False)
                extends_ref_under = self._rasb.ras.create_attribute_context(res_opt, acp_ext)

            if ext_ref.explicit_reference and ext_ref.fetch_object_definition(res_opt).object_type == CdmObjectType.PROJECTION_DEF:
                # A Projection

                ext_ref_obj_def = ext_ref.fetch_object_definition(res_opt)
                if extends_ref_under:
                    acp_ext_ent = AttributeContextParameters(
                        under=extends_ref_under,
                        type=CdmAttributeContextType.PROJECTION,
                        name=ext_ref_obj_def.get_name(),
                        regarding=ext_ref,
                        include_traits=False
                    )

                proj_directive = ProjectionDirective(res_opt, self, ext_ref)
                proj_def = ext_ref_obj_def
                proj_ctx = proj_def._construct_projection_context(proj_directive, extends_ref_under)

                self._rasb.ras = proj_def._extract_resolved_attributes(proj_ctx)
            else:
                # An Entity Reference

                if extends_ref_under:
                    acp_ext_ent = AttributeContextParameters(
                        under=extends_ref_under,
                        type=CdmAttributeContextType.ENTITY,
                        name=ext_ref.named_reference if ext_ref.named_reference else ext_ref.explicit_reference.get_name(),
                        regarding=ext_ref,
                        include_traits=False
                    )

                # save moniker, extended entity may attach a different moniker that we do not
                # want to pass along to getting this entities attributes
                old_moniker = res_opt._from_moniker

                self._rasb.merge_attributes(self.extends_entity._fetch_resolved_attributes(res_opt, acp_ext_ent))

                if not res_opt._check_attribute_count(self._rasb.ras._resolved_attribute_count):
                    logger.error(self._TAG, self.ctx, 'Maximum number of resolved attributes reached for the entity: {}.'.format(self.entity_name))
                    return None

                if self.extends_entity_resolution_guidance:
                    # some guidance was given on how to integrate the base attributes into the set. apply that guidance
                    rts_base = self._fetch_resolved_traits(res_opt)  # type: ResolvedTraitSet

                    # this context object holds all of the info about what needs to happen to resolve these attributes.
                    # make a copy and set defaults if needed
                    res_guide = self.extends_entity_resolution_guidance.copy(res_opt)  # CdmAttributeResolutionGuidanceDefinition
                    res_guide._update_attribute_defaults(res_guide.fetch_object_definition_name())
                    # holds all the info needed by the resolver code
                    arc = AttributeResolutionContext(res_opt, res_guide, rts_base)  # type: AttributeResolutionContext

                    self._rasb.generate_applier_attributes(arc, False)  # true = apply the prepared traits to new atts

                # reset to the old moniker
                res_opt._from_moniker = old_moniker

        self._rasb.mark_inherited()
        self._rasb.ras.attribute_context = under

        if self.attributes:
            for att in self.attributes:
                acp_att = None
                if under:
                    acp_att = AttributeContextParameters(
                        under=under,
                        type=CdmAttributeContextType.ATTRIBUTE_DEFINITION,
                        name=att.fetch_object_definition_name(),
                        regarding=att,
                        include_traits=False)
                self._rasb.merge_attributes(att._fetch_resolved_attributes(res_opt, acp_att))

                if not res_opt._check_attribute_count(self._rasb.ras._resolved_attribute_count):
                    logger.error(self._TAG, self.ctx, 'Maximum number of resolved attributes reached for the entity: {}.'.format(self.entity_name))
                    return None

        self._rasb.mark_order()
        self._rasb.ras.attribute_context = under

        # things that need to go away
        self._rasb.remove_requested_atts()

        return self._rasb

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        from cdm.resolvedmodel import ResolvedTraitSet

        base = self.extends_entity
        if base:
            # merge in all from base class
            rtsb.merge_traits(base._fetch_resolved_traits(res_opt))

        if self.attributes:
            rts_elevated = ResolvedTraitSet(res_opt)
            for att in self.attributes:
                rts_att = att._fetch_resolved_traits(res_opt)
                if rts_att and rts_att.has_elevated:
                    rts_elevated = rts_elevated.merge_set(rts_att, True)
            rtsb.merge_traits(rts_elevated)

        self._construct_resolved_traits_def(None, rtsb, res_opt)

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmEntityDefinition'] = None) -> 'CdmEntityDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmEntityDefinition(self.ctx, self.entity_name, None)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.entity_name = self.entity_name
            copy.attributes.clear()

        copy.extends_entity = cast('CdmEntityReference', self.extends_entity.copy(res_opt)) if self.extends_entity else None
        copy.extends_entity_resolution_guidance = self.extends_entity_resolution_guidance.copy(res_opt) if self.extends_entity_resolution_guidance else None
        copy.attribute_context = cast('CdmAttributeContext', self.attribute_context.copy(res_opt)) if self.attribute_context else None

        for att in self.attributes:
            copy.attributes.append(att)

        self._copy_def(res_opt, copy)

        return copy

    # TODO: Refactor and split this function to be more structured.
    async def create_resolved_entity_async(self, new_ent_name: str, res_opt: Optional['ResolveOptions'] = None, folder: 'CdmFolderDefinition' = None,
                                           new_doc_name: str = None) -> 'CdmEntityDefinition':
        """Create a resolved copy of the entity."""

        if not res_opt:
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)

        if not res_opt.wrt_doc:
            logger.error(self._TAG, self.ctx, 'No WRT document was supplied.', self.create_resolved_entity_async.__name__)
            return None

        if not new_ent_name:
            logger.error(self._TAG, self.ctx, 'No Entity Name provided.', self.create_resolved_entity_async.__name__)
            return None

        folder = folder or self.in_document.folder
        file_name = new_doc_name or new_ent_name + PersistenceLayer.CDM_EXTENSION
        orig_doc = self.in_document.at_corpus_path

        # Don't overwite the source document.
        target_at_corpus_path = self.ctx.corpus.storage.create_absolute_corpus_path(folder.at_corpus_path, folder) + file_name
        if StringUtils.equals_with_ignore_case(target_at_corpus_path, orig_doc):
            logger.error(self._TAG, self.ctx, 'Attempting to replace source entity\'s document \'{}\''.format(
                target_at_corpus_path), self.create_resolved_entity_async.__name__)
            return None

        if not await res_opt.wrt_doc._index_if_needed(res_opt):
            logger.error(self._TAG, self.ctx, 'Couldn\'t index source document.', self.create_resolved_entity_async.__name__)
            return None

        # Make the top level attribute context for this entity.
        # for this whole section where we generate the attribute context tree and get resolved attributes
        # set the flag that keeps all of the parent changes and document dirty from from happening
        was_resolving = self.ctx.corpus._is_currently_resolving
        self.ctx.corpus._is_currently_resolving = True
        ent_name = new_ent_name
        ctx = self.ctx
        att_ctx_ent = ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_CONTEXT_DEF, ent_name, True)  # type: CdmAttributeContext
        att_ctx_ent.ctx = ctx
        att_ctx_ent.in_document = self.in_document

        # Cheating a bit to put the paths in the right place.
        acp = AttributeContextParameters()
        acp._under = att_ctx_ent
        acp._type = CdmAttributeContextType.ATTRIBUTE_GROUP
        acp._name = 'attributeContext'

        att_ctx_ac = CdmAttributeContext._create_child_under(res_opt, acp)
        acp_ent = AttributeContextParameters()
        acp_ent._under = att_ctx_ac
        acp_ent._type = CdmAttributeContextType.ENTITY
        acp_ent._name = ent_name
        acp_ent._regarding = ctx.corpus.make_ref(CdmObjectType.ENTITY_REF, self.get_name(), True)

        # Use this whenever we need to keep references pointing at things that were already found.
        # Used when 'fixing' references by localizing to a new document.
        res_opt_copy = CdmObject._copy_resolve_options(res_opt)
        res_opt_copy._save_resolutions_on_copy = True

        # Resolve attributes with this context. the end result is that each resolved attribute points to the level of
        # the context where it was created.
        ras = self._fetch_resolved_attributes(res_opt_copy, acp_ent)

        if ras is None:
            self._resolving_attributes = False
            return None

        # Create a new copy of the attribute context for this entity.
        # TODO: all_att_ctx type ideally should be ordered set
        all_att_ctx = []  # type: List[CdmAttributeContext]
        new_node = cast('CdmAttributeContext', att_ctx_ent.copy_node(res_opt))
        att_ctx_ent = att_ctx_ent._copy_attribute_context_tree(res_opt, new_node, ras, all_att_ctx, 'resolvedFrom')
        att_ctx = cast('CdmAttributeContext', cast('CdmAttributeContext', att_ctx_ent.contents[0]).contents[0])

        self.ctx.corpus._is_currently_resolving = was_resolving

        # make a new document in given folder if provided or the same folder as the source entity
        folder.documents.remove(file_name)
        doc_res = folder.documents.append(file_name)
        # add a import of the source document
        orig_doc = self.ctx.corpus.storage.create_relative_corpus_path(orig_doc, doc_res)  # just in case we missed the prefix
        doc_res.imports.append(orig_doc, "resolvedFrom")

        # make the empty entity
        ent_resolved = doc_res.definitions.append(ent_name)
        # set the context to the copy of the tree. fix the docs on the context nodes
        ent_resolved.attribute_context = att_ctx

        def visit_callback(obj: 'CdmObject', path: str) -> bool:
            obj.in_document = doc_res
            return False

        att_ctx.visit('{}/attributeContext/'.format(ent_name), visit_callback, None)

        # add the traits of the entity
        rts_ent = self._fetch_resolved_traits(res_opt)
        for rt in rts_ent.rt_set:
            trait_ref = CdmObject._resolved_trait_to_trait_ref(res_opt_copy, rt)
            ent_resolved.exhibits_traits.append(trait_ref)

        # The attributes have been named, shaped, etc. for this entity so now it is safe to go and make each attribute
        # context level point at these final versions of attributes.
        att_path_to_order = {}  # type: Dict[str, int]

        def point_context_at_resolved_atts(ras_sub: 'ResolvedAttributeSet', path: str) -> None:
            for ra in ras_sub._set:
                ra_ctx_in_ent = []  # type: List[CdmAttributeContext]
                ra_ctx_set = ras_sub.rattr_to_attctxset.get(ra)

                # find the correct attctx for this copy, intersect these two sets
                # (interate over the shortest list)
                if len(all_att_ctx) < len(ra_ctx_set):
                    for curr_att_ctx in all_att_ctx:
                        if curr_att_ctx in ra_ctx_set:
                            ra_ctx_in_ent.append(curr_att_ctx)
                else:
                    for curr_att_ctx in ra_ctx_set:
                        if curr_att_ctx in all_att_ctx:
                            ra_ctx_in_ent.append(curr_att_ctx)
                for ra_ctx in ra_ctx_in_ent:
                    refs = ra_ctx.contents

                    #  there might be more than one explanation for where and attribute came from when things get merges as they do
                    # This won't work when I add the structured attributes to avoid name collisions.
                    att_ref_path = path + ra.resolved_name
                    if isinstance(ra.target, CdmObject):
                        if not att_ref_path in att_path_to_order:
                            att_ref = self.ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_REF, att_ref_path, True)  # type: CdmObjectReference
                            # only need one explanation for this path to the insert order
                            att_path_to_order[att_ref.named_reference] = ra.insert_order
                            refs.append(att_ref)
                    else:
                        att_ref_path += '/members/'
                        point_context_at_resolved_atts(cast('ResolvedAttributeSet', ra.target), att_ref_path)

        point_context_at_resolved_atts(ras, ent_name + '/hasAttributes/')

        # generated attribute structures may end up with 0 attributes after that. prune them
        def clean_sub_group(sub_item, under_generated) -> bool:
            if sub_item.object_type == CdmObjectType.ATTRIBUTE_REF:
                return True  # not empty

            ac = sub_item  # type: CdmAttributeContext

            if ac.type == CdmAttributeContextType.GENERATED_SET:
                under_generated = True
            if not ac.contents:
                return False  # empty

            # look at all children, make a set to remove
            to_remove = []  # type: List[CdmAttributeContext]
            for sub_sub in ac.contents:
                if not clean_sub_group(sub_sub, under_generated):
                    potential_target = under_generated
                    if not potential_target:
                        # cast is safe because we returned false meaning empty and not a attribute ref
                        # so is this the set holder itself?
                        potential_target = sub_sub.type == CdmAttributeContextType.GENERATED_SET
                    if potential_target:
                        to_remove.append(sub_sub)
            for to_die in to_remove:
                ac.contents.remove(to_die)
            return bool(ac.contents)

        clean_sub_group(att_ctx, False)

        # Create an all-up ordering of attributes at the leaves of this tree based on insert order. Sort the attributes
        # in each context by their creation order and mix that with the other sub-contexts that have been sorted.
        def get_order_num(item: 'CdmObject') -> int:
            if item.object_type == CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
                return order_contents(item)
            if item.object_type == CdmObjectType.ATTRIBUTE_REF:
                return att_path_to_order[item.named_reference]
            # put the mystery item on top.
            return -1

        def order_contents(under: 'CdmAttributeContext') -> int:
            if under._lowest_order is None:
                under._lowest_order = -1
                if len(under.contents) == 1:
                    under._lowest_order = get_order_num(under.contents[0])
                else:
                    def get_and_update_order(item1: 'CdmObject', item2: 'CdmObject'):
                        left_order = get_order_num(item1)
                        right_order = get_order_num(item2)
                        if left_order != -1 and (under._lowest_order == -1 or left_order < under._lowest_order):
                            under._lowest_order = left_order
                        if right_order != -1 and (under._lowest_order == -1 or right_order < under._lowest_order):
                            under._lowest_order = right_order
                        return left_order - right_order
                    under.contents.sort(key=functools.cmp_to_key(get_and_update_order))
            return under._lowest_order

        order_contents(att_ctx)

        # Resolved attributes can gain traits that are applied to an entity when referenced since these traits are
        # described in the context, it is redundant and messy to list them in the attribute. So, remove them. Create and
        # cache a set of names to look for per context. There is actually a hierarchy to this. All attributes from the
        # base entity should have all traits applied independently of the sub-context they come from. Same is true of
        # attribute entities. So do this recursively top down.
        ctx_to_trait_names = {}  # type: Dict[CdmAttributeContext, Set[str]]

        def collect_context_traits(sub_att_ctx: 'CdmAttributeContext', inherited_trait_names: Set[str]) -> None:
            trait_names_here = set(inherited_trait_names)
            traits_here = sub_att_ctx.exhibits_traits
            if traits_here:
                for tat in traits_here:
                    trait_names_here.add(tat.named_reference)

            ctx_to_trait_names[sub_att_ctx] = trait_names_here
            for cr in sub_att_ctx.contents:
                if cr.object_type == CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
                    # do this for all types?
                    collect_context_traits(cast('CdmAttributeContext', cr), trait_names_here)

        collect_context_traits(att_ctx, set())

        # add the attributes, put them in attribute groups if structure needed.
        res_att_to_ref_path = {}  # type: Dict[ResolvedAttribute, str]

        def add_attributes(ras_sub: 'ResolvedAttributeSet', container: 'Union[CdmEntityDefinition, CdmAttributeGroupDefinition]', path: str) -> None:
            for ra in ras_sub._set:
                att_path = path + ra.resolved_name
                # use the path of the context associated with this attribute to find the new context that matches on path.
                ra_ctx_set = ras_sub.rattr_to_attctxset[ra]
                # find the correct att_ctx for this copy.
                # ra_ctx = next((ac for ac in all_att_ctx if ac in ra_ctx_set), None) # type: CdmAttributeContext

                if len(all_att_ctx) < len(ra_ctx_set):
                    for curr_att_ctx in all_att_ctx:
                        if curr_att_ctx in ra_ctx_set:
                            ra_ctx = curr_att_ctx
                            break
                else:
                    for curr_att_ctx in ra_ctx_set:
                        if curr_att_ctx in all_att_ctx:
                            ra_ctx = curr_att_ctx
                            break

                if isinstance(ra.target, ResolvedAttributeSet) and cast('ResolvedAttributeSet', ra.target)._set:
                    # this is a set of attributes. Make an attribute group to hold them.
                    att_grp = self.ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_GROUP_DEF, ra.resolved_name)  # type: CdmAttributeGroupDefinition
                    att_grp.attribute_context = self.ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_CONTEXT_REF, ra_ctx.at_corpus_path, True)
                    # take any traits from the set and make them look like traits exhibited by the group.
                    avoid_set = ctx_to_trait_names[ra_ctx]
                    rts_att = ra.resolved_traits
                    for rt in rts_att.rt_set:
                        if not rt.trait.ugly:  # Don't mention your ugly traits.
                            if not avoid_set or rt.trait_name not in avoid_set:  # Avoid the ones from the context.
                                trait_ref = CdmObject._resolved_trait_to_trait_ref(res_opt_copy, rt)
                                cast('CdmObjectDefinition', att_grp).exhibits_traits.append(trait_ref, isinstance(trait_ref, str))

                    # wrap it in a reference and then recurse with this as the new container.
                    att_grp_ref = self.ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_GROUP_REF, None)  # type: CdmAttributeGroupReference
                    att_grp_ref.explicit_reference = att_grp
                    container._add_attribute_def(att_grp_ref)
                    # isn't this where ...
                    add_attributes(cast('ResolvedAttributeSet', ra.target), att_grp, att_path + '/(object)/members/')
                else:
                    att = self.ctx.corpus.make_object(CdmObjectType.TYPE_ATTRIBUTE_DEF, ra.resolved_name)  # type: CdmTypeAttributeDefinition
                    att.attribute_context = self.ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_CONTEXT_REF, ra_ctx.at_corpus_path, True)
                    avoid_set = ctx_to_trait_names[ra_ctx]
                    rts_att = ra.resolved_traits
                    for rt in rts_att.rt_set:
                        if not rt.trait.ugly:  # Don't mention your ugly traits.
                            if not avoid_set or rt.trait_name not in avoid_set:  # Avoid the ones from the context.
                                trait_ref = CdmObject._resolved_trait_to_trait_ref(res_opt_copy, rt)
                                cast('CdmTypeAttributeDefinition', att).applied_traits.append(trait_ref, isinstance(trait_ref, str))

                    # none of the dataformat traits have the bit set that will make them turn into a property
                    # this is intentional so that the format traits make it into the resolved object
                    # but, we still want a guess as the data format, so get it and set it.
                    implied_data_format = att.data_format
                    if implied_data_format:
                        att.data_format = implied_data_format

                    container._add_attribute_def(att)
                    res_att_to_ref_path[ra] = att_path

        add_attributes(ras, ent_resolved, ent_name + '/hasAttributes/')

        # Any resolved traits that hold arguments with attribute refs should get 'fixed' here.
        def replace_trait_att_ref(tr: 'CdmTraitReference', entity_hint: str) -> None:
            if tr.arguments:
                for arg in tr.arguments:
                    v = arg._unresolved_value or arg.value
                    # Is this an attribute reference?
                    if v and isinstance(v, CdmObject) and cast('CdmObject', v).object_type == CdmObjectType.ATTRIBUTE_REF:
                        # Only try this if the reference has no path to it (only happens with intra-entity att refs).
                        att_ref = cast('CdmAttributeReference', v)
                        if att_ref.named_reference and att_ref.named_reference.find('/') == -1:
                            if not arg._unresolved_value:
                                arg._unresolved_value = arg.value
                            # Give a promise that can be worked out later.
                            # Assumption is that the attribute must come from this entity.
                            new_att_ref = self.ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_REF, entity_hint +
                                                                      '/(resolvedAttributes)/' + att_ref.named_reference, True)
                            # inDocument is not propagated during resolution, so set it here
                            new_att_ref.in_document = arg.in_document
                            arg.set_value(new_att_ref)

        # Fix entity traits.
        if ent_resolved.exhibits_traits:
            for et in ent_resolved.exhibits_traits:
                replace_trait_att_ref(et, new_ent_name)

        # Fix context traits.
        def fix_context_traits(sub_att_ctx: 'CdmAttributeContext', entity_hint: str) -> None:
            traits_here = sub_att_ctx.exhibits_traits
            if traits_here:
                for tr in traits_here:
                    replace_trait_att_ref(tr, entity_hint)

            for cr in sub_att_ctx.contents:
                if cr.object_type == CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
                    # If this is a new entity context, get the name to pass along.
                    sub_sub_att_ctx = cast('CdmAttributeContext', cr)
                    sub_entity_hint = entity_hint
                    if sub_sub_att_ctx.type == CdmAttributeContextType.ENTITY:
                        sub_entity_hint = sub_sub_att_ctx.definition.named_reference
                    # Do this for all types.
                    fix_context_traits(sub_sub_att_ctx, sub_entity_hint)

        fix_context_traits(att_ctx, new_ent_name)

        # And the attribute traits.
        ent_atts = ent_resolved.attributes
        if ent_atts:
            for attribute in ent_atts:
                att_traits = attribute.applied_traits
                if att_traits:
                    for tr in att_traits:
                        replace_trait_att_ref(tr, new_ent_name)

        # We are about to put this content created in the context of various documents (like references to attributes
        # from base entities, etc.) into one specific document. All of the borrowed refs need to work. so, re-write all
        # string references to work from this new document. The catch-22 is that the new document needs these fixes done
        # before it can be used to make these fixes. The fix needs to happen in the middle of the refresh trigger the
        # document to refresh current content into the resolved OM.
        cast('CdmAttributeContext', att_ctx).parent = None  # Remove the fake parent that made the paths work.
        res_opt_new = CdmObject._copy_resolve_options(res_opt)
        res_opt_new.wrt_doc = doc_res
        res_opt_new._localize_references_for = doc_res
        if not await doc_res.refresh_async(res_opt_new):
            logger.error(self._TAG, self.ctx, 'Failed to index the resolved document.', self.create_resolved_entity_async.__name__)
            return None

        # Get a fresh ref.
        ent_resolved = cast('CdmEntityDefinition', doc_res._fetch_object_from_document_path(ent_name, res_opt_new))

        self.ctx.corpus._res_ent_map[self.at_corpus_path] = ent_resolved.at_corpus_path

        return ent_resolved

    def _count_inherited_attributes(self, res_opt: Optional['ResolveOptions'] = None) -> int:
        """Return the count of attibutes inherited by this entity."""
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        # Ensures that cache exits.
        self._fetch_resolved_attributes(res_opt)
        return self._rasb.inherited_mark

    def _fetch_attributes_with_traits(self, res_opt: 'ResolveOptions', query_for: Union['TraitSpec', Iterable['TraitSpec']]) -> 'ResolvedAttributeSet':
        """Return a set of the entity attributes with traits."""
        ras = self._fetch_resolved_attributes(res_opt)
        return ras.fetch_attributes_with_traits(res_opt, query_for) if ras is not None else None

    def get_name(self) -> str:
        return self.entity_name

    def _fetch_property(self, property_name: str) -> Any:
        """returns the value direclty assigned to a property (ignore value from traits)."""
        return self._trait_to_property_map._fetch_property_value(property_name, True)

    def fetch_resolved_entity_references(self, res_opt: 'ResolveOptions') -> 'ResolvedEntityReferenceSet':
        # this whole resolved entity ref goo will go away when resolved documents are done.
        # for now, it breaks if structured att sets get made.
        from cdm.resolvedmodel import ResolvedEntityReferenceSet
        from cdm.utilities import AttributeResolutionDirectiveSet

        from .cdm_object import CdmObject

        was_previously_resolving = self.ctx.corpus._is_currently_resolving
        self.ctx.corpus._is_currently_resolving = True

        if not res_opt:
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)

        res_opt = CdmObject._copy_resolve_options(res_opt)
        res_opt.directives = AttributeResolutionDirectiveSet(set(['normalized', 'referenceOnly']))

        ctx = self.ctx
        ent_ref_set_cache = ctx.fetch_cache(self, res_opt, 'entRefSet')
        if not ent_ref_set_cache:
            ent_ref_set_cache = ResolvedEntityReferenceSet(res_opt)

            if not self._resolving_entity_references:
                self._resolving_entity_references = True
                # get from any base class and then 'fix' those to point here instead.
                ext_ref = self.extends_entity
                if ext_ref:
                    ext_def = cast('CdmEntityDefinition', ext_ref.fetch_object_definition(res_opt))
                    if ext_def:
                        inherited = ext_def.fetch_resolved_entity_references(res_opt)
                        if inherited:
                            for res in inherited.rer_set:
                                res = res.copy()
                                res.referencing.entity = self
                                ent_ref_set_cache.rer_set.append(res)
                if self.attributes:
                    for attribute in self.attributes:
                        # if any refs come back from attributes, they don't know who we are, so they don't set the entity
                        sub = attribute.fetch_resolved_entity_references(res_opt)
                        if sub:
                            for res in sub.rer_set:
                                res.referencing.entity = self

                            ent_ref_set_cache.add(sub)
                ctx.update_cache(self, res_opt, 'entRefSet', ent_ref_set_cache)
                self._resolving_entity_references = False

        self.ctx.corpus._is_currently_resolving = was_previously_resolving
        return ent_ref_set_cache

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)
        return self._is_derived_from_def(res_opt, self.extends_entity, self.get_name(), base)

    async def _query_on_traits_async(self, query_spec: Union[str, object]) -> Iterable[object]:
        """Query the manifest for a set of entities that match an input query
        query_spec = a JSON object (or a string that can be parsed into one) of the form
        {"entityName":"", "attributes":[{see QueryOnTraits for CdmEntityDefinition for details}]}
        returns null for 0 results or an array of json objects, each matching the shape of
        the input query, with entity and attribute names filled in"""
        return None

    def validate(self) -> bool:
        if not bool(self.entity_name):
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, ['entity_name']))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from + self.entity_name
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.extends_entity and self.extends_entity.visit(path + '/extendsEntity/', pre_children, post_children):
            return True

        if self._visit_def(path, pre_children, post_children):
            return True

        if self.attribute_context and self.attribute_context.visit(path + '/attributeContext/', pre_children, post_children):
            return True

        if self.attributes and self.attributes._visit_array(path + '/hasAttributes/', pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
