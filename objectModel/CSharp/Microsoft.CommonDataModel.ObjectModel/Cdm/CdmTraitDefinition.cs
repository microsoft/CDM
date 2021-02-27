// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;

    public class CdmTraitDefinition : CdmObjectDefinitionBase
    {
        /// <summary>
        /// Gets or sets the trait name.
        /// </summary>
        public string TraitName { get; set; }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.TraitName;
        }

        /// <summary>
        /// Gets or sets the trait extended by this trait.
        /// </summary>
        public CdmTraitReference ExtendsTrait { get; set; }

        private CdmCollection<CdmParameterDefinition> _hasParameters { get; set; }

        ParameterCollection AllParameters { get; set; }

        private bool HasSetFlags;

        /// <summary>
        /// Gets or sets whether the trait is elevated.
        /// </summary>
        public bool? Elevated { get; set; }

        /// <summary>
        /// Gets or sets whether trait is user facing or not.
        /// </summary>
        public bool? Ugly { get; set; }

        /// <summary>
        /// Gets or sets the trait associated properties.
        /// </summary>
        public List<string> AssociatedProperties { get; set; }

        bool? BaseIsKnownToHaveParameters { get; set; }

        internal bool? ThisIsKnownToHaveParameters { get; set; }

        /// <summary>
        /// Gets the trait parameters.
        /// </summary>
        public CdmCollection<CdmParameterDefinition> Parameters
        {
            get
            {
                if (this._hasParameters == null)
                    this._hasParameters = new CdmCollection<CdmParameterDefinition>(this.Ctx, this, CdmObjectType.ParameterDef);
                return this._hasParameters;
            }
        }

        /// <summary>
        /// Constructs a CdmTraitDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The trait name.</param>
        /// <param name="extendsTrait">The trait extended by this trait.</param>
        public CdmTraitDefinition(CdmCorpusContext ctx, string name, CdmTraitReference extendsTrait = null)
            : base(ctx)
        {
            this.HasSetFlags = false;
            this.ObjectType = CdmObjectType.TraitDef;
            this.TraitName = name;
            this.ExtendsTrait = extendsTrait;
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmTraitDefinition copy;
            if (host == null)
            {
                copy = new CdmTraitDefinition(this.Ctx, this.TraitName, null);
            }
            else
            {
                copy = host as CdmTraitDefinition;
                copy.Ctx = this.Ctx;
                copy.TraitName = this.TraitName;
            }

            copy.ExtendsTrait = (CdmTraitReference)this.ExtendsTrait?.Copy(resOpt);
            copy.AllParameters = null;
            copy.Elevated = this.Elevated;
            copy.Ugly = this.Ugly;
            copy.AssociatedProperties = this.AssociatedProperties;

            this.CopyDef(resOpt, copy);
            return copy;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmTraitDefinition>(this, resOpt, options);
        }

        internal ParameterCollection FetchAllParameters(ResolveOptions resOpt)
        {
            if (this.AllParameters != null)
                return this.AllParameters;

            // get parameters from base if there is one
            ParameterCollection prior = null;
            if (this.ExtendsTrait != null)
                prior = this.ExtendsTrait.FetchObjectDefinition<CdmTraitDefinition>(resOpt).FetchAllParameters(resOpt);
            this.AllParameters = new ParameterCollection(prior);
            if (this.Parameters != null)
            {
                foreach (CdmParameterDefinition element in this.Parameters)
                {
                    this.AllParameters.Add(element as CdmParameterDefinition);
                }
            }
            return this.AllParameters;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.TraitDef;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            if (baseDef == this.TraitName)
                return true;
            return this.IsDerivedFromDef(resOpt, this.ExtendsTrait, this.TraitName, baseDef);
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.TraitName))
            {
                Logger.Error(nameof(CdmTraitDefinition), this.Ctx, Errors.ValidateErrorString(this.AtCorpusPath, new List<string> { "TraitName" }), nameof(Validate));
                return false;
            }
            return true;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                path = this.DeclaredPath;
                if (string.IsNullOrEmpty(path))
                {
                    path = pathFrom + this.TraitName;
                    this.DeclaredPath = path;
                }
            }

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;
            if (this.ExtendsTrait != null)
            {
                this.ExtendsTrait.Owner = this;
                if (this.ExtendsTrait.Visit(path + "/extendsTrait/", preChildren, postChildren))
                    return true;
            }
            if (this.Parameters != null)
                if (this.Parameters.VisitList(path + "/hasParameters/", preChildren, postChildren))
                    return true;
            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        internal override ResolvedTraitSet FetchResolvedTraits(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            const string kind = "rtsb";
            ResolveContext ctx = this.Ctx as ResolveContext;
            // this may happen 0, 1 or 2 times. so make it fast
            CdmTraitDefinition baseTrait = null;
            ResolvedTraitSet baseRts = null;
            List<dynamic> baseValues = null;
            System.Action GetBaseInfo = () =>
            {
                if (this.ExtendsTrait != null)
                {
                    baseTrait = this.ExtendsTrait.FetchObjectDefinition<CdmTraitDefinition>(resOpt);
                    if (baseTrait != null)
                    {
                        baseRts = this.ExtendsTrait.FetchResolvedTraits(resOpt);
                        if (baseRts?.Size == 1)
                        {
                            ParameterValueSet basePv = baseRts.Get(baseTrait)?.ParameterValues;
                            if (basePv != null)
                                baseValues = basePv.Values;
                        }
                    }
                }
            };

            // see if one is already cached
            // if this trait has parameters, then the base trait found through the reference might be a different reference
            // because trait references are unique per argument value set. so use the base as a part of the cache tag
            // since it is expensive to figure out the extra tag, cache that too!
            if (this.BaseIsKnownToHaveParameters == null)
            {
                GetBaseInfo();
                // is a cache tag needed? then make one
                this.BaseIsKnownToHaveParameters = false;
                if (baseValues?.Count > 0)
                    this.BaseIsKnownToHaveParameters = true;
            }
            string cacheTagExtra = "";
            if (this.BaseIsKnownToHaveParameters == true)
                cacheTagExtra = this.ExtendsTrait.Id.ToString();

            string cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, cacheTagExtra);
            dynamic rtsResultDynamic = null;
            if (cacheTag != null)
                ctx.Cache.TryGetValue(cacheTag, out rtsResultDynamic);
            ResolvedTraitSet rtsResult = rtsResultDynamic as ResolvedTraitSet;

            // store the previous reference symbol set, we will need to add it with
            // children found from the constructResolvedTraits call 
            SymbolSet currSymbolRefSet = resOpt.SymbolRefSet;
            if (currSymbolRefSet == null)
                currSymbolRefSet = new SymbolSet();
            resOpt.SymbolRefSet = new SymbolSet();

            // if not, then make one and save it
            if (rtsResult == null)
            {
                GetBaseInfo();
                if (baseTrait != null)
                {
                    // get the resolution of the base class and use the values as a starting point for this trait's values
                    if (!this.HasSetFlags)
                    {
                        // inherit these flags
                        if (this.Elevated == null)
                            this.Elevated = baseTrait.Elevated;
                        if (this.Ugly == null)
                            this.Ugly = baseTrait.Ugly;
                        if (this.AssociatedProperties == null)
                            this.AssociatedProperties = baseTrait.AssociatedProperties;
                    }
                }
                this.HasSetFlags = true;
                ParameterCollection pc = this.FetchAllParameters(resOpt);
                List<dynamic> av = new List<dynamic>();
                List<bool> wasSet = new List<bool>();
                this.ThisIsKnownToHaveParameters = pc.Sequence.Count > 0;
                for (int i = 0; i < pc.Sequence.Count; i++)
                {
                    // either use the default value or (higher precidence) the value taken from the base reference
                    dynamic value = (pc.Sequence[i] as CdmParameterDefinition).DefaultValue;
                    dynamic baseValue = null;
                    if (baseValues != null && i < baseValues.Count)
                    {
                        baseValue = baseValues[i];
                        if (baseValue != null)
                            value = baseValue;
                    }
                    av.Add(value);
                    wasSet.Add(false);
                }

                // save it
                ResolvedTrait resTrait = new ResolvedTrait(this, pc, av, wasSet);
                rtsResult = new ResolvedTraitSet(resOpt);
                rtsResult.Merge(resTrait, false);

                // register set of possible symbols
                ctx.Corpus.RegisterDefinitionReferenceSymbols(this.FetchObjectDefinition<CdmObjectDefinitionBase>(resOpt), kind, resOpt.SymbolRefSet);
                // get the new cache tag now that we have the list of docs
                cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, cacheTagExtra);
                if (!string.IsNullOrWhiteSpace(cacheTag))
                    ctx.Cache[cacheTag] = rtsResult;
            }
            else
            {
                // cache found
                // get the SymbolSet for this cached object
                string key = CdmCorpusDefinition.CreateCacheKeyFromObject(this, kind);
                ((CdmCorpusDefinition)ctx.Corpus).DefinitionReferenceSymbols.TryGetValue(key, out SymbolSet tempSymbolRefSet);
                resOpt.SymbolRefSet = tempSymbolRefSet;
            }
            // merge child document set with current
            currSymbolRefSet.Merge(resOpt.SymbolRefSet);
            resOpt.SymbolRefSet = currSymbolRefSet;

            return rtsResult;
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            return;
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            return null;
        }
    }
}
