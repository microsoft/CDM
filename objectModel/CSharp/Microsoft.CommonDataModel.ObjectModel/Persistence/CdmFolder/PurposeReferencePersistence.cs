// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System;
    using System.Collections.Generic;
    using System.Text;

    class PurposeReferencePersistence
    {
        public static CdmPurposeReference FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            bool simpleReference = true;
            dynamic purpose = null;
            List<CdmTraitReference> appliedTraits = null;

            if (obj is JValue)
                purpose = obj;
            else
            {
                simpleReference = false;
                if (obj["purposeReference"] is JValue)
                    purpose = (string)obj["purposeReference"];
                else
                    purpose = PurposePersistence.FromData(ctx, obj["purposeReference"]);
            }

            CdmPurposeReference purposeReference = ctx.Corpus.MakeRef<CdmPurposeReference>(CdmObjectType.PurposeRef, purpose, simpleReference);

            if (!(obj is JValue))
                appliedTraits = Utils.CreateTraitReferenceList(ctx, obj["appliedTraits"]);

            Utils.AddListToCdmCollection(purposeReference.AppliedTraits, appliedTraits);

            return purposeReference;
        }

        public static dynamic ToData(CdmPurposeReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectRefPersistence.ToData(instance, resOpt, options);
        }
    }
}
