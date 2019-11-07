//-----------------------------------------------------------------------
// <copyright file="CdmEntityAttributeDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class CdmEntityAttributeDefinition : CdmAttribute
    {
        /// <summary>
        /// Gets or sets the entity attribute entity reference.
        /// </summary>
        public CdmEntityReference Entity { get; set; }

        public CdmEntityAttributeDefinition(CdmCorpusContext ctx, string name)
            : base(ctx, name)
        {
            this.ObjectType = CdmObjectType.EntityAttributeDef;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.EntityAttributeDef;
        }

        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return false;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmEntityAttributeDefinition>(this, resOpt, options);
        }

        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            CdmEntityAttributeDefinition copy = new CdmEntityAttributeDefinition(this.Ctx, this.Name)
            {
                Entity = (CdmEntityReference)this.Entity.Copy(resOpt)
            };
            this.CopyAtt(resOpt, copy);
            return copy;
        }

        public override bool Validate()
        {
            return !string.IsNullOrEmpty(this.Name) && this.Entity != null;
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            string path = this.DeclaredPath;
            if (string.IsNullOrEmpty(path))
            {
                path = pathFrom + this.Name;
                this.DeclaredPath = path;
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

        private RelationshipInfo GetRelationshipInfo(ResolveOptions resOpt, AttributeResolutionContext arc)
        {
            ResolvedTraitSet rts = null;
            bool hasRef = false;
            bool isByRef = false;
            bool isArray = false;
            bool selectsOne = false;
            int? nextDepth = null;
            bool maxDepthExceeded = false;

            if (arc != null && arc.ResGuide != null)
            {
                if (arc.ResGuide.entityByReference != null && arc.ResGuide.entityByReference.allowReference == true)
                    hasRef = true;
                if (arc.ResOpt.Directives != null)
                {
                    // based on directives
                    if (hasRef)
                        isByRef = arc.ResOpt.Directives.Has("referenceOnly");
                    selectsOne = arc.ResOpt.Directives.Has("selectOne");
                    isArray = arc.ResOpt.Directives.Has("isArray");
                }
                // figure out the depth for the next level
                int? oldDepth = resOpt.RelationshipDepth;
                nextDepth = oldDepth;
                // if this is a 'selectone', then skip counting this entity in the depth, else count it
                if (!selectsOne)
                {
                    // if already a ref, who cares?
                    if (!isByRef)
                    {
                        if (nextDepth == null)
                            nextDepth = 1;
                        else
                            nextDepth++;

                        // max comes from settings but may not be set
                        int maxDepth = 2;
                        if (hasRef && arc.ResGuide.entityByReference.referenceOnlyAfterDepth != null)
                            maxDepth = (int)arc.ResGuide.entityByReference.referenceOnlyAfterDepth;

                        if (nextDepth > maxDepth)
                        {
                            // don't do it
                            isByRef = true;
                            maxDepthExceeded = true;
                        }
                    }
                }
            }

            return new RelationshipInfo
            {
                Rts = rts,
                IsByRef = isByRef,
                IsArray = isArray,
                SelectsOne = selectsOne,
                NextDepth = nextDepth,
                MaxDepthExceeded = maxDepthExceeded
            };
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            // // get from purpose 
            if (this.Purpose != null)
                rtsb.TakeReference(this.Purpose.FetchResolvedTraits(resOpt));

            this.AddResolvedTraitsApplied(rtsb, resOpt);
            //rtsb.CleanUp();
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the entity used as an attribute, traits applied to that entity,
            // the purpose of the attribute, any traits applied to the attribute.
            ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
            CdmEntityReference ctxEnt = this.Entity as CdmEntityReference;
            CdmAttributeContext underAtt = (CdmAttributeContext)under;
            AttributeContextParameters acpEnt = null;
            if (underAtt != null)
            {
                // make a context for this attreibute that holds the attributes that come up from the entity
                acpEnt = new AttributeContextParameters
                {
                    under = underAtt,
                    type = CdmAttributeContextType.Entity,
                    Name = ctxEnt.FetchObjectDefinitionName(),
                    Regarding = ctxEnt,
                    IncludeTraits = true
                };
            }

            ResolvedTraitSet rtsThisAtt = this.FetchResolvedTraits(resOpt);

            // this context object holds all of the info about what needs to happen to resolve these attributes.
            // make a copy and add defaults if missing
            CdmAttributeResolutionGuidance resGuideWithDefault;
            if (this.ResolutionGuidance != null)
                resGuideWithDefault = (CdmAttributeResolutionGuidance)this.ResolutionGuidance.Copy(resOpt);
            else
                resGuideWithDefault = new CdmAttributeResolutionGuidance(this.Ctx);
            resGuideWithDefault.UpdateAttributeDefaults(this.Name);

            AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuideWithDefault, rtsThisAtt);

            // complete cheating but is faster.
            // this purpose will remove all of the attributes that get collected here, so dumb and slow to go get them
            RelationshipInfo relInfo = this.GetRelationshipInfo(arc.ResOpt, arc);
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
                    CdmCollection<CdmAttributeItem> attsPick = entPickFrom?.GetAttributeDefinitions();
                    if (entPickFrom != null && attsPick != null)
                    {
                        for (int i = 0; i < attsPick.Count; i++)
                        {
                            if (attsPick.AllItems[i].ObjectType == CdmObjectType.EntityAttributeDef)
                            {
                                // a table within a table. as expected with a selectsOne attribute
                                // since this is by ref, we won't get the atts from the table, but we do need the traits that hold the key
                                // these are the same contexts that would get created if we recursed
                                // first this attribute
                                AttributeContextParameters acpEntAtt = new AttributeContextParameters
                                {
                                    under = under,
                                    type = CdmAttributeContextType.AttributeDefinition,
                                    Name = attsPick.AllItems[i].FetchObjectDefinitionName(),
                                    Regarding = attsPick.AllItems[i],
                                    IncludeTraits = true
                                };
                                CdmAttributeContext pickUnder = rasb.ResolvedAttributeSet.CreateAttributeContext(resOpt, acpEntAtt);
                                CdmEntityReference pickEnt = (attsPick.AllItems[i] as CdmEntityAttributeDefinition).Entity as CdmEntityReference;
                                AttributeContextParameters acpEntAttEnt = new AttributeContextParameters
                                {
                                    under = pickUnder,
                                    type = CdmAttributeContextType.Entity,
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
                if (relInfo.MaxDepthExceeded)
                {
                    if (arc.ResOpt.Directives == null)
                        arc.ResOpt.Directives = new AttributeResolutionDirectiveSet();
                    arc.ResOpt.Directives.Add("referenceOnly");
                }
            }
            else
            {
                ResolveOptions resLink = CopyResolveOptions(resOpt);
                resLink.SymbolRefSet = resOpt.SymbolRefSet;
                resLink.RelationshipDepth = relInfo.NextDepth;
                rasb.MergeAttributes((this.Entity as CdmEntityReference).FetchResolvedAttributes(resLink, acpEnt));
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
                    var reqdTrait = att.ResolvedTraits.Find(resOpt, "is.linkedEntity.identifier");
                    if (reqdTrait == null)
                    {
                        continue;
                    }

                    if (reqdTrait.ParameterValues == null || reqdTrait.ParameterValues.Length == 0)
                    {
                        Logger.Warning(nameof(CdmEntityAttributeDefinition), this.Ctx as ResolveContext, "is.linkedEntity.identifier does not support arguments");
                        continue;
                    }

                    var entReferences = new List<string>();
                    var attReferences = new List<string>();
                    Action<CdmEntityReference, string> addEntityReference = (CdmEntityReference entRef, string nameSpace) =>
                        {
                            var entDef = entRef.FetchObjectDefinition<CdmEntityDefinition>(resOpt);
                            var identifyingTrait = entRef.FetchResolvedTraits(resOpt).Find(resOpt, "is.identifiedBy");
                            if (identifyingTrait != null && entDef != null)
                            {
                                var attRef = identifyingTrait.ParameterValues.FetchParameterValueByName("attribute").Value;
                                string attNamePath = ((CdmObjectReferenceBase)attRef).NamedReference;
                                string attName = attNamePath.Split('/').Last();                                // path should be absolute and without a namespace
                                string relativeEntPath = Ctx.Corpus.Storage.CreateAbsoluteCorpusPath(entDef.AtCorpusPath, entDef.InDocument);
                                if (relativeEntPath.StartsWith($"{nameSpace}:"))
                                {
                                    relativeEntPath = relativeEntPath.Substring(nameSpace.Length + 1);
                                }
                                entReferences.Add(relativeEntPath);
                                attReferences.Add(attName);
                            }
                        };
                    if (relInfo.SelectsOne)
                    {
                        var entPickFrom = (this.Entity as CdmEntityReference).FetchObjectDefinition<CdmEntityDefinition>(resOpt) as CdmEntityDefinition;
                        var attsPick = entPickFrom?.GetAttributeDefinitions()?.Cast<CdmObject>().ToList();
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

            // a 'structured' directive wants to keep all entity attributes together in a group
            if (arc.ResOpt.Directives?.Has("structured") == true)
            {
                ResolvedAttribute raSub = new ResolvedAttribute(rtsThisAtt.ResOpt, rasb.ResolvedAttributeSet, this.Name, (CdmAttributeContext)rasb.ResolvedAttributeSet.AttributeContext);
                if (relInfo.IsArray)
                {
                    // put a resolved trait on this att group, yuck, hope I never need to do this again and then need to make a function for this
                    CdmTraitReference tr = this.Ctx.Corpus.MakeObject<CdmTraitReference>(CdmObjectType.TraitRef, "is.linkedEntity.array", true);
                    var t = tr.FetchObjectDefinition<CdmTraitDefinition>(resOpt);
                    ResolvedTrait rt = new ResolvedTrait(t, null, new List<dynamic>(), new List<bool>());
                    raSub.ResolvedTraits = raSub.ResolvedTraits.Merge(rt, true);
                }
                rasb = new ResolvedAttributeSetBuilder();
                rasb.OwnOne(raSub);
            }

            return rasb;
        }

        // the only thing we need this code for is testing!!!
        public override ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            ResolvedTraitSet rtsThisAtt = this.FetchResolvedTraits(resOpt);
            CdmAttributeResolutionGuidance resGuide = (CdmAttributeResolutionGuidance)this.ResolutionGuidance;

            // this context object holds all of the info about what needs to happen to resolve these attributes
            AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuide, rtsThisAtt);

            RelationshipInfo relInfo = this.GetRelationshipInfo(resOpt, arc);
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
                                            sideOther.ResolvedAttributeSetBuilder.OwnOne(sideOther.Entity.FetchResolvedAttributes(otherOpts).Get(otherAttribute.GetName()).Copy());
                                        }
                                    }
                                }
                            }
                        }

                        return sideOther;
                    };

                    // either several or one entity
                    // for now, a sub for the 'select one' idea
                    if ((this.Entity as CdmEntityReference).ExplicitReference != null)
                    {
                        CdmEntityDefinition entPickFrom = (this.Entity as CdmEntityReference).FetchObjectDefinition<CdmEntityDefinition>(resOpt);
                        CdmCollection<CdmAttributeItem> attsPick = entPickFrom.GetAttributeDefinitions();
                        if (attsPick != null && attsPick != null)
                        {
                            for (int i = 0; i < attsPick.Count; i++)
                            {
                                if (attsPick.AllItems[i].ObjectType == CdmObjectType.EntityAttributeDef)
                                {
                                    CdmEntityReference er = (attsPick.AllItems[i] as CdmEntityAttributeDefinition).Entity;
                                    rer.Referenced.Add(resolveSide(er));
                                }
                            }
                        }
                    }
                    else
                    {
                        rer.Referenced.Add(resolveSide(this.Entity as CdmEntityReference));
                    }

                    rers.Set.Add(rer);
                    return rers;
                }
            }
            return null;
        }
    }
}
