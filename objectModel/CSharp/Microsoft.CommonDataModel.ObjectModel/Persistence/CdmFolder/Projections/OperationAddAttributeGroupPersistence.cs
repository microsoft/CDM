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
    /// Operation AddAttributeGroup persistence
    /// </summary>
    public class OperationAddAttributeGroupPersistence
    {
        public static CdmOperationAddAttributeGroup FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationAddAttributeGroup addAttributeGroupOp = ctx.Corpus.MakeObject<CdmOperationAddAttributeGroup>(CdmObjectType.OperationAddAttributeGroupDef);

            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(CdmOperationType.AddAttributeGroup)))
            {
                Logger.Error(nameof(OperationAddAttributeGroupPersistence), ctx, $"$type {(string)obj["$type"]} is invalid for this operation.");
            }
            else
            {
                addAttributeGroupOp.Type = CdmOperationType.AddAttributeGroup;
            }
            // TODO (sukanyas): Property to be defined

            return addAttributeGroupOp;
        }

        public static OperationAddAttributeGroup ToData(CdmOperationAddAttributeGroup instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            return new OperationAddAttributeGroup
            {
                Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.AddAttributeGroup),
                Explanation = instance.Explanation,
                // TODO (sukanyas): Property to be defined
            };
        }
    }
}
