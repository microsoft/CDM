//-----------------------------------------------------------------------
// <copyright file="CdmParameterDefinition.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmParameterDefinition : CdmObjectDefinitionBase
    {
        /// <summary>
        /// Gets or sets the parameter name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the parameter default value.
        /// </summary>
        public dynamic DefaultValue { get; set; }

        /// <summary>
        /// Gets or sets if the parameter is required.
        /// </summary>
        public bool Required { get; set; }

        /// <summary>
        /// Gets or sets the parameter data type reference.
        /// </summary>
        public CdmDataTypeReference DataTypeRef { get; set; }

        public override string GetName()
        {
            return this.Name;
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
            return this.DataTypeRef;
        }

        public CdmParameterDefinition(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.Name = name;
            this.ObjectType = CdmObjectType.ParameterDef;
            this.AtCorpusPath = "";
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.ParameterDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmParameterDefinition>(this, resOpt, options);
        }
        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            CdmParameterDefinition copy = new CdmParameterDefinition(this.Ctx, this.Name);

            dynamic defVal = null;
            if (this.DefaultValue != null)
            {
                if (this.DefaultValue is string)
                    defVal = this.DefaultValue;
                else
                    defVal = ((CdmObject)this.DefaultValue).Copy(resOpt);
            }
            copy.Explanation = this.Explanation;
            copy.DefaultValue = defVal;
            copy.Required = this.Required;
            copy.DataTypeRef = (this.DataTypeRef != null ? this.DataTypeRef.Copy(resOpt) : null) as CdmDataTypeReference;
            return copy;
        }
        public override bool Validate()
        {
            return !string.IsNullOrEmpty(this.Name);
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
            if (this.DefaultValue != null)
            {
                Type defaultValueType = this.DefaultValue.GetType();

                if ((this.DefaultValue is CdmObject) && (this.DefaultValue as CdmObject).Visit(path + "/defaultValue/", preChildren, postChildren))
                    return true;
            }

            if (this.DataTypeRef != null)
                if (this.DataTypeRef.Visit(path + "/dataType/", preChildren, postChildren))
                    return true;
            if (postChildren != null && postChildren.Invoke(this, path))
                return true;
            return false;
        }
    }

}
