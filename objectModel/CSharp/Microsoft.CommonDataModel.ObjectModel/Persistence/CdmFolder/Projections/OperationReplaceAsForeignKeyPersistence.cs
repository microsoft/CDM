// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

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

            CdmOperationReplaceAsForeignKey replaceAsForeignKeyOp = OperationBasePersistence.FromData<CdmOperationReplaceAsForeignKey>(ctx, CdmObjectType.OperationReplaceAsForeignKeyDef, obj);
            replaceAsForeignKeyOp.Reference = obj["reference"]?.ToString();
            replaceAsForeignKeyOp.ReplaceWith = Utils.CreateAttribute(ctx, obj["replaceWith"]) as CdmTypeAttributeDefinition;

            return replaceAsForeignKeyOp;
        }

        public static OperationReplaceAsForeignKey ToData(CdmOperationReplaceAsForeignKey instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationReplaceAsForeignKey obj = OperationBasePersistence.ToData<OperationReplaceAsForeignKey>(instance, resOpt, options);
            obj.Reference = instance.Reference;
            obj.ReplaceWith = Utils.JsonForm(instance.ReplaceWith, resOpt, options);

            return obj;
        }
    }
}
