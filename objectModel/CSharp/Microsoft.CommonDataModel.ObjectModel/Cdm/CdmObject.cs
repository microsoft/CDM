// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using System.Collections.Generic;

    public interface CdmObject
    {
        /// <summary>
        /// Gets or sets the object id.
        /// </summary>
        int Id { get; set; }

        /// <summary>
        /// Gets or sets the object context.
        /// </summary>
        CdmCorpusContext Ctx { get; set; }

        /// <summary>
        /// Gets or sets the declaration document of the object.
        /// </summary>
        CdmDocumentDefinition InDocument { get; set; }

        /// <summary>
        /// Gets the object declared path.
        /// </summary>
        string AtCorpusPath { get; }

        /// <summary>
        /// Gets or sets the object type.
        /// </summary>
        CdmObjectType ObjectType { get; set; }

        /// <summary>
        /// Gets or sets the object that owns or contains this object.
        /// </summary>
        CdmObject Owner { get; set; }

        /// <summary>
        /// Returns the resolved object reference.
        /// </summary>
        T FetchObjectDefinition<T>(ResolveOptions resOpt = null) where T : CdmObjectDefinition;

        /// <summary>
        /// Returns the name of the object if this is a defintion or the name of the referenced object if this is an object reference.
        /// </summary>
        string FetchObjectDefinitionName();

        /// <summary>
        /// Runs the preChildren and postChildren input functions with this object as input, also calls recursively on any objects this one contains.
        /// </summary>
        bool Visit(string pathRoot, VisitCallback preChildren, VisitCallback postChildren);

        /// <summary>
        /// Returns true if the object (or the referenced object) is an extension in some way from the specified symbol name.
        /// </summary>
        bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null);

        /// <summary>
        /// Validates that the object is configured properly.
        /// </summary>
        bool Validate();

        [Obsolete()]
        CdmObjectType GetObjectType();

        [Obsolete()]
        dynamic CopyData(ResolveOptions resOpt = null, CopyOptions options = null);

        /// <summary>
        /// Creates a copy of this object.
        /// </summary>
        /// <param name="resOpt">The resolve options.</param>
        /// <param name="host"> For CDM internal use. Copies the object INTO the provided host instead of creating a new object instance.</param>
        CdmObject Copy(ResolveOptions resOpt, CdmObject host = null);

        /// <summary>
        /// Takes an object definition and returns the object reference that points to the definition.
        /// </summary>
        /// <param name="resOpt">The resolve options.</param>
        CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null);

        /// <summary>
        /// returns a list of TraitProfile descriptions, one for each trait applied to or exhibited by this object.
        /// each description of a trait is an expanded picture of a trait reference.
        /// the goal of the profile is to make references to structured, nested, messy traits easier to understand and compare.
        /// we do this by promoting and merging some information as far up the trait inheritance / reference chain as far as we can without 
        /// giving up important meaning.
        /// in general, every trait profile includes:
        /// 1. the name of the trait
        /// 2. a TraitProfile for any trait that this trait may 'extend', that is, a base class trait
        /// 3. a map of argument / parameter values that have been set
        /// 4. an applied 'verb' trait in the form of a TraitProfile
        /// 5. an array of any "classifier" traits that have been applied
        /// 6. and array of any other (non-classifier) traits that have been applied or exhibited by this trait
        /// 
        /// Adjustments to these ideas happen as trait information is 'bubbled up' from base definitons. adjustments include
        /// 1. the most recent verb trait that was defined or applied will propigate up the hierarchy for all references even those that do not specify a verb. 
        /// This ensures the top trait profile depicts the correct verb
        /// 2. traits that are applied or exhibited by another trait using the 'classifiedAs' verb are put into a different collection called classifiers.
        /// 3. classifiers are accumulated and promoted from base references up to the final trait profile. this way the top profile has a complete list of classifiers 
        /// but the 'deeper' profiles will not have the individual classifications set (to avoid an explosion of info)
        /// 3. In a similar way, trait arguments will accumulate from base definitions and default values.
        /// 4. traits used as 'verbs' (defaultVerb or explicit verb) will not include classifier descriptions, this avoids huge repetition of somewhat pointless info and recursive effort
        /// </summary>
        /// <param name="resOpt">The resolve options.</param>
        /// <param name="cache">if specified, profiles for trait definitions will be pulled from and placed into the give cache. helps with runtime, size and persistance performace. </param>
        /// <param name="forVerb">if specified, only traits that are applied directly or implicitly with the given verb name will be included</param>
        List<TraitProfile> FetchTraitProfiles(ResolveOptions resOpt = null, TraitProfileCache cache = null, string forVerb = null);
    }
}
