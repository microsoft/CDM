# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from ctypes import Union
import json
from typing import Any, Optional, cast, List, Set, TYPE_CHECKING
from cdm.enums.cdm_object_type import CdmObjectType
from cdm.persistence.persistence_layer import PersistenceLayer

from cdm.utilities import JObject, ResolveOptions, CopyOptions

if TYPE_CHECKING:
    from cdm.objectmodel import CdmTraitDefinition, CdmTraitReferenceBase, CdmTraitGroupDefinition, CdmConstantEntityDefinition

# The object returned from the FetchTraitProfile API
# represents an expanded picture of a trait reference including:
# The structure represents either a trait definition or a trait reference
# IF the References member is not None, this is a trait reference else a definition
# Definition has
#     1. trait_name: the defined name of the trait
#     2. explanation: None or any text provided in the definition
#     3. IS_A: None or a reference profile for the base trait if the definition extends another trait
#     4. References: None
#     5. Verb: None or a reference profile for the default_verb of the definition if there is one
#     6. Arguments: None or if parameters are defined on the trait a map from parameter name to any default value defined for the parameter else None
#     7. classifications: None or an array of reference profiles for any 'exhibitedTraits' of the trait definition that use the 'classifiedAs' verb.
#     8. MetaTrait: None or an array of reference profiles for any 'exhibitedTraits' of the trait definition that DO NOT use the 'classifiedAs' verb.
# Reference has
#     1. trait_name: the name of the referenced trait
#     2. explanation: None
#     3. IS_A: None
#     4. References: a definition profile for the referenced trait
#     5. Verb: None or a reference profile for any verb applied in this reference
#     6. Arguments: None or if arguments are set at this reference then a map from argument name to set value
#     7. classifications: None or an array of reference profiles for any 'appliedTraits' at this reference that use the 'classifiedAs' verb.
#     8. MetaTrait: None or an array of reference profiles for any 'appliedTraits' at this reference that DO NOT use the 'classifiedAs' verb.
class TraitProfile(JObject):
    def __init__(self) -> None:
        super().__init__()

        self.json_rename({
            "trait_name": "traitName",
            "argument_values": "argumentValues",
            "meta_traits": "metaTraits"
        })

        self.json_ignore(["_tp_id"])

        # For Definition: the defined name of the trait
        # For Reference: the name of the referenced trait
        #[JsonProperty("traitName")]
        self.trait_name = None # type: str

        # For Definition: None or any text provided in the definition
        # For Reference: None
        #[JsonProperty("explanation")]
        self.explanation = None # type: str

        # For Definition: None or a reference profile for the base trait if the definition extends another trait
        # For Reference: None
        #[JsonProperty("IS_A")]
        self.IS_A = None # type: TraitProfile

        # For Definition: None
        # For Reference: a definition profile for the referenced trait
        #[JsonProperty("references")]
        self.references = None # type: TraitProfile

        # For Definition: None or a reference profile for the default_verb of the definition if there is one
        # For Reference: None or a reference profile for any verb applied in this reference
        #[JsonProperty("verb")]
        self.verb = None # type: TraitProfile

        # For Definition: None or if parameters are defined on the trait a map from parameter name to any default value defined for the parameter else None
        # For Reference: None or if arguments are set at this reference then a map from argument name to set value
        #[JsonProperty("argumenValues")]
        self.argument_values = None # type: dict[str, ] 

        # For Definition: None or an array of reference profiles for any 'exhibitedTraits' of the trait definition that use the 'classifiedAs' verb.
        # For Reference: None or an array of reference profiles for any 'appliedTraits' at this reference that use the 'classifiedAs' verb.
        #[JsonProperty("classifications")]
        self.classifications = None # type: List[TraitProfile]

        # For Definition: None or an array of reference profiles for any 'exhibitedTraits' of the trait definition that DO NOT use the 'classifiedAs' verb.
        # For Reference: None or an array of reference profiles for any 'appliedTraits' at this reference that DO NOT use the 'classifiedAs' verb.
        #[JsonProperty("metaTraits")]
        self.meta_traits = None #type: List[TraitProfile]

        self._tp_id = str(TraitProfile.next_tp_id) + "_"
        TraitProfile.next_tp_id += 1

    # need a way to unique ID object instances
    next_tp_id = 1

    # is this profile directly or through inheritance of the given type name
    # searches the chain of references and IS_A references for a profile with the given name
    # if B IS_A ref A
    # C IS_A ref B
    # then (ref C).isA('A') is true
    def is_a(self, extendedName: str)->bool:
        seek = self
        while seek is not None:
            if seek.trait_name == extendedName:
                return True
            
            if seek.IS_A is not None:
                seek = seek.IS_A
            elif seek.references is not None:
                seek = seek.references
            else:
                seek = None
        return False

    # find the same verb that would bubble to this point in consolidated profiles
    def applied_verb(self)->'TraitProfile':
        seek = self
        while seek is not None:
            if seek.verb is not None:
                return seek.verb
            if seek.IS_A is not None:
                seek = seek.IS_A
            elif seek.references is not None:
                seek = seek.references
            else:
                seek = None
        return None

    # Is this trait profile defined as using or being applied with the 'classifiedAs' verb so it represents the classification of other objects
    def is_classification(self)->bool:
        seek = self
        while seek is not None:
            if seek.verb is not None:
                return seek.verb.trait_name == "classifiedAs"
            if seek.IS_A is not None:
                seek = seek.IS_A
            elif seek.references is not None:
                seek = seek.references
            else:
                seek = None
        return False

    # makes a new trait profile that is a 'shallow' copy of the source (this)
    # shallow meaning fresh collections are created but any referenced profiles remain as before
    # returns a new trait profile as a copy of this</returns>
    def copy(self)->'TraitProfile':
        copy = TraitProfile()

        copy.trait_name = self.trait_name
        copy.explanation = self.explanation
        copy.IS_A = self.IS_A
        copy.references = self.references
        copy.verb = self.verb
        if self.argument_values is not None:
            copy.argument_values = self.argument_values.copy()
        if self.classifications is not None:
            copy.classifications = self.classifications.copy()
        if self.meta_traits is not None:
            copy.meta_traits = self.meta_traits.copy()
        return copy

    # converts a value taken from a trait argument and returns a version that can be persisted. 
    # these are used as the argument map values in trait profiles
    # returns a persist friendly version of the value
    @staticmethod
    def fetch_profile_argument_from_trait_argument(value, res_opt: 'ResolveOptions'):
        from cdm.objectmodel import CdmAttributeReference, CdmEntityReference

        if value is None:
            return None
        if isinstance(value, CdmEntityReference):
            return PersistenceLayer.to_data(value, res_opt, CopyOptions(), PersistenceLayer.CDM_FOLDER)
        if isinstance(value, CdmAttributeReference):
            return PersistenceLayer.to_data(value, res_opt, CopyOptions(), PersistenceLayer.CDM_FOLDER)
        str_val = str(value)
        if str_val is not None and str_val != "":
            return str_val
        return None

    # given a persist friendly argument value from a profile argument map, turn that into a constant entity (if it is one)
    # returns a constant entity definition found from the input
    @staticmethod
    def fetch_constant_entity_from_profile_argument(argValue, res_opt: 'ResolveOptions')->'CdmConstantEntityDefinition':
        from cdm.objectmodel import CdmConstantEntityDefinition

        if argValue is None:
            return None
        valAsJT = JObject(argValue)
        if valAsJT is None:
            return None

        # must be a ref to constant entity. make a real object from it
        entRefArg = PersistenceLayer.from_data(res_opt.wrt_doc.ctx, valAsJT, CdmObjectType.ENTITY_REF, PersistenceLayer.CDM_FOLDER)
        if entRefArg is None:
            return None

        # get the definition of the constant entity
        constEntDef = entRefArg.fetch_object_definition(res_opt) # type: CdmConstantEntityDefinition
        return constEntDef

    # <summary>
    # Consolidate action on a set of trait profiles will do a few things to make the profiles easier to work with, compare, store.
    # all classification traits applied or defined along the inheritance chain are promoted to the top most reference and deeper classification lists are removed.
    # the last verb that was applied or defined is also promoted and other verbs are removed.
    # references that add no value (no new verb or meta traits added) are removed from the branches of this tree. 
    # a 'simple' definition profile might get merged into a 'value adding' reference.
    # along the way, duplicate descriptions of definitions or duplicate looking references are turned into single objects
    # </summary>
    # <returns>a list of the consolidated profiles</returns>
    @staticmethod
    def consolidate_list(to_consolidate: List['TraitProfile'], cache: 'TraitProfileCache' = None)->List['TraitProfile']:
        if cache is None:
            cache = TraitProfileCache()
        return TraitProfile._consolidate_list(to_consolidate, cache)

    def consolidate(self, cache: 'TraitProfileCache' = None)-> 'TraitProfile':
        if cache is None:
            cache = TraitProfileCache()
        cons_prof = self._promote_from_base(cache)
        return cons_prof._remove_naked_references(cache)

    @staticmethod
    def _consolidate_list(to_consolidate: List['TraitProfile'], cache: 'TraitProfileCache')->List['TraitProfile']:
        result = [] # type: List[TraitProfile]
        for prof in to_consolidate:
            # promote verbs, explanations and classification traits up from the base definition
            cons_prof = prof._promote_from_base(cache)
            result.append(cons_prof)
        to_consolidate = result
        result = [] # type: List[TraitProfile]
        for prof in to_consolidate:
            # remove extra layers of references that add no information and reuse references where possible
            cons_prof = prof._remove_naked_references(cache)
            result.append(cons_prof)

        return result

    def _take_promo_values(self, source: 'TraitProfile')->None:
        # promote explanation unless this sets one
        if self.explanation is None:
            self.explanation = source.explanation
        # promote verb unless this def sets one
        if self.verb is None:
            self.verb = source.verb
        # copy or add the classifications
        if source.classifications is not None and len(source.classifications) > 0:
            if self.classifications is None:
                self.classifications = source.classifications.copy()
            else:
                self.classifications.extend(source.classifications)

    def _promote_from_base(self, cache: 'TraitProfileCache')->'TraitProfile':
        result = self
        if self.references is None:
            # we must be a trait def pointing to a ref of extended or empty
            # done this before?
            cached = cache.get_promoted_definition_profile(self)
            if cached is not None:
                return cached

            # new definition seen
            # since we get modified, make a copy
            result = self.copy()
            if result.IS_A is not None:
                isaRef = result.IS_A._promote_from_base(cache)
                result.IS_A = isaRef
                # pull up values from ref and then clean it up
                result._take_promo_values(isaRef)
                # clean ref
                isaRef.classifications = None
                isaRef.verb = None

            # save this so we only do it once
            cache.save_promoted_definition_profile(result, self)
            cleaned = result.copy()
            cleaned.classifications = None
            cleaned.verb = None
            cache.save_cleaned_definition_profile(cleaned, result)
        else:
            # we must be a trait reference to a trait def
            isaDef = self.references._promote_from_base(cache)
            # promote to this
            result = self.copy()
            result._take_promo_values(isaDef)
            # get the 'cleaned' base as our base
            result.references = cache.get_cleaned_definition_profile(isaDef)

        if result.meta_traits is not None:
            result.meta_traits = self._promote_from_baseList(result.meta_traits, cache)
        return result

    @staticmethod
    def _promote_from_baseList(to_consolidate: List['TraitProfile'], cache: 'TraitProfileCache')->List['TraitProfile']:
        result = [] # type: List[TraitProfile]
        for prof in to_consolidate:
            # promote verbs, explanations and classification traits up from the base definition
            cons_prof = prof._promote_from_base(cache)
            result.append(cons_prof)
        return result

    def _remove_naked_references(self, cache: 'TraitProfileCache')->'TraitProfile':
        result = self.copy()
        if result.IS_A is not None:
            result.IS_A = result.IS_A._remove_naked_references(cache)
        if result.references is not None:
            result.references = result.references._remove_naked_references(cache)
        if result.verb is not None:
            result.verb = result.verb._remove_naked_references(cache)
        if result.meta_traits is not None:
            result.meta_traits = TraitProfile._remove_naked_referencesList(result.meta_traits, cache)

        if result.references is not None:
            # if this reference is not interesting then move info down to a copy of the thing being referenced
            if result.meta_traits is None or len(result.meta_traits) == 0:
                new_result = result.references.copy()
                new_result.verb = result.verb
                new_result.classifications = result.classifications
                new_result.argument_values = result.argument_values
                new_result = cache.get_equivalent_reference(new_result)
                return new_result
            else:
                # the other option is that this reference is interesting but the thing being referenced is NOT. so just "remove" it
                if result.references.meta_traits is None or len(result.references.meta_traits) == 0:
                    new_result = result.copy()
                    new_result.IS_A = result.references.IS_A
                    new_result.references = None
                    new_result = cache.get_equivalent_reference(new_result)
                    return new_result

        return cache.get_equivalent_reference(result)

    @staticmethod
    def _remove_naked_referencesList(to_consolidate: List['TraitProfile'], cache: 'TraitProfileCache')->List['TraitProfile']:
        result = [] # type: List[TraitProfile]
        for prof in to_consolidate:
            # remove extra layers of references that add no information and reuse references where possible
            cons_prof = prof._remove_naked_references(cache)
            result.append(cons_prof)
        return result

    @staticmethod
    def _trait_def_to_profile(trait_def: 'CdmTraitDefinition', res_opt: 'ResolveOptions', is_verb: bool, is_meta: bool, cache: 'TraitProfileCache')->'TraitProfile':
        from cdm.objectmodel import CdmTraitDefinition
        if cache is None:
            cache = TraitProfileCache()
        result = TraitProfile()
        trait_name = trait_def.trait_name
        result.trait_name = trait_name
        result.explanation = trait_def.explanation
        ext_trait = None # type: TraitProfile
        if cache.add_context(trait_name) == True:
            tp_cache = cache.get_definition_profile(trait_def, is_verb, is_meta)
            if tp_cache is not None:
                cache.remove_context(trait_name)
                return tp_cache

            if not is_verb:
                if trait_def.extends_trait is not None:
                    # get details, only include classifiers if this is along the main path, don't get args
                    ext_trait = TraitProfile._trait_ref_to_profile(trait_def.extends_trait, res_opt, False, is_meta, False, cache)
                    result.IS_A = ext_trait
                if trait_def.default_verb is not None:
                    # get verb info, no classifications wanted args ok
                    result.verb = TraitProfile._trait_ref_to_profile(trait_def.default_verb, res_opt, True, True, True, cache)
                if trait_def.exhibits_traits is not None and len(trait_def.exhibits_traits) > 0:
                    # get sub traits include classifications
                    sub_traits = TraitProfile._trait_collection_to_profile_list(trait_def.exhibits_traits, res_opt, result.meta_traits, is_meta, cache)
                    if sub_traits is not None:
                        result.meta_traits = sub_traits
                        result._remove_classifiers_from_meta()

            cache.remove_context(trait_name)
            cache.save_definition_profile(trait_def, result, is_verb, is_meta)

        return result

    @staticmethod
    def  _trait_ref_to_profile(trb: 'CdmTraitReferenceBase', res_opt: 'ResolveOptions', is_verb: bool, is_meta: bool, include_args: bool, cache: 'TraitProfileCache')->'TraitProfile':
        from cdm.objectmodel import CdmTraitReference, CdmTraitGroupDefinition

        if cache is None:
            cache = TraitProfileCache()
        result = TraitProfile()
        trait_name = trb.fetch_object_definition_name()
        result.trait_name = trait_name
        if cache.add_context(trait_name):
            cache.remove_context(trait_name)
            # is this a traitgroup ref or a trait ref?
            tr = cast(CdmTraitReference, trb)

            # trait
            if tr is not None:
                trait_def = tr.fetch_object_definition(res_opt) # type: CdmTraitDefinition
                if trait_def is not None:
                    result.references = TraitProfile._trait_def_to_profile(trait_def, res_opt, is_verb, is_meta, cache)
                if tr.verb is not None:
                    # get info, a verb without classifications but args if set
                    result.verb = TraitProfile._trait_ref_to_profile(tr.verb, res_opt, True, True, True, cache)
                if tr.applied_traits is not None and len(tr.applied_traits) > 0:
                    # get sub traits but include classification only if requested
                    sub_traits = TraitProfile._trait_collection_to_profile_list(tr.applied_traits, res_opt, result.meta_traits, True, cache)
                    if sub_traits is not None:
                        result.meta_traits = sub_traits
                        result._remove_classifiers_from_meta()

                if include_args:
                    args = tr.fetch_final_argument_values(res_opt)
                    if args is not None and len(args) > 0:
                        arg_map = dict() # type: dict[str, ]
                        for av in args:
                            value = TraitProfile.fetch_profile_argument_from_trait_argument(args[av], res_opt)
                            if value is not None:
                                arg_map[av] = value
                        if len(arg_map) > 0:
                            result.argument_values = arg_map
                result = cache.get_equivalent_reference(result)
            else:
                # must be a trait group. so get the immediate members and unfold the list
                tg = trb.fetch_object_definition(res_opt) # type: CdmTraitGroupDefinition
                if tg is not None:
                    result.meta_traits = TraitProfile._trait_collection_to_profile_list(tg.exhibits_traits, res_opt, None, True, cache)
        return result

    @staticmethod
    def _trait_collection_to_profile_list(trCol: List['CdmTraitReferenceBase'], res_opt: 'ResolveOptions', accumulateInList: List['TraitProfile'], is_meta: bool, cache: 'TraitProfileCache')->List['TraitProfile']:
        from cdm.objectmodel import CdmTraitReferenceBase

        if cache is None:
            cache = TraitProfileCache()
        result = [] # type: List[TraitProfile]

        # if given a previous place, move over everything but maybe skip the classifiers
        if accumulateInList is not None:
            for old_prof in accumulateInList:
                if (not is_meta) or (not old_prof.is_classification()):
                    result.append(old_prof)

        # run over all traits and get a profile
        for tr in trCol:
            current = TraitProfile._trait_ref_to_profile(tr, res_opt, False, is_meta, True, cache); # not a verb, no classifiers for sub, args ok
            if (not is_meta) or (not current.is_classification()):
                result.append(current)

        if len(result) == 0:
            return None
        return result

    def _remove_classifiers_from_meta(self)->None:
        if self.meta_traits is not None and len(self.meta_traits) > 0:
            newExt_traits = [] # type: List[TraitProfile]
            classifier_traits = [] # type: List[TraitProfile]
            for extr in self.meta_traits:
                if extr.is_classification():
                    classifier_traits.append(extr)
                else:
                    newExt_traits.append(extr)

            self.meta_traits = None
            if len(newExt_traits) > 0:
                self.meta_traits = newExt_traits

            if len(classifier_traits) > 0:
                if self.classifications is None:
                    self.classifications = [] # type: List[TraitProfile]
                self.classifications.extend(classifier_traits)

