// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using System;
    public interface CdmContainerDefinition : CdmObject
    {
        /// <summary>
        /// The namespace where this object can be found.
        /// </summary>
        [Obsolete("Only for internal use")]
        string Namespace { get; set; }

        /// <summary>
        /// The folder where this object exists.
        /// </summary>
        [Obsolete("Only for internal use")]
        string FolderPath { get; set; }
    }
}
