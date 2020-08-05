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
    /// Operation AddSupportingAttribute persistence
    /// </summary>
    public class OperationAddSupportingAttributePersistence
    {
        public static CdmOperationAddSupportingAttribute FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationAddSupportingAttribute addSupportingAttributeOp = ctx.Corpus.MakeObject<CdmOperationAddSupportingAttribute>(CdmObjectType.OperationAddSupportingAttributeDef);

            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(CdmOperationType.AddSupportingAttribute)))
            {
                Logger.Error(nameof(OperationAddSupportingAttributePersistence), ctx, $"$type {(string)obj["$type"]} is invalid for this operation.");
            }
            else
            {
                addSupportingAttributeOp.Type = CdmOperationType.AddSupportingAttribute;
            }
            if (obj["explanation"] != null)
            {
                addSupportingAttributeOp.Explanation = (string)obj["explanation"];
            }
            if (obj["supportingAttribute"] != null)
            {
                addSupportingAttributeOp.SupportingAttribute = Utils.CreateAttribute(ctx, obj["supportingAttribute"]) as CdmTypeAttributeDefinition;
            }

            return addSupportingAttributeOp;
        }

        public static OperationAddSupportingAttribute ToData(CdmOperationAddSupportingAttribute instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            return new OperationAddSupportingAttribute
            {
                Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.AddSupportingAttribute),
                Explanation = instance.Explanation,
                SupportingAttribute = Utils.JsonForm(instance.SupportingAttribute, resOpt, options)
            };
        }
    }
}
