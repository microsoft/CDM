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
    /// Operation ReplaceAsForeignKey persistence
    /// </summary>
    public class OperationReplaceAsForeignKeyPersistence
    {
        public static CdmOperationReplaceAsForeignKey FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationReplaceAsForeignKey replaceAsForeignKeyOp = ctx.Corpus.MakeObject<CdmOperationReplaceAsForeignKey>(CdmObjectType.OperationReplaceAsForeignKeyDef);

            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(CdmOperationType.ReplaceAsForeignKey)))
            {
                Logger.Error(nameof(OperationReplaceAsForeignKeyPersistence), ctx, $"$type {(string)obj["$type"]} is invalid for this operation.");
            }
            else
            {
                replaceAsForeignKeyOp.Type = CdmOperationType.ReplaceAsForeignKey;
            }
            if (obj["explanation"] != null)
            {
                replaceAsForeignKeyOp.Explanation = (string)obj["explanation"];
            }
            replaceAsForeignKeyOp.Reference = obj["reference"]?.ToString();
            if (obj["replaceWith"] != null)
            {
                replaceAsForeignKeyOp.ReplaceWith = Utils.CreateAttribute(ctx, obj["replaceWith"]) as CdmTypeAttributeDefinition;
            }

            return replaceAsForeignKeyOp;
        }

        public static OperationReplaceAsForeignKey ToData(CdmOperationReplaceAsForeignKey instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            return new OperationReplaceAsForeignKey
            {
                Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.ReplaceAsForeignKey),
                Explanation = instance.Explanation,
                Reference = instance.Reference,
                ReplaceWith = Utils.JsonForm(instance.ReplaceWith, resOpt, options)
            };
        }
    }
}
