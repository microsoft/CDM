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

            CdmOperationAddCountAttribute addCountAttributeOp = OperationBasePersistence.FromData<CdmOperationAddCountAttribute>(ctx, CdmObjectType.OperationAddCountAttributeDef, obj);
            addCountAttributeOp.CountAttribute = Utils.CreateAttribute(ctx, obj["countAttribute"]) as CdmTypeAttributeDefinition;

            return addCountAttributeOp;
        }

        public static OperationAddCountAttribute ToData(CdmOperationAddCountAttribute instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationAddCountAttribute obj = OperationBasePersistence.ToData<OperationAddCountAttribute>(instance, resOpt, options);
            obj.CountAttribute = Utils.JsonForm(instance.CountAttribute, resOpt, options);

            return obj;
        }
    }
}
