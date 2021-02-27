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

            CdmOperationAddTypeAttribute addTypeAttributeOp = OperationBasePersistence.FromData<CdmOperationAddTypeAttribute>(ctx, CdmObjectType.OperationAddTypeAttributeDef, obj);
            addTypeAttributeOp.TypeAttribute = Utils.CreateAttribute(ctx, obj["typeAttribute"]) as CdmTypeAttributeDefinition;

            return addTypeAttributeOp;
        }

        public static OperationAddTypeAttribute ToData(CdmOperationAddTypeAttribute instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationAddTypeAttribute obj = OperationBasePersistence.ToData<OperationAddTypeAttribute>(instance, resOpt, options);
            obj.TypeAttribute = Utils.JsonForm(instance.TypeAttribute, resOpt, options);

            return obj;
        }
    }
}
