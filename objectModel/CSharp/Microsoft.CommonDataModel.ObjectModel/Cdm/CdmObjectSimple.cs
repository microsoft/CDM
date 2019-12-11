//-----------------------------------------------------------------------
// <copyright file="CdmObjectSimple.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Utilities;

    abstract public class CdmObjectSimple : CdmObjectBase
    {
        public CdmObjectSimple(CdmCorpusContext ctx)
            : base(ctx)
        {

        }

        /// <inheritdoc />
        public override string FetchObjectDefinitionName()
        {
            return null;
        }

        /// <inheritdoc />
        public override T FetchObjectDefinition<T>(ResolveOptions resOpt = null) 
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return default(T);
        }

        /// <inheritdoc />
        public override CdmObjectReference CreateSimpleReference(ResolveOptions resOpt = null)
        {
            if (resOpt == null)
            {
                resOpt = new ResolveOptions(this);
            }

            return null;
        }

        /// <inheritdoc />
        public override bool IsDerivedFrom(string baseDef, ResolveOptions resOpt)
        {
            return false;
        }
    }
}
