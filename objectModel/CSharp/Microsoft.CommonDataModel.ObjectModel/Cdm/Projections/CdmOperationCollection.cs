// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Cdm
{
    using Microsoft.CommonDataModel.ObjectModel.Enums;

    /// <summary>
    /// Collection of operations
    /// </summary>
    public class CdmOperationCollection : CdmCollection<CdmOperationBase>
    {
        public CdmOperationCollection(CdmCorpusContext ctx, CdmObject owner)
            : base(ctx, owner, CdmObjectType.Error)
        {

        }

        public new CdmOperationBase Add(CdmOperationBase operation)
        {
            return base.Add(operation);
        }

        public new bool Remove(CdmOperationBase operation)
        {
            return base.Remove(operation);
        }
    }
}