# an internal helper object that encapsulates the work of producing a 'key' for a trait profile
# a key is a string that can distinctly identity the trait name, arguments and any applied 
# trait combinations. 
# the goal is that two traitProfiles with the same childrent and names etc. will produce identical 
# keys and can be considered to be the same object
class _trait_profile_key_factory:
    # returns a key for a collection of trait profiles as [prof key, prof key]
    @staticmethod
    def collection_get_key(col:List[TraitProfile])->str:
        if col is None or len(col) == 0:
            return "[]"
        key = "["
        for t in col:
            key += t._tp_id
        key += "]"
        return key

    # get the key for a profile 
    # form is traitName i:{isA key} r:{references key} v:{verb key} a:{arguments key} c:{classifications key} m:{meta traits key}
    @staticmethod
    def get_key(prof: TraitProfile)->str:
        i_key = "0" if prof.IS_A is None else prof.IS_A._tp_id
        r_key = "0" if prof.references is None else prof.references._tp_id
        v_key = "0" if prof.verb is None else prof.verb._tp_id
        a_key = "[]"
        if prof.argument_values is not None and len(prof.argument_values) > 0:
            a_key = "["
            for kv in prof.argument_values:
                a_key += "{"
                a_key += kv
                a_key += "="
                a_key += json.dumps(prof.argument_values[kv])
                a_key += "}"
            a_key += "]"
        c_key = _trait_profile_key_factory.collection_get_key(prof.classifications)
        m_key = _trait_profile_key_factory.collection_get_key(prof.meta_traits)
        return "{} i:{} r:{} v:{} a:{} c:{} m:{}".format(prof.trait_name, i_key, r_key, v_key, a_key, c_key, m_key)

