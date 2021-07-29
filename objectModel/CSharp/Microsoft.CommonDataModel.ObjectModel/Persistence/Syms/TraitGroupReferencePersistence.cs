// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class TraitGroupReferencePersistence
    {
        public static CdmTraitGroupReference FromData(CdmCorpusContext ctx, JToken obj)
        {
            // Note: Trait group reference by definition cannot be specified as a simple named reference

            if (obj == null || obj["traitGroupReference"] == null)
            {
                return null;
            }

            bool? optional = null;
            dynamic traitGroup;

            if (obj["optional"] != null)
            {
                if (bool.TryParse(obj["optional"].ToString(), out bool optVal))
                {
                    optional = optVal;
                }
            }

            if (obj["traitGroupReference"] is JValue)
                traitGroup = (string)obj["traitGroupReference"];
            else
                traitGroup = TraitGroupPersistence.FromData(ctx, obj["traitGroupReference"]);

            CdmTraitGroupReference traitGroupReference = ctx.Corpus.MakeRef<CdmTraitGroupReference>(CdmObjectType.TraitGroupRef, traitGroup, false);

            if (optional != null)
            {
                traitGroupReference.Optional = optional;
            }

            return traitGroupReference;
        }

        public static dynamic ToData(CdmTraitGroupReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectRefPersistence.ToData(instance, resOpt, options);
        }
    }
}
