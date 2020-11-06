// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json.Linq;
    using System;
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

            CdmOperationCombineAttributes combineAttributesOp = ctx.Corpus.MakeObject<CdmOperationCombineAttributes>(CdmObjectType.OperationCombineAttributesDef);

            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(CdmOperationType.CombineAttributes)))
            {
                Logger.Error(nameof(OperationCombineAttributesPersistence), ctx, $"$type {(string)obj["$type"]} is invalid for this operation.");
            }
            else
            {
                combineAttributesOp.Type = CdmOperationType.CombineAttributes;
            }
            if (obj["explanation"] != null)
            {
                combineAttributesOp.Explanation = (string)obj["explanation"];
            }
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

            return new OperationCombineAttributes
            {
                Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.CombineAttributes),
                Explanation = instance.Explanation,
                Select = instance.Select,
                MergeInto = Utils.JsonForm(instance.MergeInto, resOpt, options)
            };
        }
    }
}
