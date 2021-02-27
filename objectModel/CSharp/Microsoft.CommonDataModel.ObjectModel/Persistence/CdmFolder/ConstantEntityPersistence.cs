// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    class ConstantEntityPersistence
    {
        public static CdmConstantEntityDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            var constantEntity = ctx.Corpus.MakeObject<CdmConstantEntityDefinition>(CdmObjectType.ConstantEntityDef, (string)obj["constantEntityName"]);
            if (obj["explanation"] != null)
                constantEntity.Explanation = (string)obj["explanation"];
            if (obj["constantValues"] != null)
            {
                constantEntity.ConstantValues = obj["constantValues"].ToObject<List<List<string>>>();
            }
            constantEntity.EntityShape = EntityReferencePersistence.FromData(ctx, obj["entityShape"]);
            return constantEntity;
        }
        public static ConstantEntity ToData(CdmConstantEntityDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new ConstantEntity
            {
                Explanation = instance.Explanation,
                ConstantEntityName = instance.ConstantEntityName,
                EntityShape = Utils.JsonForm(instance.EntityShape, resOpt, options),
                ConstantValues = instance.ConstantValues
            };
        }
    }
}
