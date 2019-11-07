//-----------------------------------------------------------------------
// <copyright file="CdmTypeAttributeDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.ResolvedModel;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmTypeAttributeDefinition : CdmAttribute
    {
        public CdmDataTypeReference DataType { get; set; }
        public CdmAttributeContextReference AttributeContext { get; set; }

        public bool? IsPrimaryKey
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("isPrimaryKey");
            }
        }

        public bool? IsReadOnly
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("isReadOnly");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("isReadOnly", value);
            }
        }

        public bool? IsNullable
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("isNullable");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("isNullable", value);
            }
        }

        public CdmDataFormat DataFormat
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("dataFormat");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("dataFormat", value);
            }
        }

        public string SourceName
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("sourceName");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("sourceName", value);
            }
        }

        public int? SourceOrdering
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("sourceOrdering");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("sourceOrdering", value);
            }
        }

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

        public string MaximumValue
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("maximumValue");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("maximumValue", value);
            }
        }

        public string MinimumValue
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("minimumValue");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("minimumValue", value);
            }
        }

        public int? MaximumLength
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("maximumLength");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("maximumLength", value);
            }
        }

        public bool? ValueConstrainedToList
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("valueConstrainedToList");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("valueConstrainedToList", value);
            }
        }

        public dynamic DefaultValue
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("defaultValue");
            }
            set
            {
                this.TraitToPropertyMap.UpdatePropertyValue("defaultValue", value);
            }
        }

        internal dynamic GetProperty(string propertyName)
        {
            return this.TraitToPropertyMap.FetchPropertyValue(propertyName, true);
        }

        private TraitToPropertyMap TraitToPropertyMap { get; }

        public CdmTypeAttributeDefinition(CdmCorpusContext ctx, string name)
            : base(ctx, name)
        {
            this.ObjectType = CdmObjectType.TypeAttributeDef;
            this.TraitToPropertyMap = new TraitToPropertyMap(this);
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.TypeAttributeDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmTypeAttributeDefinition>(this, resOpt, options);
        }

        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            CdmTypeAttributeDefinition copy = new CdmTypeAttributeDefinition(this.Ctx, this.Name)
            {
                DataType = (CdmDataTypeReference)this.DataType?.Copy(resOpt),
                AttributeContext = (CdmAttributeContextReference)this.AttributeContext?.Copy(resOpt)
            };
            this.CopyAtt(resOpt, copy);
            return copy;
        }

        public override bool Validate()
        {
            return !string.IsNullOrEmpty(this.Name);
        }


        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return false;
        }

        internal CdmDataTypeReference GetDataTypeRef()
        {
            return this.DataType;
        }

        internal CdmDataTypeReference SetDataTypeRef(CdmDataTypeReference dataType)
        {
            this.DataType = dataType as CdmDataTypeReference;
            return dataType;
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

            if (preChildren?.Invoke(this, path) == true)
                return false;
            if (this.DataType?.Visit(path + "/dataType/", preChildren, postChildren) == true)
                return true;
            if (this.AttributeContext?.Visit(path + "/attributeContext/", preChildren, postChildren) == true)
                return true;
            if (this.VisitAtt(path, preChildren, postChildren))
                return true;
            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            // // get from datatype
            if (this.DataType != null)
                rtsb.TakeReference(this.GetDataTypeRef().FetchResolvedTraits(resOpt));
            // // get from purpose
            if (this.Purpose != null)
                rtsb.MergeTraits(this.Purpose.FetchResolvedTraits(resOpt));

            this.AddResolvedTraitsApplied(rtsb, resOpt);

            // special case for attributes, replace a default "this.attribute" with this attribute on traits that elevate attribute
            if (rtsb.ResolvedTraitSet?.HasElevated == true)
            {
                CdmAttributeReference replacement = new CdmAttributeReference(this.Ctx, this.Name, true)
                {
                    Ctx = this.Ctx,
                    ExplicitReference = this
                };
                rtsb.ReplaceTraitParameterValue(resOpt, "does.elevateAttribute", "attribute", "this.attribute", replacement);
            }
            //rtsb.CleanUp();
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            // find and cache the complete set of attributes
            // attributes definitions originate from and then get modified by subsequent re-defintions from (in this order):
            // the datatype used as an attribute, traits applied to that datatype,
            // the purpose of the attribute, dynamic traits applied to the attribute.
            ResolvedAttributeSetBuilder rasb = new ResolvedAttributeSetBuilder();
            rasb.ResolvedAttributeSet.AttributeContext = under;

            // add this attribute to the set
            // make a new one and apply dynamic traits
            ResolvedAttribute newAtt = new ResolvedAttribute(resOpt, this, this.Name, under as CdmAttributeContext);
            rasb.OwnOne(newAtt);

            ResolvedTraitSet rts = this.FetchResolvedTraits(resOpt);
            // this context object holds all of the info about what needs to happen to resolve these attribute
            // make a copy and add defaults if missing
            CdmAttributeResolutionGuidance resGuideWithDefault;
            if (this.ResolutionGuidance != null)
                resGuideWithDefault = (CdmAttributeResolutionGuidance)this.ResolutionGuidance.Copy(resOpt);
            else
                resGuideWithDefault = new CdmAttributeResolutionGuidance(this.Ctx);
            resGuideWithDefault.UpdateAttributeDefaults(null);
            AttributeResolutionContext arc = new AttributeResolutionContext(resOpt, resGuideWithDefault, rts);

            // from the traits of the datatype, purpose and applied here, see if new attributes get generated
            rasb.ApplyTraits(arc);
            rasb.GenerateApplierAttributes(arc, false); // false = don't apply these traits to added things
            // this may have added symbols to the dependencies, so merge them
            resOpt.SymbolRefSet.Merge(arc.ResOpt.SymbolRefSet);

            return rasb;
        }

        public override ResolvedEntityReferenceSet FetchResolvedEntityReferences(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return null;
        }
    }
}
