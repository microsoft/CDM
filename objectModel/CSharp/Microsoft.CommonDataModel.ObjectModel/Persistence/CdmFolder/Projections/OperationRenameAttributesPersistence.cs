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
    using System.Collections.Generic;

    /// <summary>
    /// Operation RenameAttributes persistence
    /// </summary>
    public class OperationRenameAttributesPersistence
    {
        private static readonly string Tag = nameof(OperationRenameAttributesPersistence);
        public static CdmOperationRenameAttributes FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationRenameAttributes renameAttributesOp = OperationBasePersistence.FromData<CdmOperationRenameAttributes>(ctx, CdmObjectType.OperationRenameAttributesDef, obj);
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
                Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistProjUnsupportedProp);
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

            OperationRenameAttributes obj = OperationBasePersistence.ToData<OperationRenameAttributes>(instance, resOpt, options);
            obj.RenameFormat = instance.RenameFormat;
            obj.ApplyTo = instance.ApplyTo;

            return obj;
        }
    }
}
