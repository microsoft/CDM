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

            CdmOperationExcludeAttributes excludeAttributesOp = ctx.Corpus.MakeObject<CdmOperationExcludeAttributes>(CdmObjectType.OperationExcludeAttributesDef);

            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(CdmOperationType.ExcludeAttributes)))
            {
                Logger.Error(nameof(OperationExcludeAttributesPersistence), ctx, $"$type {(string)obj["$type"]} is invalid for this operation.");
            }
            else
            {
                excludeAttributesOp.Type = CdmOperationType.ExcludeAttributes;
            }
            if (obj["explanation"] != null)
            {
                excludeAttributesOp.Explanation = (string)obj["explanation"];
            }
            excludeAttributesOp.ExcludeAttributes = obj["excludeAttributes"]?.ToObject<List<string>>();

            return excludeAttributesOp;
        }

        public static OperationExcludeAttributes ToData(CdmOperationExcludeAttributes instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationExcludeAttributes obj = new OperationExcludeAttributes
            {
                Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.ExcludeAttributes),
                Explanation = instance.Explanation,
                ExcludeAttributes = instance.ExcludeAttributes,
            };

            return obj;
        }
    }
}
