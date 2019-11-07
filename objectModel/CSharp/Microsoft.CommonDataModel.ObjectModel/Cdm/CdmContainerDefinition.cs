//-----------------------------------------------------------------------
// <copyright file="CdmEntityDef.cs" company="Microsoft">
//      All rights reserved.
// </copyright>
//-----------------------------------------------------------------------

using System;

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    public interface CdmContainerDefinition : CdmObject
    {
        /// <summary>
        /// The namespace where this object can be found
        /// </summary>
        [Obsolete("Only for internal use")]
        string Namespace { get; set; }

        /// <summary>
        /// The folder where this object exists
        /// </summary>
        [Obsolete("Only for internal use")]
        string FolderPath { get; set; }
    }
}