# Encapsulates a scope of caching for trait profiles
# this object is created by an API user and passed as an argument, but is meant to be mostly opaque 
# in terms of operation or content
class TraitProfileCache:
    def __init__(self) -> None:
        self.stack = None #type: set[str]
        self.trait_def_to_profile = None # type: dict[CdmTraitDefinition, TraitProfile]
        self.trait_def_to_profile_no_classifiers = None # type: dict[CdmTraitDefinition, TraitProfile]
        self.trait_def_to_profile_no_meta = None # type: dict[CdmTraitDefinition, TraitProfile]
        self.prof_to_promoted_profile = None # type: dict[str, TraitProfile]
        self.prof_to_cleaned_profile = None # type: dict[str, TraitProfile]
        self.reference_cache = None # type: dict[str, TraitProfile]

    def add_context(self, level:str)->bool:
        if self.stack is None:
            self.stack = set()  # type: Set[str]
        else:
            if level in self.stack:
                return False
        self.stack.add(level)
        return True

    def remove_context(self, level: str)->bool:
        if self.stack is not None:
            if level in self.stack:
                self.stack.remove(level)
                return True
        return False

    def save_definition_profile(self, traitDef: 'CdmTraitDefinition', defProf: TraitProfile, no_meta: bool, no_classifiers: bool) -> TraitProfile:
        from cdm.objectmodel import CdmTraitDefinition

        if self.trait_def_to_profile is None:
            self.trait_def_to_profile = dict() # type: dict[CdmTraitDefinition, TraitProfile]()
            self.trait_def_to_profile_no_classifiers = dict() # type: dict[CdmTraitDefinition, TraitProfile]()
            self.trait_def_to_profile_no_meta = dict() # type: dict[CdmTraitDefinition, TraitProfile]()
        if no_classifiers == False and no_meta == False:
            self.trait_def_to_profile[traitDef] = defProf
        if no_classifiers == True and no_meta == False:
            self.trait_def_to_profile_no_classifiers[traitDef] = defProf
        if no_meta == True:
            self.trait_def_to_profile_no_meta[traitDef] = defProf
        return defProf

    def get_definition_profile(self, traitDef: 'CdmTraitDefinition', no_meta: bool, no_classifiers: bool)->TraitProfile:
        from cdm.objectmodel import CdmTraitDefinition

        if self.trait_def_to_profile is None:
            return None
        found = None # type: TraitProfile

        if no_classifiers == False and no_meta == False:
            if traitDef not in self.trait_def_to_profile:
                return None
            found = self.trait_def_to_profile[traitDef]
        if no_classifiers == True and no_meta == False:
            if traitDef not in self.trait_def_to_profile_no_classifiers:
                return None
            found = self.trait_def_to_profile_no_classifiers[traitDef]
        if no_meta == True:
            if traitDef not in self.trait_def_to_profile_no_meta:
                return None
            found = self.trait_def_to_profile_no_meta[traitDef]
        return found

    def save_promoted_definition_profile(self, promoted: TraitProfile, defProf: TraitProfile)->TraitProfile:
        if self.prof_to_promoted_profile is None:
            self.prof_to_promoted_profile = dict() # type: dict[str, TraitProfile]()
        self.prof_to_promoted_profile[defProf._tp_id] = promoted
        return defProf

    def get_promoted_definition_profile(self, profToFind: TraitProfile) -> TraitProfile:
        if self.prof_to_promoted_profile is None:
            return None
        if profToFind._tp_id in self.prof_to_promoted_profile:
            return self.prof_to_promoted_profile[profToFind._tp_id]
        return None

    def save_cleaned_definition_profile(self, cleaned: TraitProfile, defProf: TraitProfile)->TraitProfile:
        if self.prof_to_cleaned_profile is None:
            self.prof_to_cleaned_profile = dict() # type: dict[str, TraitProfile]()
        self.prof_to_cleaned_profile[defProf._tp_id] = cleaned
        return defProf

    def get_cleaned_definition_profile(self, profToFind: TraitProfile) -> TraitProfile:
        if self.prof_to_cleaned_profile is None:
            return None
        if profToFind._tp_id in self.prof_to_cleaned_profile:
            return self.prof_to_cleaned_profile[profToFind._tp_id]
        return None

    # returns a traitProfile from the cache that is exactly like the supplied profile 
    # OR adds the supplied profile to the cache 
    # <param name="prof">the profile to seek</param>
    # <returns>the equivalent profile from the cache</returns>
    def get_equivalent_reference(self, prof: TraitProfile)->TraitProfile:
        if self.reference_cache is None:
            self.reference_cache = dict() # type: dict[str, TraitProfile]()
        testWith = _trait_profile_key_factory.get_key(prof)
        if testWith not in self.reference_cache:
            self.reference_cache[testWith] = prof
        return self.reference_cache[testWith]
