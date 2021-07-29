// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class AttributeGroupReferencePersistence
    {
        public static CdmAttributeGroupReference FromData(CdmCorpusContext ctx, JToken obj, string entityName = null)
        {
            if (obj == null)
            {
                return null;
            }
            bool simpleReference = true;
            dynamic attributeGroup;
            if (obj is JValue)
                attributeGroup = obj;
            else
            {
                simpleReference = false;
                if (obj["attributeGroupReference"] is JValue)
                    attributeGroup = (string)obj["attributeGroupReference"];
                else
                    attributeGroup = AttributeGroupPersistence.FromData(ctx, obj["attributeGroupReference"], entityName);
            }

            return ctx.Corpus.MakeRef<CdmAttributeGroupReference>(CdmObjectType.AttributeGroupRef, attributeGroup, simpleReference);
        }
        public static dynamic ToData(CdmAttributeGroupReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectRefPersistence.ToData(instance, resOpt, options);
        }

    }
}
