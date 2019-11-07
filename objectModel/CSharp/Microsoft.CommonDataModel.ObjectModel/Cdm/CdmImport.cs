//-----------------------------------------------------------------------
// <copyright file="CdmImport.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------
namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;

    public class CdmImport : CdmObjectSimple
    {
        
        internal CdmDocumentDefinition Doc { get; set; }

        /// <summary>
        /// Gets or sets the import path.
        /// </summary>
        public string CorpusPath { get; set; }

        /// <summary>
        /// Gets or sets the import moniker.
        /// </summary>
        public string Moniker { get; set; }

        public CdmImport(CdmCorpusContext ctx, string corpusPath, string moniker)
            : base(ctx)
        {
            this.CorpusPath = corpusPath;
            this.Moniker = moniker;
            this.ObjectType = CdmObjectType.Import;
        }

        [Obsolete]
        public override CdmObjectType GetObjectType()
        {
            return CdmObjectType.Import;
        }

        [Obsolete("CopyData is deprecated. Please use the Persistence Layer instead.")]
        public override dynamic CopyData(ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectBase.CopyData<CdmImport>(this, resOpt, options);
        }

        public override CdmObject Copy(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            CdmImport copy = new CdmImport(this.Ctx, this.CorpusPath, this.Moniker);
            copy.Doc = this.Doc;
            return copy;
        }

        public override bool Validate()
        {
            return !string.IsNullOrEmpty(this.CorpusPath);
        }

        [Obsolete("InstanceFromData is deprecated. Please use the Persistence Layer instead.")]
        public static CdmImport InstanceFromData(CdmCorpusContext ctx, Import import)
        {
            return CdmObjectBase.InstanceFromData<CdmImport, Import>(ctx, import);
        }

        /// <inheritdoc />
        public override bool Visit(string pathFrom, VisitCallback preChildren, VisitCallback postChildren)
        {
            if (preChildren != null && preChildren.Invoke(this, pathFrom))
                return false;
            if (postChildren != null && postChildren.Invoke(this, pathFrom))
                return true;
            return false;
        }

        // Returns the document that has been resolved for this import.
        internal CdmDocumentDefinition ResolvedDocument
        {
             get
             {
                 return this.Doc;
             }
        }
    }
}
