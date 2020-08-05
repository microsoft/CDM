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
    /// Operation AddCountAttribute persistence
    /// </summary>
    public class OperationAddCountAttributePersistence
    {
        public static CdmOperationAddCountAttribute FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationAddCountAttribute addCountAttributeOp = ctx.Corpus.MakeObject<CdmOperationAddCountAttribute>(CdmObjectType.OperationAddCountAttributeDef);

            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(CdmOperationType.AddCountAttribute)))
            {
                Logger.Error(nameof(OperationAddCountAttributePersistence), ctx, $"$type {(string)obj["$type"]} is invalid for this operation.");
            }
            else
            {
                addCountAttributeOp.Type = CdmOperationType.AddCountAttribute;
            }
            if (obj["explanation"] != null)
            {
                addCountAttributeOp.Explanation = (string)obj["explanation"];
            }
            if (obj["countAttribute"] != null)
            {
                addCountAttributeOp.CountAttribute = Utils.CreateAttribute(ctx, obj["countAttribute"]) as CdmTypeAttributeDefinition;
            }

            return addCountAttributeOp;
        }

        public static OperationAddCountAttribute ToData(CdmOperationAddCountAttribute instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            return new OperationAddCountAttribute
            {
                Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.AddCountAttribute),
                Explanation = instance.Explanation,
                CountAttribute = Utils.JsonForm(instance.CountAttribute, resOpt, options)
            };
        }
    }
}
