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

            CdmOperationAddAttributeGroup addAttributeGroupOp = OperationBasePersistence.FromData<CdmOperationAddAttributeGroup>(ctx, CdmObjectType.OperationAddAttributeGroupDef, obj);
            addAttributeGroupOp.AttributeGroupName = obj["attributeGroupName"]?.ToString();

            return addAttributeGroupOp;
        }

        public static OperationAddAttributeGroup ToData(CdmOperationAddAttributeGroup instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationAddAttributeGroup obj = OperationBasePersistence.ToData<OperationAddAttributeGroup>(instance, resOpt, options);
            obj.AttributeGroupName = instance.AttributeGroupName;

            return obj;
        }
    }
}
