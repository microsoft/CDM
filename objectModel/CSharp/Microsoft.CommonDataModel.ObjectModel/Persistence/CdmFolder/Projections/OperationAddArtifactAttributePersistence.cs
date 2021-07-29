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
    /// Operation AddArtifactAttribute persistence
    /// </summary>
    public class OperationAddArtifactAttributePersistence
    {
        public static CdmOperationAddArtifactAttribute FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationAddArtifactAttribute addArtifactAttributeOp = OperationBasePersistence.FromData<CdmOperationAddArtifactAttribute>(ctx, CdmObjectType.OperationAddArtifactAttributeDef, obj);
            addArtifactAttributeOp.NewAttribute = Utils.CreateAttribute(ctx, obj["newAttribute"]);
            addArtifactAttributeOp.InsertAtTop = (bool?)obj["insertAtTop"];

            return addArtifactAttributeOp;
        }

        public static OperationAddArtifactAttribute ToData(CdmOperationAddArtifactAttribute instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationAddArtifactAttribute obj = OperationBasePersistence.ToData<OperationAddArtifactAttribute>(instance, resOpt, options);
            obj.NewAttribute = Utils.JsonForm(instance.NewAttribute, resOpt, options);
            obj.InsertAtTop = instance.InsertAtTop;

            return obj;
        }
    }
}
