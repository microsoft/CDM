# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import cast, List, Optional, Union, TYPE_CHECKING

from cdm.enums import CdmAttributeContextType, CdmObjectType
from cdm.resolvedmodel import ResolvedAttributeSet
from cdm.utilities import ResolveOptions, logger, Errors

from .cdm_collection import CdmCollection
from .cdm_object import CdmObject
from .cdm_object_def import CdmObjectDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmDocumentDefinition, CdmObject, CdmObjectReference
    from cdm.resolvedmodel import ResolvedAttributeSetBuilder, ResolvedTraitSet, ResolvedTraitSetBuilder
    from cdm.utilities import AttributeContextParameters, FriendlyFormatNode, VisitCallback


class CdmAttributeContext(CdmObjectDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        # the attribute context content list.
        self.contents = CdmCollection(
            self.ctx, self, CdmObjectType.ATTRIBUTE_CONTEXT_DEF)  # type: CdmCollection[Union[CdmObjectReference, CdmAttributeContext]]

        # a reference to the object from which this attribute context was defined.
        self.definition = None  # type: CdmObjectReference

        # the attribute context name.
        self.name = name  # type: str

        # the attribute context parent.
        self.parent = None  # type: Optional[CdmObjectReference]

        # the attribute context type.
        self.type = None  # type: Optional[CdmAttributeContextType]


        # --- internal ---
        # This will get overwritten when parent set.
        self._at_corpus_path = name  # type: str

        self._lowest_order = None  # type: Optional[int]

        self._TAG = CdmAttributeContext.__name__

    @property
    def at_corpus_path(self) -> Optional[str]:
        return self._at_corpus_path

    @at_corpus_path.setter
    def at_corpus_path(self, value):
        self._at_corpus_path = value

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.ATTRIBUTE_CONTEXT_DEF

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext'] = None) -> 'ResolvedAttributeSetBuilder':
        return None

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        return None

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmAttributeContext'] = None) -> 'CdmAttributeContext':
        if not res_opt:
            ResolveOptions(wrt_doc=self, directives=self.ctx.corpus.default_resolution_directives)

        if not host:
            copy = self.copy_node(res_opt)
        else:
            copy = host
            copy.ctx = self.ctx
            copy.name = self.get_name()
            copy.contents.clear()

        if self.parent:
            copy.parent = cast('CdmObjectReference', self.parent.copy(res_opt))

        if self.contents:
            for child in self.contents:
                copy.contents.append(cast('Union[CdmAttributeContext, CdmObjectReference]', child.copy(res_opt)))

        return copy

    def _copy_attribute_context_tree(self, res_opt: 'ResolveOptions', new_node: 'CdmAttributeContext', ras: 'ResolvedAttributeSet',
                                     att_ctx_set: List['CdmAttributeContext'] = None, moniker: Optional[str] = None) -> 'CdmAttributeContext':
        ra = ras.attctx_to_rattr.get(self)
        if ra:
            ras._cache_attribute_context(new_node, ra)

        # add context to set.
        if att_ctx_set is not None:
            att_ctx_set.append(new_node)

        # add moniker if this is a reference
        if moniker and new_node.definition and new_node.definition.named_reference:
            new_node.definition.named_reference = moniker + '/' + new_node.definition.named_reference

        # now copy the children.
        if self.contents:
            for child in self.contents:
                if isinstance(child, CdmAttributeContext):
                    new_child = cast('CdmAttributeContext', cast('CdmAttributeContext', child).copy_node(res_opt))
                    if new_node:
                        new_child._update_parent(res_opt, new_node)

                    current_ras = ras
                    if ra and isinstance(ra.target, ResolvedAttributeSet):
                        current_ras = ra.target
                    cast('CdmAttributeContext', child)._copy_attribute_context_tree(res_opt, new_child, current_ras, att_ctx_set, moniker)

        return new_node

    def copy_node(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmObject':
        """returns a copy of the current node."""
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        copy = CdmAttributeContext(self.ctx, self.name)
        copy.type = self.type
        copy.in_document = res_opt.wrt_doc  # CdmDocumentDefinition

        if self.definition:
            copy.definition = self.definition.copy(res_opt)

        copy.contents = CdmCollection(self.ctx, copy, CdmObjectType.ATTRIBUTE_REF)

        self._copy_def(res_opt, copy)

        return copy

    @staticmethod
    def _create_child_under(res_opt: 'ResolveOptions', acp: 'AttributeContextParameters') -> 'CdmAttributeContext':
        if not acp:
            return None

        if acp._type == CdmAttributeContextType.PASS_THROUGH:
            return acp._under

        # This flag makes sure we hold on to any resolved object refs when things get copied.
        res_opt_copy = res_opt.copy()
        res_opt_copy._save_resolutions_on_copy = True

        definition = None  # type: CdmObjectReference
        rts_applied = None  # type: ResolvedTraitSet

        # Get a simple reference to definition object to avoid getting the traits that might be part of this ref
        # included in the link to the definition.
        if acp._regarding:
            definition = acp._regarding.create_simple_reference(res_opt_copy)
            definition.in_document = acp._under.in_document  # ref is in same doc as context
            # Now get the traits applied at this reference (applied only, not the ones that are part of the definition
            # of the object) and make them the traits for this context.
            if acp._include_traits:
                rts_applied = acp._regarding._fetch_resolved_traits(res_opt_copy)

        under_child = acp._under.ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_CONTEXT_DEF, acp._name)  # type: CdmAttributeContext
        # Need context to make this a 'live' object.
        under_child.ctx = acp._under.ctx
        under_child.in_document = acp._under.in_document
        under_child.type = acp._type
        under_child.definition = definition
        # Add traits if there are any.
        if rts_applied and rts_applied.rt_set:
            for rt in rts_applied.rt_set:
                trait_ref = CdmObject._resolved_trait_to_trait_ref(res_opt_copy, rt)
                under_child.exhibits_traits.append(trait_ref, isinstance(trait_ref, str))

        # Add to parent.
        under_child._update_parent(res_opt_copy, acp._under)

        return under_child

    def get_name(self) -> str:
        return self.name

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:  # pylint: disable=unused-argument
        return False

    def _update_parent(self, res_opt: 'ResolveOptions', parent: 'CdmAttributeContext') -> None:
        # Will need a working reference to this as the parent.
        parent_ref = self.ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_CONTEXT_REF, parent.at_corpus_path, True)  # type: CdmObjectReference
        if self.name:
            self.at_corpus_path = parent.at_corpus_path + '/' + self.name
        parent_ref.explicit_reference = parent
        # Setting this will let the 'localize references' code trace from any document back to where the parent is defined.
        parent_ref.in_document = parent.in_document
        parent.contents.append(self)
        self.parent = parent_ref

    def validate(self) -> bool:
        missing_fields = []
        if not bool(self.name):
            missing_fields.append('name')
        if not bool(self.type):
            missing_fields.append('type')

        if missing_fields:
            logger.error(self._TAG, self.ctx, Errors.validate_error_string(self.at_corpus_path, missing_fields))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.ctx.corpus._block_declared_path_changes is False:
            path = self._declared_path
            if not path:
                path = path_from + self.name
                self._declared_path = path

        if pre_children and pre_children(self, path):
            return False

        if self.parent and self.parent.visit('{}/parent/'.format(path), pre_children, post_children):
            return True

        if self.definition and self.definition.visit('{}/definition/'.format(path), pre_children, post_children):
            return True

        if self.contents and CdmObject._visit_array(self.contents, '{}/'.format(path), pre_children, post_children):
            return True

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False
