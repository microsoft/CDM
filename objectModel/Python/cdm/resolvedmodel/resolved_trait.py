# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Any, Optional, cast, List, Set, TYPE_CHECKING

from cdm.resolvedmodel.parameter_value_set import ParameterValueSet

if TYPE_CHECKING:
    from cdm.objectmodel import CdmArgumentValue, CdmTraitDefinition, SpewCatcher, CdmEntityReference, CdmTraitReference, CdmTraitReferenceBase
    from cdm.resolvedmodel import ParameterCollection, TraitProfile, TraitProfileCache
    from cdm.utilities import ResolveOptions

class ResolvedTrait:
    def __init__(self, trait: 'CdmTraitDefinition', pc: 'ParameterCollection', values: List['CdmArgumentValue'], was_set: List[bool], explicit_verb: 'CdmTraitReference', meta_traits: List['CdmTraitReferenceBase']) -> None:
        self.trait = trait  # type: CdmTraitDefinition
        self.parameter_values = ParameterValueSet(trait.ctx, pc, values, was_set) if pc and pc.sequence else None  # type: Optional[ParameterValueSet]
        self.explicit_verb = explicit_verb
        if meta_traits is not None:
            self.meta_traits = meta_traits.copy()
        else:
            self.meta_traits = None

    @property
    def trait_name(self) -> str:
        return self.trait._declared_path

    def spew(self, res_opt: 'ResolveOptions', to: 'SpewCatcher', indent: str) -> None:
        to.spew_line(indent + '[' + self.trait_name + ']')
        if self.parameter_values:
            self.parameter_values.spew(res_opt, to, indent + '-')

    def copy(self) -> 'ResolvedTrait':

        pc = None # type: ParameterCollection
        values = None # type: List
        was_set = None # type: List[bool]
        meta_traits = None # type: List[CdmTraitReferenceBase]
        if self.parameter_values:
            copy_param_values = self.parameter_values.copy()
            pc = copy_param_values.pc
            values = copy_param_values.values
            was_set = copy_param_values.was_set
        if self.meta_traits is not None:
            meta_traits = self.meta_traits.copy()
        return ResolvedTrait(self.trait, pc, values, was_set, self.explicit_verb, meta_traits)

    def collect_trait_names(self, res_opt: 'ResolveOptions', into: Set[str]) -> None:
        # Get the name of this trait and all of its base classes.
        t = self.trait
        while t:
            name = t.trait_name
            into.add(name)
            base_ref = t.extends_trait
            t = cast('CdmTraitDefinition', base_ref.fetch_object_definition(res_opt) if base_ref else None)


    # Adds a 'meta' trait to a resolved trait object
    # collection stays null until used to save space
    # <param name="trait"> the trait reference to place in the metaTraits collection</param>
    # <param name="verb"> a verb trait to use along with the ref. can be null for default verb</param>
    def add_meta_traits(self, trait: 'CdmTraitReference', verb: 'CdmTraitReference') -> None:
        if self.meta_traits is None:
            self.meta_traits = []
        trait.verb = verb
        self.meta_traits.append(trait)

    # creates a TraitProfile from a resolved trait
    # normally these would come from a trait reference or definition, so we need to 
    # put some things back together to make this look right
    # <param name="resOpt"></param>
    # <param name="cache">optional cache object to speed up and make consistent the fetching of profiles for a larger set of objects</param>
    # <param name="forVerb">optional 'verb' name to use as a filter. I only want profiles applied with 'means' for example</param>
    # <returns>the profile object, perhaps from the cache</returns>
    def fetch_trait_profile(self, res_opt: 'ResolveOptions', cache:'TraitProfileCache' = None, forVerb:str = None) -> 'TraitProfile':
        from cdm.resolvedmodel import  TraitProfile, TraitProfileCache

        if cache is None:
            cache = TraitProfileCache()
        # start with the profile of the definition
        definition = TraitProfile._trait_def_to_profile(self.trait, res_opt, False, False, cache)
        result = None # type:TraitProfile

        # encapsulate and promote
        result = TraitProfile()
        result.references = definition
        result.trait_name = definition.trait_name

        # move over any verb set or meta_traits set on this reference
        if self.explicit_verb is not None:
            result.verb = TraitProfile._trait_ref_to_profile(self.explicit_verb, res_opt, True, True, True, cache)
        if result.verb is not None and forVerb is not None and result.verb.trait_name != forVerb:
            # filter out now
            result = None
        else:
            if self.meta_traits is not None:
                result.meta_traits = TraitProfile._trait_collection_to_profile_list(self.meta_traits, res_opt, result.meta_traits, True, cache)
                result._remove_classifiers_from_meta()

            # if there are arguments set in self resolved trait, list them
            if self.parameter_values is not None and self.parameter_values.length > 0:
                arg_map = dict[str, Any]()
                l = self.parameter_values.length
                for i in range(l):
                    p = self.parameter_values.fetch_parameter_at_index(i)
                    v = self.parameter_values.fetch_value(i)
                    name = p.name
                    if not name:
                        name = str(i)
                    value = TraitProfile.fetch_profile_argument_from_trait_argument(v, res_opt)
                    if value is not None:
                        arg_map[name] = value
                if len(arg_map) > 0:
                    result.argument_values = arg_map
        return result

