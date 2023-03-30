// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    class TraitReferencePersistence
    {
        public static CdmTraitReference FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            bool simpleReference = true;
            bool? optional = null;
            dynamic trait;
            JToken args = null;
            CdmTraitReference trVerb = null;
            List<CdmTraitReferenceBase> appliedTraits = null;

            if (obj is JValue)
            {
                trait = obj;
            }
            else
            {
                simpleReference = false;
                args = obj["arguments"];

                if (obj["optional"] != null)
                {
                    if (bool.TryParse(obj["optional"].ToString(), out bool optVal))
                    {
                        optional = optVal;
                    }
                }

                if (obj["traitReference"] is JValue)
                    trait = (string)obj["traitReference"];
                else
                    trait = TraitPersistence.FromData(ctx, obj["traitReference"]);

                trVerb = TraitReferencePersistence.FromData(ctx, obj["verb"]);

                appliedTraits = Utils.CreateTraitReferenceList(ctx, obj["appliedTraits"]);
            }

            CdmTraitReference traitReference = ctx.Corpus.MakeRef<CdmTraitReference>(CdmObjectType.TraitRef, trait, simpleReference);

            if (optional != null)
            {
                traitReference.Optional = optional;
            }

            if (args != null)
            {
                foreach (var a in args)
                {
                    traitReference.Arguments.Add(ArgumentPersistence.FromData(ctx, a));
                }
            }

            traitReference.Verb = trVerb;

            Utils.AddListToCdmCollection(traitReference.AppliedTraits, appliedTraits);

            return traitReference;
        }

        public static dynamic ToData(CdmTraitReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectRefPersistence.ToData(instance, resOpt, options);
        }
    }
}
