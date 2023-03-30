// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    AttributeContextParameters,
    CdmCorpusContext,
    CdmDocumentDefinition,
    CdmObjectDefinition,
    CdmObjectReference,
    cdmObjectType,
    copyOptions,
    ResolvedAttributeSet,
    ResolvedTraitSet,
    resolveOptions,
    traitProfile,
    traitProfileCache,
    VisitCallback
} from '../internal';
import { CdmJsonType } from '../Persistence/CdmFolder/types';

export interface CdmObject {
    /**
     * the object id.
     */
    ID: number;

    /**
     * the object context.
     */
    ctx: CdmCorpusContext;

    /**
     * the declaration document of the object.
     */
    inDocument: CdmDocumentDefinition;

    /**
     * the object type.
     */
    objectType: cdmObjectType;

    /**
     * the object that owns or contains this object
     */
    owner: CdmObject;

    /**
     * the current corpus path of the object, if know
     */
    atCorpusPath: string;

    /**
     * returns the resolved object reference.
     */
    fetchObjectDefinition<T extends CdmObjectDefinition>(resOpt?: resolveOptions): T;

    /**
     * Returns true if the object (or the referenced object) is an extension in some way from the specified symbol name
     */
    isDerivedFrom(baseDef: string, resOpt?: resolveOptions): boolean;

    /**
     * Runs the preChildren and postChildren input functions with this object as input, also calls recursively on any objects this one contains.
     */
    visit(path: string, preChildren: VisitCallback, postChildren: VisitCallback): boolean;

    /**
     * Validates that the object is configured properly.
     */
    validate(): boolean;

    /**
     * @deprecated
     */
    getObjectType(): cdmObjectType;

    /**
     * Returns the name of the object if this is a defintion or the name of the referenced object if this is an object reference.
     */
    fetchObjectDefinitionName(): string;

    /**
     * @deprecated
     */
    copyData(resOpt?: resolveOptions, options?: copyOptions): CdmJsonType;

    /**
     * @deprecated
     */
    fetchResolvedTraits(resOpt?: resolveOptions): ResolvedTraitSet;

    /**
     * @deprecated
     */
    fetchResolvedAttributes(resOpt?: resolveOptions, acpInContext?: AttributeContextParameters): ResolvedAttributeSet;

    /**
     * @param resOpt The resolve options
     * @param host For CDM internal use. Copies the object INTO the provided host instead of creating a new object instance.
     */
    copy(resOpt: resolveOptions, host?: CdmObject): CdmObject;

    /**
     * Takes an object definition and returns the object reference that points to the definition.
     * @resOpt For CDM internal use. Copies the object INTO the provided host instead of creating a new object instance.
     */
    createSimpleReference(resOpt?: resolveOptions): CdmObjectReference;

    /**
     * returns a list of TraitProfile descriptions, one for each trait applied to or exhibited by this object.
     * each description of a trait is an expanded picture of a trait reference.
     * the goal of the profile is to make references to structured, nested, messy traits easier to understand and compare.
     * we do this by promoting and merging some information as far up the trait inheritance / reference chain as far as we can without 
     * giving up important meaning.
     * in general, every trait profile includes:
     * 1. the name of the trait
     * 2. a TraitProfile for any trait that this trait may 'extend', that is, a base class trait
     * 3. a map of argument / parameter values that have been set
     * 4. an applied 'verb' trait in the form of a TraitProfile
     * 5. an array of any "classifier" traits that have been applied
     * 6. and array of any other (non-classifier) traits that have been applied or exhibited by this trait
     * 
     * Adjustments to these ideas happen as trait information is 'bubbled up' from base definitons. adjustments include
     * 1. the most recent verb trait that was defined or applied will propigate up the hierarchy for all references even those that do not specify a verb. 
     * This ensures the top trait profile depicts the correct verb
     * 2. traits that are applied or exhibited by another trait using the 'classifiedAs' verb are put into a different collection called classifiers.
     * 3. classifiers are accumulated and promoted from base references up to the final trait profile. this way the top profile has a complete list of classifiers 
     * but the 'deeper' profiles will not have the individual classifications set (to avoid an explosion of info)
     * 3. In a similar way, trait arguments will accumulate from base definitions and default values.
     * 4. traits used as 'verbs' (defaultVerb or explicit verb) will not include classifier descriptions, this avoids huge repetition of somewhat pointless info and recursive effort
     * </summary>
     * <param name="resOpt">The resolve options.</param>
     * <param name="cache">if specified, profiles for trait definitions will be pulled from and placed into the give cache. helps with runtime, size and persistance performace. </param>
     * <param name="forVerb">if specified, only traits that are applied directly or implicitly with the given verb name will be included</param>
     */
     fetchTraitProfiles(resOpt: resolveOptions, cache: traitProfileCache, forVerb: string): Array<traitProfile> ;

}
