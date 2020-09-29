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
    /// Operation RenameAttributes persistence
    /// </summary>
    public class OperationRenameAttributesPersistence
    {
        public static CdmOperationRenameAttributes FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationRenameAttributes renameAttributesOp = ctx.Corpus.MakeObject<CdmOperationRenameAttributes>(CdmObjectType.OperationRenameAttributesDef);


            if (obj["$type"] != null && !StringUtils.EqualsWithIgnoreCase(obj["$type"].ToString(), OperationTypeConvertor.OperationTypeToString(CdmOperationType.RenameAttributes)))
            {
                Logger.Error(nameof(OperationRenameAttributesPersistence), ctx, $"$type {obj["$type"].ToString()} is invalid for this operation.");
            }
            else
            {
                renameAttributesOp.Type = CdmOperationType.RenameAttributes;
            }
            if (obj["explanation"] != null)
            {
                renameAttributesOp.Explanation = (string)obj["explanation"];
            }
            renameAttributesOp.RenameFormat = obj["renameFormat"]?.ToString();

            if (obj["applyTo"] is JValue)
            {
                renameAttributesOp.ApplyTo = new List<string>
                {
                    (string)obj["applyTo"]
                };
            } 
            else if (obj["applyTo"] is JArray applyToArray)
            {
                renameAttributesOp.ApplyTo = applyToArray.ToObject<List<string>>();
            }
            else if (obj["applyTo"] != null)
            {
                Logger.Error(nameof(OperationRenameAttributesPersistence), ctx, "Unsupported: applyTo property type should be string or List<string>.");
                return null;
            }

            return renameAttributesOp;
        }

        public static OperationRenameAttributes ToData(CdmOperationRenameAttributes instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            return new OperationRenameAttributes
            {
                Type = OperationTypeConvertor.OperationTypeToString(CdmOperationType.RenameAttributes),
                Explanation = instance.Explanation,
                RenameFormat = instance.RenameFormat,
                ApplyTo = instance.ApplyTo
            };
        }
    }
}
