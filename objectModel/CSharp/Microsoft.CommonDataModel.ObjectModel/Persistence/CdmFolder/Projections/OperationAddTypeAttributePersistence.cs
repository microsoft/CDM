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
    /// Operation AddTypeAttribute persistence
    /// </summary>
    public class OperationAddTypeAttributePersistence
    {
        public static CdmOperationAddTypeAttribute FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationAddTypeAttribute addTypeAttributeOp = ctx.Corpus.MakeObject<CdmOperationAddTypeAttribute>(CdmObjectType.OperationAddTypeAttributeDef);

            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(CdmOperationType.AddTypeAttribute)))
            {
                Logger.Error(nameof(OperationAddTypeAttributePersistence), ctx, $"$type {(string)obj["$type"]} is invalid for this operation.");
            }
            else
            {
                addTypeAttributeOp.Type = CdmOperationType.AddTypeAttribute;
            }
            if (obj["explanation"] != null)
            {
                addTypeAttributeOp.Explanation = (string)obj["explanation"];
            }
            if (obj["typeAttribute"] != null)
            {
                addTypeAttributeOp.TypeAttribute = Utils.CreateAttribute(ctx, obj["typeAttribute"]) as CdmTypeAttributeDefinition;
            }

            return addTypeAttributeOp;
        }

        public static OperationAddTypeAttribute ToData(CdmOperationAddTypeAttribute instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            return new OperationAddTypeAttribute
            {
                Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.AddTypeAttribute),
                Explanation = instance.Explanation,
                TypeAttribute = Utils.JsonForm(instance.TypeAttribute, resOpt, options)
            };
        }
    }
}
