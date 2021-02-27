// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    /// <summary>
    /// Operation IncludeAttributes persistence
    /// </summary>
    public class OperationIncludeAttributesPersistence
    {
        public static CdmOperationIncludeAttributes FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationIncludeAttributes includeAttributesOp = OperationBasePersistence.FromData<CdmOperationIncludeAttributes>(ctx, CdmObjectType.OperationIncludeAttributesDef, obj);
            includeAttributesOp.IncludeAttributes = obj["includeAttributes"]?.ToObject<List<string>>();

            return includeAttributesOp;
        }

        public static OperationIncludeAttributes ToData(CdmOperationIncludeAttributes instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationIncludeAttributes obj = OperationBasePersistence.ToData<OperationIncludeAttributes>(instance, resOpt, options);
            obj.IncludeAttributes = instance.IncludeAttributes;

            return obj;
        }
    }
}
