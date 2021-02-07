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
    /// Operation ExcludeAttributes persistence
    /// </summary>
    public class OperationExcludeAttributesPersistence
    {
        public static CdmOperationExcludeAttributes FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationExcludeAttributes excludeAttributesOp = OperationBasePersistence.FromData<CdmOperationExcludeAttributes>(ctx, CdmObjectType.OperationExcludeAttributesDef, obj);
            excludeAttributesOp.ExcludeAttributes = obj["excludeAttributes"]?.ToObject<List<string>>();

            return excludeAttributesOp;
        }

        public static OperationExcludeAttributes ToData(CdmOperationExcludeAttributes instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationExcludeAttributes obj = OperationBasePersistence.ToData<OperationExcludeAttributes>(instance, resOpt, options);
            obj.ExcludeAttributes = instance.ExcludeAttributes;

            return obj;
        }
    }
}
