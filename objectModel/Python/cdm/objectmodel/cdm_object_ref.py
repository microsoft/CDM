# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from abc import abstractmethod

from typing import cast, Optional, Union, TYPE_CHECKING

from cdm.enums import CdmAttributeContextType, CdmObjectType
from cdm.utilities import logger, ResolveOptions
from cdm.enums import CdmLogCode

from .cdm_object import CdmObject
from .cdm_trait_collection import CdmTraitCollection

if TYPE_CHECKING:
    from cdm.objectmodel import CdmCorpusContext, CdmObjectDefinition
    from cdm.resolvedmodel import ResolvedTraitSet
    from cdm.utilities import ResolveOptions


RES_ATT_TOKEN = '/(resolvedAttributes)/'


class CdmObjectReference(CdmObject):
    def __init__(self, ctx: 'CdmCorpusContext', reference_to: Union[str, 'CdmObjectDefinition'], simple_named_reference: bool) -> None:
        super().__init__(ctx)

        self.explicit_reference = None  # type: Optional[CdmObjectDefinition]
        self.named_reference = None  # type: Optional[str]
        self.optional = None  # type: Optional[bool]
        """
        Gets or sets the object's Optional property. This indicates the SDK to not error out 
        in case the definition could not be resolved.
        """

        if reference_to:
            if isinstance(reference_to, str):
                self.named_reference = reference_to
            else:
                self.explicit_reference = cast('CdmObjectDefinition', reference_to)

        self.simple_named_reference = simple_named_reference

        # --- internal ---
        self._applied_traits = CdmTraitCollection(ctx, self)
        self._declared_path = None

        # A portable explicit reference used to manipulate nodes in the attribute context.
        # For more information, refer to the `create_portable_reference` method in CdmObjectDef and CdmObjectRef.
        self._portable_reference = None  # type: Optional[CdmObjectDefinition]
        self._TAG = CdmObjectReference.__name__

    @property
    def applied_traits(self) -> 'CdmTraitCollection':
        return self._applied_traits

    @property
    def explicit_reference(self) -> Optional['CdmObjectDefinition']:
        return self._explicit_reference

    @explicit_reference.setter
    def explicit_reference(self, explicit_reference: Optional['CdmObjectDefinition']):
        if explicit_reference:
            explicit_reference.owner = self
        self._explicit_reference = explicit_reference

    @staticmethod
    def _offset_attribute_promise(ref: Optional[str] = None) -> int:
        return ref.find(RES_ATT_TOKEN) if ref else -1

    def _copy_to_host(self, ctx: 'CdmCorpusContext', ref_to: Union[str, 'CdmObjectDefinition'], simple_reference: bool) -> 'CdmObjectReference':
        self.ctx = ctx
        self.explicit_reference = None
        self.named_reference = None

        if ref_to:
            if isinstance(ref_to, 'CdmObject'):
                self.explicit_reference = ref_to  # CdmObjectDefinition
            else:
                self.named_reference = ref_to
        self.simple_named_reference = simple_reference

        self.applied_traits.clear()

        return self

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        # find and cache the complete set of attributes
        from cdm.resolvedmodel import ResolvedAttributeSetBuilder
        from cdm.utilities import AttributeContextParameters
        from cdm.objectmodel import CdmEntityDefinition

        rasb = ResolvedAttributeSetBuilder()
        rasb._resolved_attribute_set.attribute_context = under
        definition = self.fetch_object_definition(res_opt)
        if definition:
            acp_ref = None
            if under:
                # ask for a 'pass through' context, that is, no new context at this level
                acp_ref = AttributeContextParameters(under=under, type=CdmAttributeContextType.PASS_THROUGH)
            res_atts = definition._fetch_resolved_attributes(res_opt, acp_ref)
            if res_atts and res_atts._set:
                # res_atts = res_atts.copy()  should not need this copy now that we copy from the cache. lets try!
                rasb.merge_attributes(res_atts)
                rasb.remove_requested_atts()
        else:
            logger.warning(self.ctx, self._TAG, CdmObjectReference._construct_resolved_traits.__name__,
                           self.at_corpus_path, CdmLogCode.WARN_RESOLVE_OBJECT_FAILED,
                           self.fetch_object_definition_name())

        return rasb

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        obj_def = self.fetch_object_definition(res_opt)

        if obj_def:
            rts_inh = obj_def._fetch_resolved_traits(res_opt)
            if rts_inh:
                rts_inh = rts_inh.deep_copy()
            rtsb.take_reference(rts_inh)
        elif not self.optional:
            logger.warning(self.ctx, self._TAG, CdmObjectReference._construct_resolved_traits.__name__,
                           self.at_corpus_path, CdmLogCode.WARN_RESOLVE_OBJECT_FAILED,
                           self.fetch_object_definition_name())

        if self.applied_traits:
            for trait in self.applied_traits:
                rtsb.merge_traits(trait._fetch_resolved_traits(res_opt))

    def _fetch_resolved_reference(self, res_opt: 'ResolveOptions') -> 'CdmObject':
        res_opt = res_opt if res_opt is not None else ResolveOptions(self, self.ctx.corpus.default_resolution_directives)
        if self.explicit_reference:
            return self.explicit_reference

        if not self.ctx:
            return None

        res = None

        # if this is a special request for a resolved attribute, look that up now
        seek_res_att = CdmObjectReference._offset_attribute_promise(self.named_reference)
        if seek_res_att >= 0:
            ent_name = self.named_reference[:seek_res_att]
            att_name = self.named_reference[seek_res_att + len(RES_ATT_TOKEN):]
            # get the entity
            ent = self.ctx.corpus._resolve_symbol_reference(res_opt, self.in_document, ent_name, CdmObjectType.ENTITY_DEF, True)

            if not ent:
                logger.warning(self.ctx, self._TAG, CdmObjectReference._fetch_resolved_reference.__name__, self.at_corpus_path,
                               CdmLogCode.WARN_RESOLVE_ENTITY_FAILED ,ent_name, self.named_reference)
                return None

            # get the resolved attribute
            ras = ent._fetch_resolved_attributes(res_opt)
            ra = None
            if ras is not None:
                ra = ras.get(att_name)
            if ra:
                res = ra.target
            else:
                logger.warning(self.ctx, self._TAG, CdmObjectReference._fetch_resolved_reference.__name__,
                               self.at_corpus_path, CdmLogCode.WARN_RESOLVE_ATTR_FAILED, self.named_reference)
        else:
            # normal symbolic reference, look up from the corpus, it knows where everything is
            res = self.ctx.corpus._resolve_symbol_reference(res_opt, self.in_document, self.named_reference, self.object_type, True)

        return res

    def create_simple_reference(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmObjectReference':
        if not res_opt:
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)
        if self.named_reference:
            return self._copy_ref_object(res_opt, self.named_reference, True)
        new_declared_path = self._declared_path[0: len(self._declared_path) -
                                                6] if self._declared_path is not None and self._declared_path.endswith('/(ref)') else self._declared_path
        return self._copy_ref_object(res_opt, new_declared_path, True)

    def _create_portable_reference(self, res_opt: 'ResolveOptions') -> Optional['CdmObjectReference']:
        """
        Creates a 'portable' reference object to this object. portable means there is no symbolic name set
        until this reference is placed into some final document.
        """
        from .cdm_corpus_def import CdmCorpusDefinition
        cdm_object_def = self.fetch_object_definition(res_opt)

        if not cdm_object_def or not self.in_document:
            return None  # not allowed

        cdm_object_ref = self.ctx.corpus.make_object(
            CdmCorpusDefinition._map_reference_type(self.object_type), 'portable', True)  # type: CdmObjectReference
        cdm_object_ref._portable_reference = cdm_object_def
        cdm_object_ref.optional = self.optional
        cdm_object_ref.in_document = self.in_document  # if the object has no document, take from the reference
        cdm_object_ref.owner = self.owner

        return cdm_object_ref

    def _localize_portable_reference(self, import_path: str) -> None:
        """
        Creates a 'portable' reference object to this object. portable means there is no symbolic name set
        until this reference is placed into some final document.
        """
        new_declared_path = self._portable_reference._declared_path
        new_declared_path = new_declared_path[0: (len(new_declared_path) - 6)] \
            if new_declared_path and new_declared_path.endswith('/(ref)') else new_declared_path
        self.named_reference = '{}{}'.format(import_path, new_declared_path)

    def copy(self, res_opt: Optional['ResolveOptions'] = None, host: Optional['CdmObjectReference'] = None) -> 'CdmObjectReference':
        if not res_opt:
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)

        copy = self._copy_ref_object(res_opt, self.named_reference if self.named_reference else self.explicit_reference, self.simple_named_reference, host)

        copy.optional = self.optional
        copy._portable_reference = self._portable_reference

        if res_opt._save_resolutions_on_copy:
            explicit_reference = self.explicit_reference.copy() if self.explicit_reference else None
            copy.explicit_reference = explicit_reference

        copy.applied_traits.clear()
        if self.applied_traits:
            for trait in self.applied_traits:
                copy.applied_traits.append(trait.copy(res_opt))

        # Don't do anything else after this, as it may cause InDocument to become dirty
        copy.in_document = self.in_document

        return copy

    @abstractmethod
    def _copy_ref_object(self, res_opt: 'ResolveOptions', ref_to: Union[str, 'CdmObjectDefinition'], simple_reference: bool, host: Optional['CdmObjectReference'] = None) -> 'CdmObjectReference':
        raise NotImplementedError()

    def fetch_object_definition_name(self) -> Optional[str]:
        if self.named_reference:
            path_end = self.named_reference.rfind('/')
            if path_end == -1 or path_end + 1 == len(self.named_reference):
                return self.named_reference
            return self.named_reference[path_end+1:]
        if self.explicit_reference:
            return self.explicit_reference.get_name()
        return None

    def fetch_object_definition(self, res_opt: Optional['ResolveOptions'] = None) -> 'CdmObjectDefinition':
        if res_opt is None:
            res_opt = ResolveOptions(self, self.ctx.corpus.default_resolution_directives)
        definition = self._fetch_resolved_reference(res_opt)
        if definition is not None and isinstance(definition, CdmObjectReference):
            definition = definition.fetch_resolved_reference()
        if definition is not None and not isinstance(definition, CdmObjectReference):
            return definition
        return None

    def is_derived_from(self, base: str, res_opt: Optional['ResolveOptions'] = None) -> bool:
        definition = self.fetch_object_definition(res_opt)  # type: CdmObjectDefinition
        if definition:
            return definition.is_derived_from(base, res_opt)
        return False

    def validate(self) -> bool:
        if not bool(self.named_reference or self.explicit_reference):
            missing_fields = ['named_reference', 'explicit_reference']
            logger.error(self.ctx, self._TAG, 'validate', self.at_corpus_path, CdmLogCode.ERR_VALDN_INTEGRITY_CHECK_FAILURE, self.at_corpus_path, ', '.join(map(lambda s: '\'' + s + '\'', missing_fields)))
            return False
        return True

    def visit(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        path = ''
        if self.named_reference:
            path = path_from + self.named_reference
        else:
            # when an object is defined inline inside a reference, we need a path to the reference
            # AND a path to the inline object. The 'correct' way to do this is to name the reference (inline) and the
            # defined object objectName so you get a path like extendsEntity/(inline)/MyBaseEntity. that way extendsEntity/(inline)
            # gets you the reference where there might be traits, etc. and extendsEntity/(inline)/MyBaseEntity gets the
            # entity defintion. HOWEVER! there are situations where (inline) would be ambiguous since there can be more than one
            # object at the same level, like anywhere there is a collection of references or the collection of attributes.
            # so we will flip it (also preserves back compat) and make the reference extendsEntity/MyBaseEntity/(inline) so that
            # extendsEntity/MyBaseEntity gives the reference (like before) and then extendsEntity/MyBaseEntity/(inline) would give
            # the inline defined object.
            # ALSO, ALSO!!! since the ability to use a path to request an object (through) a reference is super useful, lets extend
            # the notion and use the word (object) in the path to mean 'drill from reference to def' This would work then on
            # ANY reference, not just inline ones
            if self.explicit_reference:
                # ref path is name of defined object
                path = self.explicit_reference._fetch_declared_path(path_from)
            else:
                path = path_from
        ref_path = path + '/(ref)'

        if pre_children and pre_children(self, ref_path):
            return False

        if self.explicit_reference and not self.named_reference and self.explicit_reference.visit(path_from, pre_children, post_children):
            return True

        if self._visit_ref(path, pre_children, post_children):
            return True

        if self.applied_traits and self._applied_traits._visit_array('{}/appliedTraits/'.format(ref_path), pre_children, post_children):
            return True

        if post_children and post_children(self, ref_path):
            return True

        return False

    @abstractmethod
    def _visit_ref(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        raise NotImplementedError()
