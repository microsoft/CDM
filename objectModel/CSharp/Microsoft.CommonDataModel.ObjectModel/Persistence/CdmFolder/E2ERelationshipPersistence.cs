// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{

    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;

    class E2ERelationshipPersistence
    {
        public static CdmE2ERelationship FromData(CdmCorpusContext ctx, E2ERelationship dataObj)
        {
            var relationship = ctx.Corpus.MakeObject<CdmE2ERelationship>(CdmObjectType.E2ERelationshipDef);
            if (!string.IsNullOrWhiteSpace(dataObj.Name))
            {
                relationship.Name = dataObj.Name;
            }
            relationship.FromEntity = dataObj.FromEntity;
            relationship.FromEntityAttribute = dataObj.FromEntityAttribute;
            relationship.ToEntity = dataObj.ToEntity;
            relationship.ToEntityAttribute = dataObj.ToEntityAttribute;
            return relationship;
        }

        public static E2ERelationship ToData(CdmE2ERelationship instance)
        {
            return new E2ERelationship
            {
                Name = !string.IsNullOrWhiteSpace(instance.Name) ? instance.Name : null,
                FromEntity = instance.FromEntity,
                FromEntityAttribute = instance.FromEntityAttribute,
                ToEntity = instance.ToEntity,
                ToEntityAttribute = instance.ToEntityAttribute
            };
        }
    }
}
