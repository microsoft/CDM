# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import cast, List, Optional, Union, TYPE_CHECKING
from collections import OrderedDict

from cdm.enums import CdmLogCode
from cdm.utilities.string_utils import StringUtils

from cdm.enums import CdmAttributeContextType, CdmObjectType
from cdm.resolvedmodel import ResolvedAttributeSet
from cdm.utilities import ResolveOptions, logger

from .cdm_collection import CdmCollection
from .cdm_object import CdmObject
from .cdm_object_def import CdmObjectDefinition
from .cdm_attribute_context_ref import CdmAttributeContextReference
from .cdm_document_def import CdmDocumentDefinition

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmObject, CdmObjectReference
    from cdm.resolvedmodel import ResolvedAttributeSetBuilder, ResolvedTraitSet, ResolvedTraitSetBuilder
    from cdm.utilities import AttributeContextParameters, VisitCallback


class CdmAttributeContext(CdmObjectDefinition):
    def __init__(self, ctx: 'CdmCorpusContext', name: str) -> None:
        super().__init__(ctx)

        self._TAG = CdmAttributeContext.__name__

        # the attribute context content list.
        self.contents = CdmCollection(
            self.ctx, self, CdmObjectType.ATTRIBUTE_CONTEXT_REF)  # type: CdmCollection[Union[CdmObjectReference, CdmAttributeContext]]

        # a reference to the object from which this attribute context was defined.
        self.definition = None  # type: CdmObjectReference

        # the attribute context name.
        self.name = name  # type: str

        # the attribute context parent.
        self.parent = None  # type: Optional[CdmObjectReference]

        # the attribute context type.
        self.type = None  # type: Optional[CdmAttributeContextType]

        # the attribute context parent.
        self.lineage = None  # type: Optional[CdmCollection[CdmAttributeContextReference]]

        # --- internal ---
        # For attribute context we don't follow standard path calculation behavior
        # This will get overwritten when parent set.
        self._at_corpus_path = name  # type: str

        self._lowest_order = None  # type: Optional[int]

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

        if self.lineage:
            # trying to not allocate lineage collection unless needed
            for child in self.lineage:
                copy._add_lineage(child.explicit_reference.copy(res_opt))

        return copy

    def _copy_attribute_context_tree(self, res_opt: 'ResolveOptions', new_node: 'CdmAttributeContext') -> 'CdmAttributeContext':
        # remember which node in the new tree replaces which node in the old tree
        # the caller MUST use this to replace the explicit references held in the lineage and parent reference objects
        # and to change the context node that any associated resolved attributes will be pointing at
        res_opt._map_old_ctx_to_new_ctx[self] = new_node  # so we can see the replacement for a copied node

        # now copy the children.
        if self.contents:
            for child in self.contents:
                if isinstance(child, CdmAttributeContext):
                    new_child = cast('CdmAttributeContext', cast('CdmAttributeContext', child).copy_node(res_opt))
                    if new_node:
                        super(CdmCollection, new_node.contents).append(new_child)  # need to NOT trigger the collection fix up and parent code
                        cast('CdmAttributeContext', child)._copy_attribute_context_tree(res_opt, new_child)

        return new_node

    def copy_node(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmObject':
        """returns a copy of the current node."""
        res_opt = res_opt if res_opt is not None else ResolveOptions(wrt_doc=self)

        # instead of copying the entire context tree, just the current node
        copy = CdmAttributeContext(self.ctx, self.name)
        copy.type = self.type
        copy.in_document = res_opt.wrt_doc  # CdmDocumentDefinition

        if self.parent:
            copy.parent = CdmAttributeContextReference(self.ctx, None)
            copy.parent.explicit_reference = self.parent.explicit_reference  # yes, just take the old pointer, will fix all later

        if self.definition:
            copy.definition = self.definition.copy(res_opt)
            copy.definition.owner = self.definition.owner

        # make space for content, but no copy, done by caller
        copy.contents = CdmCollection(self.ctx, copy, CdmObjectType.ATTRIBUTE_REF)

        if self.lineage:
            for lin in self.lineage:
                copy._add_lineage(lin.explicit_reference, False)  # use explicitref to cause new ref to be allocated
        self._copy_def(res_opt, copy)

        if res_opt._map_old_ctx_to_new_ctx is not None:
            res_opt._map_old_ctx_to_new_ctx[copy] = copy  # so we can find every node, not only the replaced ones

        return copy

    def _set_lineage(self, obj_lineage: 'CdmObject') -> 'CdmAttributeContextReference':
        """clears any existing lineage and sets it to the provided context reference (or a reference to the context object is one is given instead)"""
        self.lineage = CdmCollection(self.ctx, self, CdmObjectType.ATTRIBUTE_CONTEXT_REF)
        return self._add_lineage(obj_lineage)

    def _add_lineage(self, obj_lineage: 'CdmObject', validate: Optional[bool] = True) -> Union['CdmAttributeContextReference', None]:
        """add to the lineage array the provided context reference (or a reference to the context object is one is given instead)"""
        # sort out which is the ref and which is the object.
        # attCtxRef object are special in that they don't support an inline definition but they do hold a pointer to the
        # actual context object in the explicit reference member
        if obj_lineage.object_type == CdmObjectType.ATTRIBUTE_CONTEXT_REF:
            ref_lineage = obj_lineage
            obj_lineage = ref_lineage.explicit_reference
        elif obj_lineage.object_type == CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
            acLin = obj_lineage
            ref_lineage = self.ctx.corpus.make_object(CdmObjectType.ATTRIBUTE_CONTEXT_REF, acLin.at_corpus_path, True)
            ref_lineage.explicit_reference = acLin
        else:
            # programming error
            return None
        if self.lineage is None:
            # not allocated by default
            self.lineage = CdmCollection(self.ctx, self, CdmObjectType.ATTRIBUTE_CONTEXT_REF)  # type: CdmCollection[CdmAttributeContextReference]
        if ref_lineage.explicit_reference.id == self.id:
            # why do that?
            return None
        self.lineage.append(ref_lineage)

        # debugging. get the parent of the context tree and validate that this node is in that tree (Ported from C# written by Jeff)
        # if (validate == true)
        # {
        #     CdmAttributeContext trace = refLineage.ExplicitReference as CdmAttributeContext;
        #     while (trace.Parent != null)
        #         trace = trace.Parent.ExplicitReference as CdmAttributeContext;
        #     trace.ValidateLineage(null);
        # }

        return ref_lineage

    @staticmethod
    def prepare_options_for_resolve_attributes(res_opt_source: ResolveOptions) -> ResolveOptions:
        res_opt_copy = res_opt_source.copy()
        # use this whenever we need to keep references pointing at things that were already found. used when 'fixing' references by localizing to a new document
        res_opt_copy._save_resolutions_on_copy = True
        # for debugging help (Ported from C# written by Jeff)
        # if (resOptCopy.MapOldCtxToNewCtx != null)
        # {
        #     return null;
        # }
        res_opt_copy._map_old_ctx_to_new_ctx = OrderedDict()  # Type: Dict['CdmAttributeContext', 'CdmAttributeContext']
        return res_opt_copy

    @staticmethod
    def _get_under_context_for_cache_context(res_opt: ResolveOptions, ctx: 'CdmCorpusContext', acp_used: 'AttributeContextParameters') -> 'CdmAttributeContext':
        # a new context node is needed for these attributes, 
        # this tree will go into the cache, so we hang it off a placeholder parent
        # when it is used from the cache (or now), then this placeholder parent is ignored and the things under it are
        # put into the 'receiving' tree
        if acp_used is not None:
            acp_cache = acp_used.copy()
            parent_ctx_for_cache = CdmAttributeContext(ctx, "cacheHolder")
            parent_ctx_for_cache.type = CdmAttributeContextType.PASS_THROUGH
            acp_cache._under = parent_ctx_for_cache
            return CdmAttributeContext._create_child_under(res_opt, acp_cache)

        return None

    def _get_under_context_from_cache_context(self, res_opt: ResolveOptions, acp_used: 'AttributeContextParameters') -> 'CdmAttributeContext':
        # tree is found in cache, need a replacement tree node to put the sub-tree into. this replacement
        # needs to be build from the acp of the destination tree
        if acp_used is not None:
            return CdmAttributeContext._create_child_under(res_opt, acp_used)

        return None

    def associate_tree_copy_with_attributes(self, res_opt: ResolveOptions, ras: ResolvedAttributeSet) -> bool:
        # deep copy the tree. while doing this also collect a map from old attCtx to new equivalent
        # this is where the returned tree fits in
        cached_ctx = ras.attribute_context
        if cached_ctx._copy_attribute_context_tree(res_opt, self) is None:
            return False
        ras.attribute_context = self

        # run over the resolved attributes in the copy and use the map to swap the old ctx for the new version
        def _fix_resolve_attribute_ctx(ras_sub: ResolvedAttributeSet) -> None:
            for ra in ras_sub._set:
                ra.att_ctx = res_opt._map_old_ctx_to_new_ctx[ra.att_ctx]
                # the target for a resolved att can be a typeAttribute OR it can be another resolvedAttributeSet (meaning a group)
                if isinstance(ra.target, ResolvedAttributeSet):
                    cast(ResolvedAttributeSet, ra.target).attribute_context = ra.att_ctx
                    _fix_resolve_attribute_ctx(cast(ResolvedAttributeSet, ra.target))

        _fix_resolve_attribute_ctx(ras)

        # now fix any lineage references
        def _fix_att_ctx_node_lineage(ac: CdmAttributeContext, ac_parent: Optional[CdmAttributeContext] = None) -> None:
            if ac is None:
                return
            if ac_parent and ac.parent and ac.parent.explicit_reference:
                ac.parent.explicit_reference = ac_parent
            if ac.lineage and len(ac.lineage) > 0:
                # fix lineage
                for lin in ac.lineage:
                    if lin.explicit_reference:
                        # swap the actual object for the one in the new tree
                        lin.explicit_reference = res_opt._map_old_ctx_to_new_ctx[cast(CdmAttributeContext, lin.explicit_reference)]

            if not ac.contents:
                return
            # look at all children
            for sub_sub in ac.contents:
                _fix_att_ctx_node_lineage(sub_sub, ac)

        _fix_att_ctx_node_lineage(self, None)

        return True

    def _finalize_attribute_context(self, res_opt: ResolveOptions, path_start: str, doc_home: CdmDocumentDefinition,
                                    doc_from: CdmDocumentDefinition, moniker_for_doc_from: str, finished: bool):
        # run over the attCtx tree again and 'fix it' fix means replace the parent and lineage reference path strings with
        # final values from new home and set the inDocument and fix any references to definitions

        # keep track of the paths to documents for fixing symbol refs. expensive to compute
        found_doc_paths = OrderedDict()

        if moniker_for_doc_from and not moniker_for_doc_from.isspace():
            moniker_for_doc_from = '{}/'.format(moniker_for_doc_from)

        # first step makes sure every node in the tree has a good path for itself and a good document
        # second pass uses the paths from nodes to fix references to other nodes
        def _fix_att_ctx_node_paths(sub_item: CdmObject, path_from: str) -> None:
            ac = cast(CdmAttributeContext, sub_item)
            if ac is None:
                return
            ac.in_document = doc_home

            # fix up the reference to definition. need to get path from this document to the
            # add moniker if this is a reference
            if ac.definition:
                ac.definition.in_document = doc_home

                if ac.definition and ac.definition.named_reference:
                    # need the real path to this thing from the explicitRef held in the portable reference
                    # the real path is {monikerFrom/}{path from 'from' document to document holding the explicit ref/{declaredPath of explicitRef}}
                    # if we have never looked up the path between docs, do that now
                    doc_from_def = ac.definition.explicit_reference.in_document  # if all parts not set, this is a broken portal ref!
                    path_between_docs = found_doc_paths[doc_from_def] if doc_from_def in found_doc_paths else None
                    if path_between_docs is None:
                        path_between_docs = doc_from._import_path_to_doc(doc_from_def)
                        if path_between_docs is None:
                            # hmm. hmm.
                            path_between_docs = ''
                        found_doc_paths[doc_from] = path_between_docs

                    cast('CdmObjectReference', ac.definition)._localize_portable_reference(res_opt, '{}{}'.format(moniker_for_doc_from, path_between_docs))

            # doc of parent ref
            if ac.parent:
                ac.parent.in_document = doc_home
            # doc of lineage refs
            if ac.lineage:
                for lin in ac.lineage:
                    lin.in_document = doc_home

            divider = '/' if not ac.at_corpus_path or not path_from.endswith('/') else ''
            ac.at_corpus_path = '{}{}{}'.format(path_from, divider, ac.name)

            if not ac.contents:
                return

            # look at all children
            for sub_sub in ac.contents:
                if sub_sub.object_type == CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
                    _fix_att_ctx_node_paths(sub_sub, ac.at_corpus_path)

        _fix_att_ctx_node_paths(self, path_start)

        # now fix any lineage and parent references
        def _fix_att_ctx_node_lineage(sub_item) -> None:
            ac = cast(CdmAttributeContext, sub_item)  # type: CdmAttributeContext
            if not ac:
                return
            # for debugLindeage, write id
            # ac.name = '{}({})'.format(ac.name, ac.id)

            # parent ref
            if ac.parent and ac.parent.explicit_reference:
                ac.parent.named_reference = cast(CdmAttributeContext, ac.parent.explicit_reference).at_corpus_path
                # for debugLindeage, write id
                # ac.parent.named_reference = cast(CdmAttributeContext, ac.parent.explicit_reference).at_corpus_path + '(' + ac.parent.explicit_reference.id + ')'

            # fix lineage
            if ac.lineage:
                for lin in ac.lineage:
                    if lin.explicit_reference:
                        # use the new path as the ref
                        lin.named_reference = cast(CdmAttributeContext, lin.explicit_reference).at_corpus_path
                        # for debugLindeage, write id
                        # lin.named_reference = cast(CdmAttributeContext, lin.explicit_reference).at_corpus_path + '(' + lin.explicit_reference.id + ')'

            if not ac.contents:
                return
            # look at all children
            for sub_sub in ac.contents:
                _fix_att_ctx_node_lineage(sub_sub)

        _fix_att_ctx_node_lineage(self)

        if finished:
            res_opt._save_resolutions_on_copy = False
            res_opt._map_old_ctx_to_new_ctx = None

        return True

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
            # make a portable reference. this MUST be fixed up when the context node lands in the final document
            definition = cast(CdmObject, acp._regarding)._create_portable_reference(res_opt_copy)
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

        if res_opt_copy._map_old_ctx_to_new_ctx is not None:
            res_opt_copy._map_old_ctx_to_new_ctx[under_child] = under_child  # so we can find every node, not only the replaced ones

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
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
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

        if self.lineage is not None and CdmObject._visit_array(self.lineage, '{}/lineage/'.format(path), pre_children, post_children):
            return True

        if self._visit_def(path, pre_children, post_children):
            return True

        if post_children and post_children(self, path):
            return True

        return False

    def _validate_lineage(self, res_opt: ResolveOptions) -> bool:
        # run over the attCtx tree and validate that it is self consistent on lineage
        # collect all nodes in the tree
        att_ctx_in_tree = set()
        def _collect_all_nodes(sub_item: 'CdmObject') -> None:
            ac = cast(CdmAttributeContext, sub_item)
            if not ac:
                return
            att_ctx_in_tree.add(ac)
            if not ac.contents:
                return
            # look at all children
            for sub_sub in ac.contents:
                if sub_sub.object_type == CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
                    _collect_all_nodes(sub_sub)

        _collect_all_nodes(self)

        # now make sure every lineage ref is in that set
        def _check_lineage(sub_item: 'CdmObject') -> None:
            ac = cast(CdmAttributeContext, sub_item)
            if not ac:
                return
            if ac.lineage:
                for lin in ac.lineage:
                    if not cast(CdmAttributeContext, lin.explicit_reference) in att_ctx_in_tree:
                        return False
                    # if not cast(CdmAttributeContext, lin.explicit_reference) in res_opt._map_old_ctx_to_new_ctx:
                    #     return False

            if not ac.contents:
                return True
            # look at all children
            for sub_sub in ac.contents:
                if sub_sub.object_type == CdmObjectType.ATTRIBUTE_CONTEXT_DEF:
                    if _check_lineage(sub_sub) is False:
                        return False

            return True

        _check_lineage(self)

        return True


    

