from typing import Any, Dict, Optional, Union, TYPE_CHECKING

from cdm.enums import CdmObjectType

from .cdm_argument_collection import CdmArgumentCollection
from .cdm_argument_def import CdmArgumentDefinition
from .cdm_object_ref import CdmObjectReference

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmCorpusContext, CdmObject, CdmTraitDefinition
    from cdm.utilities import FriendlyFormatNode, ResolveOptions, VisitCallback


class CdmTraitReference(CdmObjectReference):
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

    def _copy_ref_object(self, res_opt: 'ResolveOptions', ref_to: Union[str, 'CdmTraitDefinition'], simple_reference: bool) -> 'CdmObjectReference':
        copy = CdmTraitReference(self.ctx, ref_to, simple_reference)
        if not simple_reference:
            copy.arguments.extend(self.arguments)
            copy._resolved_arguments = self._resolved_arguments
        return copy

    def _visit_ref(self, path_from: str, pre_children: 'VisitCallback', post_children: 'VisitCallback') -> bool:
        if self.arguments and self.arguments._visit_array('{}/arguments/'.format(path_from), pre_children, post_children):
            return True
        return False

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

    def _fetch_resolved_traits(self, res_opt: 'ResolveOptions') -> 'ResolvedTraitSet':
        from cdm.utilities import SymbolSet
        from .cdm_corpus_def import CdmCorpusDefinition

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

        cache_by_name = not trait._this_is_known_to_have_parameters
        cache_tag = ctx.corpus._fetch_definition_cache_tag(res_opt, self, kind, '', cache_by_name)
        rts_result = ctx.cache.get(cache_tag) if cache_tag else None

        # store the previous reference symbol set, we will need to add it with
        # children found from the _construct_resolved_traits call
        curr_sym_ref_set = res_opt.symbol_ref_set or SymbolSet()
        res_opt.symbol_ref_set = SymbolSet()

        # if not, then make one and save it
        if not rts_result:
            # get the set of resolutions, should just be this one trait
            if not rts_trait:
                # store current doc ref set
                new_doc_ref_set = res_opt.symbol_ref_set
                res_opt.symbol_ref_set = SymbolSet()

                rts_trait = trait._fetch_resolved_traits(res_opt)

                # bubble up symbol reference set from children
                if new_doc_ref_set:
                    new_doc_ref_set.merge(res_opt.symbol_ref_set)

                res_opt.symbol_ref_set = new_doc_ref_set
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
                        argument.resolved_parameter = param_found
                        a_value = argument.value
                        a_value = ctx.corpus._const_type_check(res_opt, param_found, a_value)
                        argument.value = a_value

                for argument in self.arguments:
                    rts_result.set_parameter_value_from_argument(trait, argument)

            # register set of possible symbols
            ctx.corpus._register_definition_reference_symbols(self.fetch_object_definition(res_opt), kind, res_opt.symbol_ref_set)

            # get the new cache tag now that we have the list of docs
            cache_tag = ctx.corpus._fetch_definition_cache_tag(res_opt, self, kind, '', cache_by_name)
            if cache_tag:
                ctx.cache[cache_tag] = rts_result
        else:
            # cache was found
            # get the SymbolSet for this cached object
            key = CdmCorpusDefinition._fetch_cache_key_from_object(self, kind)
            res_opt.symbol_ref_set = ctx.corpus._definition_reference_symbols.get(key)

        # merge child document set with current
        curr_sym_ref_set.merge(res_opt.symbol_ref_set)
        res_opt.symbol_ref_set = curr_sym_ref_set

        return rts_result

    def _get_final_argument_values(self, res_opt: 'ResolveOptions') -> Optional[Dict[str, Any]]:
        final_args = {}  # type: Dict[str, Any]
        # get resolved traits does all the work, just clean up the answers
        rts = self._fetch_resolved_traits(res_opt)  # type: ResolvedTraitSet
        if rts is None:
            return None

        # there is only one resolved trait
        rt = rts.first  # type: ResolvedTrait
        if rt.parameter_values:
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
