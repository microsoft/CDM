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

    public class CdmDataTypeDefinition : CdmObjectDefinitionBase
    {
        private static readonly string Tag = nameof(CdmDataTypeDefinition);
        /// <summary>
        /// Gets or sets the data type name.
        /// </summary>
        public string DataTypeName { get; set; }

        /// <summary>
        /// Gets or sets the data type extended by this data type.
        /// </summary>
        public CdmDataTypeReference ExtendsDataType { get; set; }

        /// <inheritdoc />
        public override string GetName()
        {
            return this.DataTypeName;
        }

        internal CdmDataTypeReference ExtendsDataTypeRef
        {
            get
            {
                return this.ExtendsDataType;
            }
        }

        /// <summary>
        /// Constructs a CdmDataTypeDefinition.
        /// </summary>
        /// <param name="ctx">The context.</param>
        /// <param name="dataTypeName">The data type name.</param>
        /// <param name="extendsDataType">The data type extended by this data type.</param>
        public CdmDataTypeDefinition(CdmCorpusContext ctx, string dataTypeName, CdmDataTypeReference extendsDataType = null)
            : base(ctx)
        {
            this.ObjectType = CdmObjectType.DataTypeDef;
            this.DataTypeName = dataTypeName;
            this.ExtendsDataType = extendsDataType;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.DataTypeDef;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmDataTypeDefinition>(this, resOpt, options);
        }

        /// <inheritdoc />
        public override CdmObject Copy(ResolveOptions resOpt = null, CdmObject host = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            CdmDataTypeDefinition copy;
            if (host == null)
            {
                copy = new CdmDataTypeDefinition(this.Ctx, this.DataTypeName, null);
            }
            else
            {
                copy = host as CdmDataTypeDefinition;
                copy.Ctx = this.Ctx;
                copy.DataTypeName = this.DataTypeName;
            }

            copy.ExtendsDataType = (CdmDataTypeReference)this.ExtendsDataType?.Copy(resOpt);

            this.CopyDef(resOpt, copy);
            return copy;
        }

        /// <inheritdoc />  
        public override bool Validate()
        {
            if (string.IsNullOrEmpty(this.DataTypeName))
            {
                IEnumerable<string> missingFields = new List<string> { "DataTypeName" };
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
                    path = pathFrom + this.DataTypeName;
                    this.DeclaredPath = path;
                }
            }
            //trackVisits(path);

            if (preChildren?.Invoke(this, path) == true)
                return false;
            if (this.ExtendsDataType != null) this.ExtendsDataType.Owner = this;
            if (this.ExtendsDataType?.Visit(path + "/extendsDataType/", preChildren, postChildren) == true)
                return true;
            if (this.VisitDef(path, preChildren, postChildren))
                return true;
            if (postChildren?.Invoke(this, path) == true)
                return true;
            return false;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this, this.Ctx.Corpus.DefaultResolutionDirectives);
            }

            return this.IsDerivedFromDef(resOpt, this.ExtendsDataTypeRef, this.GetName(), baseDef);
        }

        internal override void ConstructResolvedTraits(ResolvedTraitSetBuilder rtsb, ResolveOptions resOpt)
        {
            this.ConstructResolvedTraitsDef(this.ExtendsDataTypeRef, rtsb, resOpt);
            //rtsb.CleanUp();
        }

        internal override ResolvedAttributeSetBuilder ConstructResolvedAttributes(ResolveOptions resOpt, CdmAttributeContext under = null)
        {
            return null;
        }
    }
}
