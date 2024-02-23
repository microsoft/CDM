// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Storage
{
    public class CdmStandardsAdapter : CdmCustomPackageAdapter
    {
        private static string cdmStandardsPackageName = "Microsoft.CommonDataModel.ObjectModel.Adapter.CdmStandards";

        public CdmStandardsAdapter()
            : base(cdmStandardsPackageName)
        {
        }

        public override string FetchConfig()
        {
            return "{\"config\":{},\"type\":\"cdm-standards\"}";
        }
    }
}
