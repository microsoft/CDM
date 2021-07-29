# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Any, Dict, Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_argument_collection import CdmArgumentCollection
from .cdm_argument_def import CdmArgumentDefinition
from .cdm_object_ref import CdmObjectReference
from cdm.objectmodel import CdmTraitReferenceBase

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmCorpusContext, CdmTraitDefinition
    from cdm.utilities import ResolveOptions, VisitCallback


class CdmTraitReference(CdmTraitReferenceBase):
    def __init__(self, ctx: 'CdmCorpusContext', trait: Union[str, 'CdmTraitDefinition'], simple_reference: bool) -> None:
        super().__init__(ctx, trait, simple_reference)

        # true if the trait was generated from a property and false it was directly loaded.
        self.is_from_property = False

        # Internal
        self._resolved_arguments = False
        self._arguments = CdmArgumentCollection(self.ctx, self)
        self._resolved_arguments = None

    # the trait reference argument.
    @property
    def arguments(self) -> 'CdmArgumentCollection':
        return self._arguments

    @property
    def object_type(self) -> 'CdmObjectType':
        return CdmObjectType.TRAIT_REF

    def _construct_resolved_attributes(self, res_opt: 'ResolveOptions', under: Optional['CdmAttributeContext']) -> 'ResolvedAttributeSetBuilder':
        return None

    def _construct_resolved_traits(self, rtsb: 'ResolvedTraitSetBuilder', res_opt: 'ResolveOptions') -> None:
        # traits don't have traits.
        pass

    def _copy_ref_object(self, res_opt: 'ResolveOptions', ref_to: Union[str, 'CdmTraitDefinition'], simple_reference: bool, host: Optional['CdmObjectReference'] = None) -> 'CdmObjectReference':
        if not host:
            copy = CdmTraitReference(self.ctx, ref_to, bool(self.arguments))
        else:
            copy = host._copy_to_host(self.ctx, ref_to, simple_reference)
            copy.arguments.clear()

        if not simple_reference:
            copy._resolved_arguments = self._resolved_arguments

        for arg in self.arguments:
            copy.arguments.append(arg.copy(res_opt))

        return copy

    def _visit_ref(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        result = False
        if self.arguments is not None and len(self.arguments) > 0:
            # custom enumeration of args to force a path onto these things that just might not have a name
            lItem = len(self.arguments)
            for iItem in range(lItem):
                element = self.arguments[iItem]
                if element:
                    argPath = path_from + '/arguments/a' + str(iItem)
                    if element.visit(argPath, pre_children, post_children):
                        result = True
                        break
        return result

    def fetch_argument_value(self, name: str) -> 'CdmArgumentValue':
        if not self.arguments:
            return None

        for arg in self.arguments:
            arg_name = arg.get_name()
            if arg_name == name:
                return arg.value

            # special case with only one argument and no name give, make a big assumption that this is the one they want
            # right way is to look up parameter def and check name, but this interface is for working on an unresolved def
            if not arg_name and len(self.arguments) == 1:
                return arg.value

    def _fetch_resolved_traits(self, res_opt: Optional['ResolveOptions'] = None) -> 'ResolvedTraitSet':
        from cdm.utilities import SymbolSet
        from .cdm_corpus_def import CdmCorpusDefinition

        res_opt = res_opt if res_opt is not None else ResolveOptions(self, self.ctx.corpus.default_resolution_directives)
        kind = 'rtsb'
        ctx = self.ctx
        # get referenced trait
        trait = self.fetch_object_definition(res_opt)
        rts_trait = None
        if not trait:
            return ctx.corpus._fetch_empty_resolved_trait_set(res_opt)

        # see if one is already cached
        # cache by name unless there are parameter
        if trait._this_is_known_to_have_parameters is None:
            # never been resolved, it will happen soon, so why not now?
            rts_trait = trait._fetch_resolved_traits(res_opt)

        cache_by_path = True
        if trait._this_is_known_to_have_parameters is not None:
            cache_by_path = not trait._this_is_known_to_have_parameters

        cache_tag = ctx.corpus._create_definition_cache_tag(res_opt, self, kind, '', cache_by_path, trait.at_corpus_path)
        rts_result = ctx._cache.get(cache_tag) if cache_tag else None

        # store the previous reference symbol set, we will need to add it with
        # children found from the _construct_resolved_traits call
        curr_sym_ref_set = res_opt._symbol_ref_set or SymbolSet()
        res_opt._symbol_ref_set = SymbolSet()

        # if not, then make one and save it
        if not rts_result:
            # get the set of resolutions, should just be this one trait
            if not rts_trait:
                # store current doc ref set
                new_doc_ref_set = res_opt._symbol_ref_set
                res_opt._symbol_ref_set = SymbolSet()

                rts_trait = trait._fetch_resolved_traits(res_opt)

                # bubble up symbol reference set from children
                if new_doc_ref_set:
                    new_doc_ref_set._merge(res_opt._symbol_ref_set)

                res_opt._symbol_ref_set = new_doc_ref_set
            if rts_trait:
                rts_result = rts_trait.deep_copy()

            # now if there are argument for this application, set the values in the array
            if self.arguments and rts_result:
                # if never tried to line up arguments with parameters, do that
                if not self._resolved_arguments:
                    self._resolved_arguments = True
                    params = trait._fetch_all_parameters(res_opt)
                    param_found = None
                    a_value = None

                    for index, argument in enumerate(self.arguments):
                        param_found = params.resolve_parameter(index, argument.get_name())
                        argument._resolved_parameter = param_found
                        a_value = argument.value
                        a_value = ctx.corpus._const_type_check(res_opt, self.in_document, param_found, a_value)
                        argument.value = a_value

                for argument in self.arguments:
                    rts_result.set_parameter_value_from_argument(trait, argument)

            # register set of possible symbols
            ctx.corpus._register_definition_reference_symbols(self.fetch_object_definition(res_opt), kind, res_opt._symbol_ref_set)

            # get the new cache tag now that we have the list of docs
            cache_tag = ctx.corpus._create_definition_cache_tag(res_opt, self, kind, '', cache_by_path, trait.at_corpus_path)
            if cache_tag:
                ctx._cache[cache_tag] = rts_result
        else:
            # cache was found
            # get the SymbolSet for this cached object
            key = CdmCorpusDefinition._fetch_cache_key_from_object(self, kind)
            res_opt._symbol_ref_set = ctx.corpus._definition_reference_symbols.get(key)

        # merge child document set with current
        curr_sym_ref_set._merge(res_opt._symbol_ref_set)
        res_opt._symbol_ref_set = curr_sym_ref_set

        return rts_result

    def fetch_final_argument_values(self, res_opt: 'ResolveOptions') -> Optional[Dict[str, Any]]:
        final_args = {}  # type: Dict[str, Any]
        # get resolved traits does all the work, just clean up the answers
        rts = self._fetch_resolved_traits(res_opt)  # type: ResolvedTraitSet
        if rts is None or len(rts) != 1:
            # well didn't get the traits. maybe imports are missing or maybe things are just not defined yet.
            # this function will try to fake up some answers then from the arguments that are set on this reference only
            if self.arguments:
                un_named_count = 0
                for arg in self.arguments:
                    # if no arg name given, use the position in the list.
                    arg_name = arg.name
                    if not arg_name or arg_name.isspace():
                        arg_name = str(un_named_count)
                    final_args[arg_name] = arg.value
                    un_named_count += 1
                return final_args

            return None

        # there is only one resolved trait
        rt = rts.first  # type: ResolvedTrait
        if rt and rt.parameter_values:
            l = rt.parameter_values.length
            for i in range(l):
                parameter = rt.parameter_values.fetch_parameter_at_index(i)
                value = rt.parameter_values.fetch_value(i)
                name = parameter.name
                if not name:
                    name = str(i)
                final_args[name] = value
        return final_args

    def set_argument_value(self, name: str, value: 'CdmArgumentValue') -> None:
        i_arg_set = 0
        for arg in self.arguments:
            if arg.get_name() == name:
                arg.value = value
            i_arg_set += 1

        if i_arg_set == len(self.arguments):
            arg = CdmArgumentDefinition(self.ctx)
            arg.ctx = self.ctx
            arg.name = name
            arg.value = value
