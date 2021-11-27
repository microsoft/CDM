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

            CdmOperationAddSupportingAttribute addSupportingAttributeOp = OperationBasePersistence.FromData<CdmOperationAddSupportingAttribute>(ctx, CdmObjectType.OperationAddSupportingAttributeDef, obj);
            addSupportingAttributeOp.SupportingAttribute = Utils.CreateAttribute(ctx, obj["supportingAttribute"]) as CdmTypeAttributeDefinition;

            return addSupportingAttributeOp;
        }

        public static OperationAddSupportingAttribute ToData(CdmOperationAddSupportingAttribute instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationAddSupportingAttribute obj = OperationBasePersistence.ToData<OperationAddSupportingAttribute>(instance, resOpt, options);
            obj.SupportingAttribute = Utils.JsonForm(instance.SupportingAttribute, resOpt, options);

            return obj;
        }
    }
}
