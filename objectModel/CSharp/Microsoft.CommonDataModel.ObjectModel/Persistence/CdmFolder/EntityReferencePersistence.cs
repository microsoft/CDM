// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    class EntityReferencePersistence
    {
        public static CdmEntityReference FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            dynamic entity = null;
            bool simpleReference = true;
            List<CdmTraitReference> appliedTraits = null;

            if (obj is JValue)
            {
                entity = (string)obj;
            }
            else
            {
                entity = GetEntityReference(ctx, obj);
                simpleReference = false;
            }

            CdmEntityReference entityReference = ctx.Corpus.MakeRef<CdmEntityReference>(CdmObjectType.EntityRef, entity, simpleReference);

            if (!(obj is JValue))
            {
                appliedTraits = Utils.CreateTraitReferenceList(ctx, obj["appliedTraits"]);
                if (appliedTraits != null)
                {
                    Utils.AddListToCdmCollection(entityReference.AppliedTraits, appliedTraits);
                }
            }

            return entityReference;
        }

        public static dynamic ToData(CdmEntityReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectRefPersistence.ToData(instance, resOpt, options);
        }

        private static dynamic GetEntityReference(CdmCorpusContext ctx, JToken obj)
        {
            dynamic entity = null;
            if (obj["entityReference"] is JValue)
                entity = obj["entityReference"];
            else if (obj["entityReference"]?["entityShape"] != null)
                entity = ConstantEntityPersistence.FromData(ctx, obj["entityReference"]);
            else if (obj["source"] != null)
                entity = ProjectionPersistence.FromData(ctx, obj);
            else
                entity = EntityPersistence.FromData(ctx, obj["entityReference"]);
            return entity;
        }
    }
}
