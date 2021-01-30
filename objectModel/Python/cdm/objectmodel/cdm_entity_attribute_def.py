# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import cast, Optional, TYPE_CHECKING

from cdm.enums import CdmAttributeContextType, CdmObjectType
from cdm.objectmodel.projections.cardinality_settings import CardinalitySettings
from cdm.resolvedmodel.projections.projection_directive import ProjectionDirective
from cdm.utilities import DepthInfo, Errors, ResolveOptions, TraitToPropertyMap, logger

from .cdm_attribute_def import CdmAttribute
from .relationship_info import RelationshipInfo

if TYPE_CHECKING:
    from cdm.objectmodel import CdmAttributeContext, CdmCorpusContext, CdmEntityReference
    from cdm.resolvedmodel import AttributeResolutionContext, ResolvedAttributeSetBuilder, ResolvedTraitSetBuilder


class CdmEntityAttributeDefinition(CdmAttribute):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx, name)

        # The entity attribute's entity reference.
        self.entity = None  # type: Optional[CdmEntityReference]

        # For projection based models, a source is explicitly tagged as a polymorphic source for it to be recognized as such.
        # This property of the entity attribute allows us to do that.
        self.is_polymorphic_source = None  # type: Optional[bool]

        # --- internal ---
        self._TAG = CdmEntityAttributeDefinition.__name__
        self._ttpm = None  # type: Optional[TraitToPropertyMap]

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
    def entity(self) -> Optional['CdmEntityReference']:
        return self._entity

    @entity.setter
    def entity(self, entity: Optional['CdmEntityReference']) -> None:
        if entity:
            entity.owner = self
        self._entity = entity

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.ENTITY_ATTRIBUTE_DEF

    @property
    def _trait_to_property_map(self) -> 'TraitToPropertyMap':
        if not self._ttpm:
            self._ttpm = TraitToPropertyMap(self)
        return self._ttpm

    def _fetch_att_res_context(self, res_opt):
        from .cdm_attribute_resolution_guidance_def import CdmAttributeResolutionGuidanceDefinition
        from cdm.resolvedmodel.resolved_attribute_set_builder import AttributeResolutionContext
        rts_this_att = self._fetch_resolved_traits(res_opt)

        # this context object holds all of the info about what needs to happen to resolve these attributes.
        # make a copy and add defaults if missing
        res_guide_with_default = None
        if self.resolution_guidance is not None:
            res_guide_with_default = self.resolution_guidance.copy(res_opt)
        else:
            res_guide_with_default = CdmAttributeResolutionGuidanceDefinition(self.ctx)

        res_guide_with_default._update_attribute_defaults(self.name, self)

        return AttributeResolutionContext(res_opt, res_guide_with_default, rts_this_att)

    def _fetch_object_from_cache(self, res_opt: 'ResolveOptions', acp_in_context: Optional['AttributeContextParameters'] = None) -> 'ResolvedAttributeSet':
        kind = 'rasb'
        ctx = self.ctx

        # check cache at the correct depth for entity attributes
        rel_info = self._get_relationship_info(res_opt, self._fetch_att_res_context(res_opt))
        if rel_info.max_depth_exceeded:
            res_opt._depth_info.current_depth = rel_info.next_depth
            res_opt._depth_info.max_depth = rel_info.max_depth
            res_opt._depth_info.max_depth_exceeded = rel_info.max_depth_exceeded

        cache_tag = ctx.corpus._create_definition_cache_tag(res_opt, self, kind, 'ctx' if acp_in_context else '')

        if rel_info.max_depth_exceeded:
            # temporaty fix to avoid the depth from being increased while calculating the cache tag
            res_opt._depth_info.current_depth -= 1

        return ctx._cache.get(cache_tag) if cache_tag else None

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext'] = None) -> 'ResolvedAttributeSetBuilder':
        from cdm.resolvedmodel import AttributeResolutionContext, ResolvedAttribute, ResolvedAttributeSetBuilder, ResolvedTrait
        from cdm.utilities import AttributeContextParameters, AttributeResolutionDirectiveSet

        from .cdm_object import CdmObject

        rasb = ResolvedAttributeSetBuilder()
        ctx_ent = self.entity
        under_att = under
        acp_ent = None

        if not res_opt._in_circular_reference:
            arc = self._fetch_att_res_context(res_opt)

            # complete cheating but is faster.
            # this purpose will remove all of the attributes that get collected here, so dumb and slow to go get them
            rel_info = self._get_relationship_info(arc.res_opt, arc)
            res_opt._depth_info.current_depth = rel_info.next_depth
            res_opt._depth_info.max_depth_exceeded = rel_info.max_depth_exceeded
            res_opt._depth_info.max_depth = rel_info.max_depth

            ctx_ent_obj_def = ctx_ent.fetch_object_definition(res_opt)

            if ctx_ent_obj_def and ctx_ent_obj_def.object_type == CdmObjectType.PROJECTION_DEF:
                # A Projection

                # if the max depth is exceeded it should not try to execute the projection
                if not res_opt._depth_info.max_depth_exceeded:
                    proj_directive = ProjectionDirective(res_opt, self, ctx_ent)
                    proj_def = ctx_ent_obj_def
                    proj_ctx = proj_def._construct_projection_context(proj_directive, under)

                    ras = proj_def._extract_resolved_attributes(proj_ctx, under_att)
                    rasb._resolved_attribute_set = ras
            else:
                # An Entity Reference

                if under_att:
                    # make a context for this attribute that holds the attributes that come up from the entity
                    acp_ent = AttributeContextParameters(
                        under=under_att,
                        type=CdmAttributeContextType.ENTITY,
                        name=ctx_ent.fetch_object_definition_name(),
                        regarding=ctx_ent,
                        include_traits=True)

                if rel_info.is_by_ref:
                    # make the entity context that a real recursion would have give us
                    if under:
                        under = rasb._resolved_attribute_set.create_attribute_context(res_opt, acp_ent)

                    # if selecting from one of many attributes, then make a context for each one
                    if under and rel_info.selects_one:
                        # the right way to do this is to get a resolved entity from the embedded entity and then
                        # look through the attribute context hierarchy for non-nested entityReferenceAsAttribute nodes
                        # that seems like a disaster waiting to happen given endless looping, etc.
                        # for now, just insist that only the top level entity attributes declared in the ref entity will work
                        ent_pick_from = self.entity.fetch_object_definition(res_opt)
                        atts_pick = ent_pick_from.attributes
                        if ent_pick_from and atts_pick:
                            for attribute in atts_pick:
                                if attribute.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
                                    # a table within a table. as expected with a selects_one attribute
                                    # since this is by ref, we won't get the atts from the table, but we do need the traits that hold the key
                                    # these are the same contexts that would get created if we recursed
                                    # first this attribute
                                    acp_ent_att = AttributeContextParameters(
                                        under=under,
                                        type=CdmAttributeContextType.ATTRIBUTE_DEFINITION,
                                        name=attribute.fetch_object_definition_name(),
                                        regarding=attribute,
                                        include_traits=True)
                                    pick_under = rasb._resolved_attribute_set.create_attribute_context(res_opt, acp_ent_att)
                                    # and the entity under that attribute
                                    pick_ent = attribute.entity
                                    pick_ent_type = CdmAttributeContextType.PROJECTION if pick_ent.fetch_object_definition(
                                        res_opt).object_type == CdmObjectType.PROJECTION_DEF else CdmAttributeContextType.ENTITY
                                    acp_ent_att_ent = AttributeContextParameters(
                                        under=pick_under,
                                        type=pick_ent_type,
                                        name=pick_ent.fetch_object_definition_name(),
                                        regarding=pick_ent,
                                        include_traits=True)
                                    rasb._resolved_attribute_set.create_attribute_context(res_opt, acp_ent_att_ent)

                    # if we got here because of the max depth, need to impose the directives to make the trait work as expected
                    if rel_info.max_depth_exceeded:
                        if not arc.res_opt.directives:
                            arc.res_opt.directives = AttributeResolutionDirectiveSet()
                        arc.res_opt.directives.add('referenceOnly')
                else:
                    res_link = res_opt.copy()
                    res_link._symbol_ref_set = res_opt._symbol_ref_set
                    rasb.merge_attributes(self.entity._fetch_resolved_attributes(res_link, acp_ent))

                    # need to pass up max_depth_exceeded if it was hit
                    if res_link._depth_info.max_depth_exceeded:
                        res_opt._depth_info = res_link._depth_info._copy()

                # from the traits of purpose and applied here, see if new attributes get generated
                rasb._resolved_attribute_set.attribute_context = under_att
                rasb.apply_traits(arc)
                rasb.generate_applier_attributes(arc, True)  # True = apply the prepared traits to new atts
                # this may have added symbols to the dependencies, so merge them
                res_opt._symbol_ref_set._merge(arc.res_opt._symbol_ref_set)

                # use the traits for linked entity identifiers to record the actual foreign key links
                if rasb._resolved_attribute_set and rasb._resolved_attribute_set._set and rel_info.is_by_ref:
                    for att in rasb._resolved_attribute_set._set:
                        reqd_trait = att.resolved_traits.find(res_opt, 'is.linkedEntity.identifier')
                        if not reqd_trait:
                            continue

                        if not reqd_trait.parameter_values:
                            logger.warning(self._TAG, self.ctx, 'is.linkedEntity.identifier does not support arguments')
                            continue

                        ent_references = []
                        att_references = []

                        def add_entity_reference(entity_ref: 'CdmEntityReference', namespace: str):
                            ent_def = entity_ref.fetch_object_definition(res_opt)
                            required_trait = entity_ref._fetch_resolved_traits(res_opt).find(res_opt, 'is.identifiedBy')
                            if required_trait and ent_def:
                                att_ref = required_trait.parameter_values.fetch_parameter_value('attribute').value
                                att_name = att_ref.named_reference.split('/')[-1]
                                # path should be absolute and without a namespace
                                relative_ent_path = self.ctx.corpus.storage.create_absolute_corpus_path(ent_def.at_corpus_path, ent_def.in_document)
                                if relative_ent_path.startswith(namespace+':'):
                                    relative_ent_path = relative_ent_path[len(namespace) + 1:]
                                ent_references.append(relative_ent_path)
                                att_references.append(att_name)

                        if rel_info.selects_one:
                            ent_pick_from = self.entity.fetch_object_definition(res_opt)
                            atts_pick = ent_pick_from.attributes if ent_pick_from else None
                            if atts_pick:
                                for attribute in atts_pick:
                                    if attribute.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
                                        add_entity_reference(attribute.entity, self.in_document.namespace)
                        else:
                            add_entity_reference(self.entity, self.in_document.namespace)

                        c_ent = self.ctx.corpus.make_object(CdmObjectType.CONSTANT_ENTITY_DEF)
                        c_ent.entity_shape = self.ctx.corpus.make_ref(CdmObjectType.ENTITY_REF, 'entityGroupSet', True)
                        c_ent.constant_values = [[entity_ref, att_references[idx]] for idx, entity_ref in enumerate(ent_references)]
                        param = self.ctx.corpus.make_ref(CdmObjectType.ENTITY_REF, c_ent, False)
                        reqd_trait.parameter_values.update_parameter_value(res_opt, 'entityReferences', param)

                # a 'structured' directive wants to keep all entity attributes together in a group
                if arc and arc.res_opt.directives and arc.res_opt.directives.has('structured'):
                    # make one resolved attribute with a name from this entityAttribute that contains the set
                    # of atts we just put together.
                    ra_sub = ResolvedAttribute(arc.traits_to_apply.res_opt, rasb._resolved_attribute_set, self.name, under_att)
                    if rel_info.is_array:
                        # put a resolved trait on this att group
                        # hope I never need to do this again and then need to make a function for this
                        tr = self.ctx.corpus.make_object(CdmObjectType.TRAIT_REF, 'is.linkedEntity.array', True)
                        t = tr.fetch_object_definition(res_opt)
                        rt = ResolvedTrait(t, None, [], [])
                        ra_sub.resolved_traits = ra_sub.resolved_traits.merge(rt, True)
                    depth = rasb._resolved_attribute_set._depth_traveled
                    rasb = ResolvedAttributeSetBuilder()
                    rasb._resolved_attribute_set.attribute_context = ra_sub.att_ctx  # this got set to null with the new builder
                    rasb.own_one(ra_sub)
                    rasb._resolved_attribute_set._depth_traveled = depth

        # how ever they got here, mark every attribute from this entity attribute as now being 'owned' by this entityAtt
        rasb._resolved_attribute_set._set_attribute_ownership(self.name)
        rasb._resolved_attribute_set._depth_traveled += 1

        return rasb

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        if self.purpose:
            rtsb.take_reference(self.purpose._fetch_resolved_traits(res_opt))

        self._add_resolved_traits_applied(rtsb, res_opt)

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmEntityAttributeDefinition'] = None) -> 'CdmEntityAttributeDefinition':
        if not res_opt:
            res_opt = ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = CdmEntityAttributeDefinition(self.ctx, self.name)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.name = self.name

        copy.entity = self.entity.copy(res_opt)
        self._copy_att(res_opt, copy)

        return copy

    def get_name(self) -> str:
        return self.name

    def _get_relationship_info(self, res_opt: 'ResolveOptions', arc: 'AttributeResolutionContext') -> 'RelationshipInfo':
        rts = None
        no_max_depth = False
        has_ref = False
        is_by_ref = False
        is_array = False
        selects_one = False
        max_depth = None
        next_depth = res_opt._depth_info.current_depth
        max_depth_exceeded = False

        if arc and arc.res_guide:
            if arc.res_guide.entity_by_reference and arc.res_guide.entity_by_reference.allow_reference:
                has_ref = True
            if arc.res_opt.directives:
                no_max_depth = arc.res_opt.directives.has('noMaxDepth')
                # based on directives
                if has_ref:
                    is_by_ref = arc.res_opt.directives.has('referenceOnly')
                selects_one = arc.res_opt.directives.has('selectOne')
                is_array = arc.res_opt.directives.has('isArray')

            # if this is a 'selectone', then skip counting this entity in the depth, else count it
            if not selects_one:
                # if already a ref, who cares?
                if not is_by_ref:
                    
                    next_depth += 1

                    # max comes from settings but may not be set
                    max_depth = res_opt.max_depth
                    if has_ref and arc.res_guide.entity_by_reference.reference_only_after_depth:
                        max_depth = arc.res_guide.entity_by_reference.reference_only_after_depth
                    if no_max_depth:
                        # no max? really? what if we loop forever? if you need more than 32 nested entities,
                        # then you should buy a different metadata description system.
                        max_depth = DepthInfo.MAX_DEPTH_LIMIT

                    if next_depth > max_depth:
                        # don't do it
                        is_by_ref = True
                        max_depth_exceeded = True

        return RelationshipInfo(
            rts=rts,
            is_by_ref=is_by_ref,
            is_array=is_array,
            selects_one=selects_one,
            next_depth=next_depth,
            max_depth=max_depth,
            max_depth_exceeded=max_depth_exceeded)

    def fetch_resolved_entity_references(self, res_opt: Optional['ResolveOptions'] = None) -> 'ResolvedEntityReferenceSet':
        # need to copy so that relationship depth of parent is not overwritten
        res_opt = res_opt.copy() if res_opt is not None else ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        from cdm.resolvedmodel import AttributeResolutionContext, ResolvedEntityReference, ResolvedEntityReferenceSide, ResolvedEntityReferenceSet
        from cdm.utilities import ResolveOptions

        from .cdm_object import CdmObject

        rts_this_att = self._fetch_resolved_traits(res_opt)
        res_guide = self.resolution_guidance

        # this context object holds all of the info about what needs to happen to resolve these attributes
        arc = AttributeResolutionContext(res_opt, res_guide, rts_this_att)

        rel_info = self._get_relationship_info(res_opt, arc)
        if not rel_info.is_by_ref or rel_info.is_array:
            return None

        # only place this is used, so logic here instead of encapsulated.
        # make a set and the one ref it will hold
        rers = ResolvedEntityReferenceSet(res_opt)
        rer = ResolvedEntityReference()
        # referencing attribute(s) come from this attribute
        rer.referencing._rasb.merge_attributes(self._fetch_resolved_attributes(res_opt))

        def resolve_side(ent_ref: 'CdmEntityReference') -> ResolvedEntityReferenceSide:
            side_other = ResolvedEntityReferenceSide()
            if ent_ref:
                # reference to the other entity, hard part is the attribue name.
                # by convention, this is held in a trait that identifies the key
                side_other.entity = ent_ref.fetch_object_definition(res_opt)
                if side_other.entity:
                    other_attribute = None
                    other_opts = ResolveOptions(wrt_doc=res_opt.wrt_doc, directives=res_opt.directives)
                    trait = ent_ref._fetch_resolved_traits(other_opts).find(other_opts, 'is.identifiedBy')
                    if trait and trait.parameter_values and trait.parameter_values.length:
                        other_ref = trait.parameter_values.fetch_parameter_value('attribute').value
                        if isinstance(other_ref, CdmObject):
                            other_attribute = other_ref.fetch_object_definition(other_opts)
                            if other_attribute:
                                ras = side_other.entity._fetch_resolved_attributes(other_opts)
                                if ras is not None:
                                    side_other._rasb.own_one(ras
                                                             .get(other_attribute.get_name())
                                                             .copy())

            return side_other

        # either several or one entity
        # for now, a sub for the 'select one' idea
        if self.entity.explicit_reference:
            ent_pick_from = self.entity.fetch_object_definition(res_opt)
            atts_pick = ent_pick_from.attributes
            if ent_pick_from and atts_pick:
                for attribute in atts_pick:
                    if attribute.object_type == CdmObjectType.ENTITY_ATTRIBUTE_DEF:
                        entity = attribute.entity
                        rer.referenced.append(resolve_side(entity))
        else:
            rer.referenced.append(resolve_side(self.entity))

        rers.rer_set.append(rer)

        return rers

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:  # pylint: disable=unused-argument
        return False

    def validate(self) -> bool:
        missing_fields = []
        if not bool(self.name):
            missing_fields.append('name')
        if not bool(self.entity):
            missing_fields.append('entity')
        if bool(self.cardinality):
            if not bool(self.cardinality.minimum):
                missing_fields.append('cardinality.minimum')
            if not bool(self.cardinality.maximum):
                missing_fields.append('cardinality.maximum')

        if missing_fields:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False

        if bool(self.cardinality):
            if not CardinalitySettings._is_minimum_valid(self.cardinality.minimum):
                logger.error(self._TAG, self.ctx, 'Invalid minimum cardinality {}.'.format(self.cardinality.minimum))
                return False
            if not CardinalitySettings._is_maximum_valid(self.cardinality.maximum):
                logger.error(self._TAG, self.ctx, 'Invalid maximum cardinality {}.'.format(self.cardinality.maximum))
                return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        if self.entity is None:
            return False

        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from + self.name
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.entity.visit('{}/entity/'.format(path), pre_children, post_children):
            return True

        if self._visit_att(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
