// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public class CdmParameterDefinition : CdmObjectDefinitionBase
    {
        private static readonly string Tag = nameof(CdmParameterDefinition);

        /// <summary>
        /// Gets or sets the parameter name.
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets the parameter default value.
        /// </summary>
        public dynamic DefaultValue { get; set; }

        /// <summary>
        /// Gets or sets whether the parameter is required.
        /// </summary>
        public bool Required { get; set; }

        /// <summary>
        /// Gets or sets the parameter data type reference.
        /// </summary>
        public CdmDataTypeReference DataTypeRef { get; set; }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.Name;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt = null)
        {
            return false;
        }

        internal CdmDataTypeReference GetDataTypeRef()
        {
            return this.DataTypeRef;
        }

        /// <summary>
        /// Constructs a CdmParameterDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="name">The parameter name.</param>
        public CdmParameterDefinition(CdmCorpusContext ctx, string name)
            : base(ctx)
        {
            this.Name = name;
            this.ObjectType = CdmObjectType.ParameterDef;
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

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmParameterDefinition copy;
            if (host == null)
            {
                copy = new CdmParameterDefinition(this.Ctx, this.Name);
            }
            else
            {
                copy = host as CdmParameterDefinition;
                copy.Ctx = this.Ctx;
                copy.Name = this.Name;
            }

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
            copy.DataTypeRef = this.DataTypeRef?.Copy(resOpt) as CdmDataTypeReference;
            return copy;
        }

        /// <inheritdoc />
        public override bool Validate()
        {
            if (string.IsNullOrWhiteSpace(this.Name))
            {
                IEnumerable<string> missingFields = new List<string> { "Name" };
                Logger.Error(this.Ctx, Tag, nameof(Validate), this.AtCorpusPath, CdmLogCode.ErrValdnIntegrityCheckFailure, this.AtCorpusPath, string.Join(", ", missingFields.Select((s) =>$"'{s}'")));

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
                    path = pathFrom + this.Name;
                    this.DeclaredPath = path;
                }
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
