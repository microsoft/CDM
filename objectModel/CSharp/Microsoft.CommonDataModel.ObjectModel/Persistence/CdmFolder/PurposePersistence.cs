// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class PurposePersistence
    {
        public static CdmPurposeDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            var purpose = ctx.Corpus.MakeObject<CdmPurposeDefinition>(CdmObjectType.PurposeDef, (string)obj["purposeName"]);
            purpose.ExtendsPurpose = PurposeReferencePersistence.FromData(ctx, obj["extendsPurpose"]);
            if (obj["explanation"] != null)
                purpose.Explanation = (string)obj["explanation"];
            Utils.AddListToCdmCollection(purpose.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));
            return purpose;
        }

        public static Purpose ToData(CdmPurposeDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new Purpose
            {
                Explanation = instance.Explanation,
                PurposeName = instance.PurposeName,
                ExtendsPurpose =  Utils.JsonForm(instance.ExtendsPurpose, resOpt, options),
                ExhibitsTraits = CopyDataUtils.ListCopyData(resOpt, instance.ExhibitsTraits, options)
            };
        }
    }
}
