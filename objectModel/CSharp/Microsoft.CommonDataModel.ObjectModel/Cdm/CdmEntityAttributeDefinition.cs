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
    using System.Linq;

    public class CdmEntityAttributeDefinition : CdmAttribute
    {
        private static readonly string Tag = nameof(CdmEntityAttributeDefinition);
        /// <summary>
        /// Gets or sets the entity attribute's entity reference.
        /// </summary>
        public CdmEntityReference Entity
        {
            get => this.entity;
            set
            {
                if (value != null)
                    value.Owner = this;
                this.entity = value;
            }
        }

        /// <summary>
        /// Gets or sets the entity attribute's display name.
        /// </summary>
        public string DisplayName
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("displayName");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("displayName", value);
            }
        }

        /// <summary>
        /// Gets or sets the entity attribute's description.
        /// </summary>
        public string Description
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("description");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("description", value);
            }
        }

        private TraitToPropertyMap TraitToPropertyMap { get; }

        /// <summary>
        /// For projection based models, a source is explicitly tagged as a polymorphic source for it to be recognized as such.
        /// This property of the entity attribute allows us to do that.
        /// </summary>
        public bool? IsPolymorphicSource { get; set; }

        private CdmEntityReference entity;

        /// <summary>
        /// Constructs a CdmEntityAttributeDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The name.</param>
        public CdmEntityAttributeDefinition(CdmCorpusContext ctx, string name)
            : base(ctx, name)
        {
            this.ObjectType = CdmObjectType.EntityAttributeDef;
            this.TraitToPropertyMap = new TraitToPropertyMap(this);
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.EntityAttributeDef;
        }

        /// <summary>
        /// Gets a property by name ignoring if the value came from a trait.
        /// </summary>
        /// <param name="propertyName"></param>
        /// <returns></returns>
        internal dynamic GetProperty(string propertyName)
        {
            return this.TraitToPropertyMap.FetchPropertyValue(propertyName, true);
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            return false;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmEntityAttributeDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmEntityAttributeDefinition copy;
            if (host == null)
            {
                copy = new CdmEntityAttributeDefinition(this.Ctx, this.Name);
            }
            else
            {
                copy = host as CdmEntityAttributeDefinition;
                copy.Name = this.Name;
            }

            copy.Entity = (CdmEntityReference)this.Entity.Copy(resOpt);

            this.CopyAtt(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            List<string> missingFields = new List<string>();
            if (string.IsNullOrWhiteSpace(this.Name))
                missingFields.Add("Name");
            if (this.Entity == null)
                missingFields.Add("Entity");
            if (Cardinality != null)
            {
                if (string.IsNullOrWhiteSpace(Cardinality.Minimum))
                    missingFields.Add("Cardinality.Minimum");
                if (string.IsNullOrWhiteSpace(Cardinality.Maximum))
                    missingFields.Add("Cardinality.Maximum");
            }
            if (missingFields.Count > 0)
            {
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) => $"'{s}'")));
                return false;
            }
            if (Cardinality != null)
            {
                if (!CardinalitySettings.IsMinimumValid(Cardinality.Minimum))
                {
                    Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnInvalidMinCardinality, Cardinality.Minimum);
                    return false;
                }
                if (!CardinalitySettings.IsMaximumValid(Cardinality.Maximum))
                {
                    Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnInvalidMaxCardinality, Cardinality.Maximum);
                    return false;
                }
            }
            return true;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            if (this.Entity == null)
            {
                return false;
            }

            string path = string.Empty;
            if (this.Ctx.Corpus.blockDeclaredPathChanges == false)
            {
                path = this.DeclaredPath;
                if (string.IsNullOrEmpty(path))
                {
                    path = pathFrom + this.Name;
                    this.DeclaredPath = path;
                }
            }
            //trackVisits(path);

            if (preChildren != null && preChildren.Invoke(this, path))
                return false;

            if (this.Entity.Visit(path + "/entity/", preChildren, postChildren))
                return true;
            if (this.VisitAtt(path, preChildren, postChildren))
                return true;
            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        /// <summary>
        /// Creates an AttributeResolutionContext object based off of resolution guidance information
        /// </summary>
        /// <param name="resOpt"></param>
        /// <returns>An AttributeResolutionContext used for correctly resolving an entity attribute.</returns>
        private AttributeResolutionContext FetchAttResContext(ResolveOptions resOpt)
        {
            ResolvedTraitSet rtsThisAtt = this.FetchResolvedTraits(resOpt);

            // this context object holds all of the info about what needs to happen to resolve these attributes.
            // make a copy and add defaults if missing
            CdmAttributeResolutionGuidance resGuideWithDefault = this.ResolutionGuidance == null 
                ? new CdmAttributeResolutionGuidance(this.Ctx) : this.ResolutionGuidance?.Copy(resOpt) as CdmAttributeResolutionGuidance;

            resGuideWithDefault.UpdateAttributeDefaults(this.Name, this);

            return new AttributeResolutionContext(resOpt, resGuideWithDefault, rtsThisAtt);
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            // // get from purpose 
            if (this.Purpose != null)
                rtsb.TakeReference(this.Purpose.FetchResolvedTraits(resOpt));

            this.AddResolvedTraitsApplied(rtsb, resOpt);
            //rtsb.CleanUp();
        }

        internal override ResolvedAttributeSetBuilder FetchObjectFromCache(ResolveOptions resOpt, AttributeContextParameters acpInContext)
        {
            const string kind = "rasb";
            ResolveContext ctx = this.Ctx as ResolveContext;

            // once resolution guidance is fully deprecated, this line can be removed
            AttributeResolutionContext arc = !this.Entity.IsProjection ? this.FetchAttResContext(resOpt) : null;

            // update the depth info and check cache at the correct depth for entity attributes
            resOpt.DepthInfo.UpdateToNextLevel(resOpt, this.IsPolymorphicSource, arc);

            string cacheTag = ctx.Corpus.CreateDefinitionCacheTag(resOpt, this, kind, acpInContext != null ? "ctx" : "");

            dynamic rasbCache = null;
            if (cacheTag != null)
                ctx.Cache.TryGetValue(cacheTag, out rasbCache);
            return rasbCache;
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the entity used as an attribute, traits applied to that entity,
            // the purpose of the attribute, any traits applied to the attribute.
            ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
            CdmAttributeContext underAtt = under;
            AttributeContextParameters acpEnt = null;

            if (!resOpt.InCircularReference)
            {
                if (this.Entity?.IsProjection == true)
                {
                    // A Projection

                    // if the max depth is exceeded it should not try to execute the projection
                    if (!resOpt.DepthInfo.MaxDepthExceeded)
                    {
                        CdmProjection projDef = this.Entity.FetchObjectDefinition<CdmProjection>(resOpt);
                        ProjectionDirective projDirective = new ProjectionDirective(resOpt, this, ownerRef: this.Entity);

                        ProjectionContext projCtx = projDef.ConstructProjectionContext(projDirective, under);
                        rasb.ResolvedAttributeSet = projDef.ExtractResolvedAttributes(projCtx, under);
                        // from the traits of purpose and applied here
                        rasb.ResolvedAttributeSet.ApplyTraits(this.FetchResolvedTraits(resOpt));
                    }
                }
                else
                {
                    // Resolution guidance

                    resOpt.UsedResolutionGuidance = true;

                    AttributeResolutionContext arc = this.FetchAttResContext(resOpt);
                    RelationshipInfo relInfo = arc.GetRelationshipInfo();

                    if (underAtt != null)
                    {
                        // make a context for this attreibute that holds the attributes that come up from the entity
                        acpEnt = new AttributeContextParameters
                        {
                            under = underAtt,
                            type = CdmAttributeContextType.Entity,
                            Name = this.Entity.FetchObjectDefinitionName(),
                            Regarding = this.Entity,
                            IncludeTraits = true
                        };
                    }

                    if (relInfo.IsByRef)
                    {
                        // make the entity context that a real recursion would have give us
                        if (under != null)
                            under = rasb.ResolvedAttributeSet.CreateAttributeContext(resOpt, acpEnt);
                        // if selecting from one of many attributes, then make a context for each one
                        if (under != null && relInfo.SelectsOne)
                        {
                            // the right way to do this is to get a resolved entity from the embedded entity and then 
                            // look through the attribute context hierarchy for non-nested entityReferenceAsAttribute nodes
                            // that seems like a disaster waiting to happen given endless looping, etc.
                            // for now, just insist that only the top level entity attributes declared in the ref entity will work
                            CdmEntityDefinition entPickFrom = (this.Entity as CdmEntityReference).FetchObjectDefinition<CdmEntityDefinition>(resOpt) as CdmEntityDefinition;
                            CdmCollection<CdmAttributeItem> attsPick = entPickFrom?.Attributes;
                            if (entPickFrom != null && attsPick != null)
                            {
                                for (int i = 0; i < attsPick.Count; i++)
                                {
                                    if (attsPick[i].ObjectType == CdmObjectType.EntityAttributeDef)
                                    {
                                        // a table within a table. as expected with a selectsOne attribute
                                        // since this is by ref, we won't get the atts from the table, but we do need the traits that hold the key
                                        // these are the same contexts that would get created if we recursed
                                        // first this attribute
                                        AttributeContextParameters acpEntAtt = new AttributeContextParameters
                                        {
                                            under = under,
                                            type = CdmAttributeContextType.AttributeDefinition,
                                            Name = attsPick[i].FetchObjectDefinitionName(),
                                            Regarding = attsPick[i],
                                            IncludeTraits = true
                                        };
                                        CdmAttributeContext pickUnder = rasb.ResolvedAttributeSet.CreateAttributeContext(resOpt, acpEntAtt);
                                        CdmEntityReference pickEnt = (attsPick[i] as CdmEntityAttributeDefinition).Entity;
                                        CdmAttributeContextType pickEntType = (pickEnt.FetchObjectDefinition<CdmObjectDefinition>(resOpt).ObjectType == CdmObjectType.ProjectionDef) ?
                                            CdmAttributeContextType.Projection :
                                            CdmAttributeContextType.Entity;
                                        AttributeContextParameters acpEntAttEnt = new AttributeContextParameters
                                        {
                                            under = pickUnder,
                                            type = pickEntType,
                                            Name = pickEnt.FetchObjectDefinitionName(),
                                            Regarding = pickEnt,
                                            IncludeTraits = true
                                        };
                                        rasb.ResolvedAttributeSet.CreateAttributeContext(resOpt, acpEntAttEnt);
                                    }
                                }
                            }
                        }

                        // if we got here because of the max depth, need to impose the directives to make the trait work as expected
                        if (resOpt.DepthInfo.MaxDepthExceeded)
                        {
                            if (arc.ResOpt.Directives == null)
                                arc.ResOpt.Directives = new AttributeResolutionDirectiveSet();
                            arc.ResOpt.Directives.Add("referenceOnly");
                        }
                    }
                    else
                    {
                        ResolveOptions resLink = resOpt.Copy();
                        resLink.SymbolRefSet = resOpt.SymbolRefSet;
                        rasb.MergeAttributes(this.Entity.FetchResolvedAttributes(resLink, acpEnt));

                        // need to pass up maxDepthExceeded if it was hit
                        if (resLink.DepthInfo.MaxDepthExceeded)
                        {
                            resOpt.DepthInfo = resLink.DepthInfo.Copy();
                        }
                    }

                    // from the traits of purpose and applied here, see if new attributes get generated
                    rasb.ResolvedAttributeSet.AttributeContext = underAtt;
                    rasb.ApplyTraits(arc);
                    rasb.GenerateApplierAttributes(arc, true); // true = apply the prepared traits to new atts
                                                               // this may have added symbols to the dependencies, so merge them
                    resOpt.SymbolRefSet.Merge(arc.ResOpt.SymbolRefSet);

                    // use the traits for linked entity identifiers to record the actual foreign key links
                    if (rasb.ResolvedAttributeSet?.Set != null && relInfo.IsByRef)
                    {
                        foreach (var att in rasb.ResolvedAttributeSet.Set)
                        {
                            if (att.ResolvedTraits != null)
                            {
                                var reqdTrait = att.ResolvedTraits.Find(resOpt, "is.linkedEntity.identifier");
                                if (reqdTrait == null)
                                {
                                    continue;
                                }

                                if (reqdTrait.ParameterValues == null || reqdTrait.ParameterValues.Length == 0)
                                {
                                    Logger.Warning(this.Ctx as ResolveContext, Tag, nameof(ConstructResolvedAttributes), this.AtCorpusPath, CdmLogCode.WarnLinkEntIdentArgsNotSupported, att.DisplayName, this.Entity.NamedReference);
                                    continue;
                                }

                                var entReferences = new List<string>();
                                var attReferences = new List<string>();
                                Action<CdmEntityReference, string> addEntityReference = (CdmEntityReference entRef, string nameSpace) =>
                                {
                                    var entDef = entRef.FetchObjectDefinition<CdmEntityDefinition>(resOpt);
                                    if (entDef != null)
                                    {
                                        var otherResTraits = entRef.FetchResolvedTraits(resOpt);
                                        ResolvedTrait identifyingTrait;
                                        if (otherResTraits != null && (identifyingTrait = otherResTraits.Find(resOpt, "is.identifiedBy")) != null)
                                        {
                                            var attRef = identifyingTrait.ParameterValues.FetchParameterValueByName("attribute").Value;
                                            string attNamePath = ((CdmObjectReferenceBase)attRef).NamedReference;
                                            string attName = attNamePath.Split('/').Last();
                                            string absoluteEntPath = Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(entDef.AtCorpusPath, entDef.InDocument);
                                            entReferences.Add(absoluteEntPath);
                                            attReferences.Add(attName);
                                        }
                                    }
                                };
                                if (relInfo.SelectsOne)
                                {
                                    var entPickFrom = this.Entity.FetchObjectDefinition<CdmEntityDefinition>(resOpt);
                                    var attsPick = entPickFrom?.Attributes.Cast<CdmObject>().ToList();
                                    if (entPickFrom != null && attsPick != null)
                                    {
                                        for (int i = 0; i < attsPick.Count; i++)
                                        {
                                            if (attsPick[i].ObjectType == CdmObjectType.EntityAttributeDef)
                                            {
                                                var entAtt = attsPick[i] as CdmEntityAttributeDefinition;
                                                addEntityReference(entAtt.Entity, this.InDocument.Namespace);
                                            }
                                        }
                                    }
                                }
                                else
                                {
                                    addEntityReference(this.Entity, this.InDocument.Namespace);
                                }

                                var constantEntity = this.Ctx.Corpus.MakeObject<CdmConstantEntityDefinition>(CdmObjectType.ConstantEntityDef);
                                constantEntity.EntityShape = this.Ctx.Corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, "entityGroupSet", true);
                                constantEntity.ConstantValues = entReferences.Select((entRef, idx) => new List<string> { entRef, attReferences[idx] }).ToList();
                                var traitParam = this.Ctx.Corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, constantEntity, false);
                                reqdTrait.ParameterValues.SetParameterValue(resOpt, "entityReferences", traitParam);
                            }
                        }
                    }

                    // a 'structured' directive wants to keep all entity attributes together in a group
                    if (arc.ResOpt.Directives?.Has("structured") == true)
                    {
                        // make one resolved attribute with a name from this entityAttribute that contains the set 
                        // of atts we just put together. 
                        ResolvedAttribute raSub = new ResolvedAttribute(arc.TraitsToApply.ResOpt, rasb.ResolvedAttributeSet, this.Name, underAtt);
                        if (relInfo.IsArray)
                        {
                            // put a resolved trait on this att group, hope I never need to do this again and then need to make a function for this
                            CdmTraitReference tr = this.Ctx.Corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "is.linkedEntity.array", true);
                            var t = tr.FetchObjectDefinition<CdmTraitDefinition>(resOpt);
                            ResolvedTrait rt = new ResolvedTrait(t, null, new List<dynamic>(), new List<bool>());
                            raSub.ResolvedTraits = raSub.ResolvedTraits.Merge(rt, true);
                        }
                        int depth = rasb.ResolvedAttributeSet.DepthTraveled;
                        rasb = new ResolvedAttributeSetBuilder();
                        rasb.ResolvedAttributeSet.AttributeContext = raSub.AttCtx; // this got set to null with the new builder
                        rasb.OwnOne(raSub);
                        rasb.ResolvedAttributeSet.DepthTraveled = depth;
                    }
                }
            }

            // how ever they got here, mark every attribute from this entity attribute as now being 'owned' by this entityAtt
            rasb.ResolvedAttributeSet.SetAttributeOwnership(this.Name);
            rasb.ResolvedAttributeSet.DepthTraveled += 1;

            return rasb;
        }

        // the only thing we need this code for is testing!!!
        [Obsolete("For internal use only.")]
        public override ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }
            else
            {
                // need to copy so that relationship depth of parent is not overwritten
                resOpt = resOpt.Copy();
            }

            ResolvedTraitSet rtsThisAtt = this.FetchResolvedTraits(resOpt);
            CdmAttributeResolutionGuidance resGuide = this.ResolutionGuidance;

            // this context object holds all of the info about what needs to happen to resolve these attributes
            AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuide, rtsThisAtt);

            RelationshipInfo relInfo = arc.GetRelationshipInfo();
            if (relInfo.IsByRef && !relInfo.IsArray)
            {
                {
                    // only place this is used, so logic here instead of encapsulated. 
                    // make a set and the one ref it will hold
                    ResolvedEntityReferenceSet rers = new ResolvedEntityReferenceSet(resOpt);
                    ResolvedEntityReference rer = new ResolvedEntityReference();
                    // referencing attribute(s) come from this attribute
                    rer.Referencing.ResolvedAttributeSetBuilder.MergeAttributes(this.FetchResolvedAttributes(resOpt, null));
                    Func<CdmEntityReference, ResolvedEntityReferenceSide> resolveSide = entRef =>
                    {
                        ResolvedEntityReferenceSide sideOther = new ResolvedEntityReferenceSide(null, null);
                        if (entRef != null)
                        {
                            // reference to the other entity, hard part is the attribue name.
                            // by convention, this is held in a trait that identifies the key
                            sideOther.Entity = entRef.FetchObjectDefinition<CdmEntityDefinition>(resOpt);
                            if (sideOther.Entity != null)
                            {
                                CdmAttribute otherAttribute;
                                ResolveOptions otherOpts = new ResolveOptions { WrtDoc = resOpt.WrtDoc, Directives = resOpt.Directives };
                                ResolvedTrait t = entRef.FetchResolvedTraits(otherOpts).Find(otherOpts, "is.identifiedBy");
                                if (t?.ParameterValues?.Length > 0)
                                {
                                    dynamic otherRef = (t.ParameterValues.FetchParameterValueByName("attribute").Value);
                                    if (typeof(CdmObject).IsAssignableFrom(otherRef?.GetType()))
                                    {
                                        otherAttribute = (otherRef as CdmObject).FetchObjectDefinition<CdmObjectDefinition>(otherOpts) as CdmAttribute;
                                        if (otherAttribute != null)
                                        {
                                            ResolvedAttributeSet resolvedAttributeSet = sideOther.Entity.FetchResolvedAttributes(otherOpts);
                                            if (resolvedAttributeSet != null)
                                                sideOther.ResolvedAttributeSetBuilder.OwnOne(resolvedAttributeSet.Get(otherAttribute.GetName()).Copy());
                                        }
                                    }
                                }
                            }
                        }

                        return sideOther;
                    };

                    // either several or one entity
                    // for now, a sub for the 'select one' idea
                    if (this.Entity.ExplicitReference != null)
                    {
                        CdmEntityDefinition entPickFrom = this.Entity.FetchObjectDefinition<CdmEntityDefinition>(resOpt);
                        CdmCollection<CdmAttributeItem> attsPick = entPickFrom.Attributes;
                        if (attsPick != null && attsPick != null)
                        {
                            for (int i = 0; i < attsPick.Count; i++)
                            {
                                if (attsPick[i].ObjectType == CdmObjectType.EntityAttributeDef)
                                {
                                    CdmEntityReference er = (attsPick[i] as CdmEntityAttributeDefinition).Entity;
                                    rer.Referenced.Add(resolveSide(er));
                                }
                            }
                        }
                    }
                    else
                    {
                        rer.Referenced.Add(resolveSide(this.Entity));
                    }

                    rers.Set.Add(rer);
                    return rers;
                }
            }
            return null;
        }
    }
}
