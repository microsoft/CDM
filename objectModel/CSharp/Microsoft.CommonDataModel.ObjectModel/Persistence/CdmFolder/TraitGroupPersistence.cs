// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class TraitGroupPersistence
    {
        public static CdmTraitGroupDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            var traitGroup = ctx.Corpus.MakeObject<CdmTraitGroupDefinition>(CdmObjectType.TraitGroupDef, (string)obj["traitGroupName"]);
            
            if (obj["explanation"] != null)
            {
                traitGroup.Explanation = (string)obj["explanation"];
            }
            
            Utils.AddListToCdmCollection(traitGroup.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));

            return traitGroup;
        }

        public static TraitGroup ToData(CdmTraitGroupDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new TraitGroup
            {
                Explanation = instance.Explanation,
                TraitGroupName = instance.TraitGroupName,
                ExhibitsTraits = CopyDataUtils.ListCopyData(resOpt, instance.ExhibitsTraits, options)
            };
        }
    }
}
