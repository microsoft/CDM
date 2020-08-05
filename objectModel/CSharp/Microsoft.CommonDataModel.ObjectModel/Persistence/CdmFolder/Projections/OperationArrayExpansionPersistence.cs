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

    /// <summary>
    /// Operation ArrayExpansion persistence
    /// </summary>
    public class OperationArrayExpansionPersistence
    {
        public static CdmOperationArrayExpansion FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationArrayExpansion arrayExpansionOp = ctx.Corpus.MakeObject<CdmOperationArrayExpansion>(CdmObjectType.OperationArrayExpansionDef);

            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(CdmOperationType.ArrayExpansion)))
            {
                Logger.Error(nameof(OperationArrayExpansionPersistence), ctx, $"$type {(string)obj["$type"]} is invalid for this operation.");
            }
            else
            {
                arrayExpansionOp.Type = CdmOperationType.ArrayExpansion;
            }
            if (obj["explanation"] != null)
            {
                arrayExpansionOp.Explanation = (string)obj["explanation"];
            }
            arrayExpansionOp.StartOrdinal = (int?)obj["startOrdinal"];
            arrayExpansionOp.EndOrdinal = (int?)obj["endOrdinal"];

            return arrayExpansionOp;
        }

        public static OperationArrayExpansion ToData(CdmOperationArrayExpansion instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            return new OperationArrayExpansion
            {
                Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.ArrayExpansion),
                Explanation = instance.Explanation,
                StartOrdinal = instance.StartOrdinal,
                EndOrdinal = instance.EndOrdinal
            };
        }
    }
}
