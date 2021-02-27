// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class AttributeReferencePersistence
    {
        public static CdmAttributeReference FromData(CdmCorpusContext ctx, JToken obj)
        {
            bool simpleReference = true;
            string attribute = (string)obj;
            
            return ctx.Corpus.MakeRef<CdmAttributeReference>(CdmObjectType.AttributeRef, attribute, simpleReference);
        }

        public static dynamic ToData(CdmAttributeReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectRefPersistence.ToData(instance, resOpt, options);
        }
    }
}
