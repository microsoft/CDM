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
    /// Operation ArrayExpansion persistence
    /// </summary>
    public class OperationArrayExpansionPersistence
    {
        public static CdmOperationArrayExpansion FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationArrayExpansion arrayExpansionOp = OperationBasePersistence.FromData<CdmOperationArrayExpansion>(ctx, CdmObjectType.OperationArrayExpansionDef, obj);
            arrayExpansionOp.StartOrdinal = (int?)obj["startOrdinal"];
            arrayExpansionOp.EndOrdinal = (int?)obj["endOrdinal"];

            return arrayExpansionOp;
        }

        public static OperationArrayExpansion ToData(CdmOperationArrayExpansion instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationArrayExpansion obj = OperationBasePersistence.ToData<OperationArrayExpansion>(instance, resOpt, options);
            obj.StartOrdinal = instance.StartOrdinal;
            obj.EndOrdinal = instance.EndOrdinal;

            return obj;
        }
    }
}
