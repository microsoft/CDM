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

    class TraitPersistence
    {
        public static CdmTraitDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            CdmTraitDefinition trait = ctx.Corpus.MakeObject<CdmTraitDefinition>(CdmObjectType.TraitDef, (string)obj["traitName"]);
            trait.ExtendsTrait = TraitReferencePersistence.FromData(ctx, obj["extendsTrait"]);

            if (obj["explanation"] != null)
                trait.Explanation = (string)obj["explanation"];

            if (obj["hasParameters"] != null)
            {
                foreach (JToken ap in obj["hasParameters"])
                {
                    trait.Parameters.Add(ParameterPersistence.FromData(ctx, ap));
                }
            }

            if (obj["elevated"] != null)
                trait.Elevated = (bool)obj["elevated"];
            if (obj["ugly"] != null)
                trait.Ugly = (bool)obj["ugly"];
            if (obj["associatedProperties"] != null)
                trait.AssociatedProperties = obj["associatedProperties"].ToObject<List<string>>();
            return trait;
        }

        public static Trait ToData(CdmTraitDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new Trait
            {
                Explanation = instance.Explanation,
                TraitName = instance.TraitName,
                ExtendsTrait = Utils.JsonForm(instance.ExtendsTrait, resOpt, options),
                HasParameters = CopyDataUtils.ListCopyData(resOpt, instance.Parameters, options),
                Elevated = instance.Elevated == true ? (bool?)true : null,
                Ugly = instance.Ugly == true ? (bool?)true : null,
                AssociatedProperties = instance.AssociatedProperties
            };
        }
    }
}
