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

    class AttributeGroupPersistence
    {
        public static CdmAttributeGroupDefinition FromData(CdmCorpusContext ctx, JToken obj, string entityName = null)
        {
            if (obj == null)
            {
                return null;
            }
            var attributeGroup = ctx.Corpus.MakeObject<CdmAttributeGroupDefinition>(CdmObjectType.AttributeGroupDef, (string)obj["attributeGroupName"]);

            if (obj["explanation"] != null)
                attributeGroup.Explanation = (string)obj["explanation"];
            attributeGroup.AttributeContext = AttributeContextReferencePersistence.FromData(ctx, obj["attributeContext"]);
            Utils.AddListToCdmCollection(attributeGroup.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));
            if (obj["members"] != null)
            {
                foreach(var att in obj["members"])
                    attributeGroup.Members.Add(Utils.CreateAttribute(ctx, att, entityName));
            }

            return attributeGroup;
        }

        public static dynamic ToData(CdmAttributeGroupDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new AttributeGroup
            {
                Explanation = instance.Explanation,
                AttributeGroupName = instance.AttributeGroupName,
                ExhibitsTraits = CopyDataUtils.ListCopyData(resOpt, instance.ExhibitsTraits, options),
                AttributeContext = instance.AttributeContext?.CopyData(resOpt, options) as string,
                Members = CopyDataUtils.ListCopyData(resOpt, instance.Members, options)
            };
        }
    }
}
