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
    /// Operation CombineAttributes persistence
    /// </summary>
    public class OperationCombineAttributesPersistence
    {
        public static CdmOperationCombineAttributes FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationCombineAttributes combineAttributesOp = OperationBasePersistence.FromData<CdmOperationCombineAttributes>(ctx, CdmObjectType.OperationCombineAttributesDef, obj);
            combineAttributesOp.Select = obj["select"]?.ToObject<List<string>>();
            combineAttributesOp.MergeInto = Utils.CreateAttribute(ctx, obj["mergeInto"]) as CdmTypeAttributeDefinition;

            return combineAttributesOp;
        }

        public static OperationCombineAttributes ToData(CdmOperationCombineAttributes instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationCombineAttributes obj = OperationBasePersistence.ToData<OperationCombineAttributes>(instance, resOpt, options);
            obj.Select = instance.Select;
            obj.MergeInto = Utils.JsonForm(instance.MergeInto, resOpt, options);

            return obj;
        }
    }
}
