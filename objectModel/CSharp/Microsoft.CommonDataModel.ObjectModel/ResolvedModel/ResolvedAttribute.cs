//-----------------------------------------------------------------------
// <copyright file="ResolvedAttribute.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------using System;

namespace Microsoft.CommonDataModel.ObjectModel.ResolvedModel
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    internal class ResolvedAttribute
    {
        private TraitToPropertyMap T2pm;
        public dynamic Target { get; set; }
        private string _resolvedName;
        public string previousResolvedName { get; set; }
        public string ResolvedName
        {
            get
            {
                return _resolvedName;

            }
            set
            {
                this._resolvedName = value;
                if (this.previousResolvedName == null)
                    this.previousResolvedName = value;
            }
        }
        internal ResolvedTraitSet ResolvedTraits { get; set; }
        public int InsertOrder { get; set; }
        public CdmAttributeContext AttCtx { get; set; }
        public AttributeResolutionContext Arc { get; set; }
        public ApplierState ApplierState { get; set; }

        public ResolvedAttribute(ResolveOptions resOpt, dynamic target, string defaultName, CdmAttributeContext attCtx)
        {
            this.Target = target;
            this.ResolvedTraits = new ResolvedTraitSet(resOpt);
            this._resolvedName = defaultName;
            this.previousResolvedName = defaultName;
            this.AttCtx = attCtx;
        }

        public ResolvedAttribute Copy()
        {
            ResolveOptions resOpt = this.ResolvedTraits.ResOpt; // use the options from the traits
            ResolvedAttribute copy = new ResolvedAttribute(resOpt, this.Target, this._resolvedName, this.AttCtx)
            {
                ResolvedName = this.ResolvedName,
                ResolvedTraits = this.ResolvedTraits.ShallowCopy(),
                InsertOrder = this.InsertOrder,
                Arc = this.Arc
            };
            if (ApplierState != null)
            {
                copy.ApplierState = ApplierState.Copy();
            }
            return copy;
        }

        public void Spew(ResolveOptions resOpt, StringSpewCatcher to, string indent, bool nameSort)
        {
            to.SpewLine($"{ indent}[{this._resolvedName}]");
            this.ResolvedTraits.Spew(resOpt, to, indent + '-', nameSort);
        }

        public void CompleteContext(ResolveOptions resOpt)
        {
            if (this.AttCtx != null && this.AttCtx.Name == null)
            {
                this.AttCtx.Name = this._resolvedName;
                if (this.Target is CdmAttribute)
                    this.AttCtx.Definition = (this.Target as CdmAttribute).CreateSimpleReference(resOpt);
                this.AttCtx.AtCorpusPath = this.AttCtx.Parent.FetchObjectDefinition<CdmAttributeContext>(resOpt).AtCorpusPath + "/" + this._resolvedName;
            }
        }

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
        }

        public bool? IsNullable
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("isNullable");
            }
        }

        public string DataFormat
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("dataFormat");
            }
        }

        public string SourceName
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("sourceName");
            }
        }

        public int? SourceOrdering
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("sourceOrdering");
            }
        }

        public string DisplayName
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("displayName");
            }
        }

        public string Description
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("description");
            }
        }

        public string MaximumValue
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("maximumValue");
            }
        }

        public string MinimumValue
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("minimumValue");
            }
        }

        public int? MaximumLength
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("maximumLength");
            }
        }

        public bool? ValueConstrainedToList
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("valueConstrainedToList");
            }
        }

        public dynamic DefaultValue
        {
            get
            {
                return this.TraitToPropertyMap.FetchPropertyValue("defaultValue");
            }
        }

        public int CreationSequence
        {
            get
            {
                return this.InsertOrder;
            }
        }

        TraitToPropertyMap TraitToPropertyMap
        {
            get
            {
                if (this.T2pm == null)
                    this.T2pm = new TraitToPropertyMap((this.Target as CdmObject));
                return this.T2pm;
            }
        }
    }
}
