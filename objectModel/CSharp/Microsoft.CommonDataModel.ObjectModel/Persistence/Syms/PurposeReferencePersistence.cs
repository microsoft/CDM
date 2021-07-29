// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
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
            bool? optional = null;
            dynamic purpose;

            if (obj is JValue)
                purpose = obj;
            else
            {
                simpleReference = false;

                if (obj["optional"] != null)
                {
                    if (bool.TryParse(obj["optional"].ToString(), out bool optVal))
                    {
                        optional = optVal;
                    }
                }

                if (obj["purposeReference"] is JValue)
                    purpose = (string)obj["purposeReference"];
                else
                    purpose = PurposePersistence.FromData(ctx, obj["purposeReference"]);
            }

            CdmPurposeReference purposeReference = ctx.Corpus.MakeRef<CdmPurposeReference>(CdmObjectType.PurposeRef, purpose, simpleReference);
            
            if (optional != null)
            {
                purposeReference.Optional = optional;
            }

            if (!(obj is JValue))
            {
                Utils.AddListToCdmCollection(purposeReference.AppliedTraits, Utils.CreateTraitReferenceList(ctx, obj["appliedTraits"]));
            }

            return purposeReference;
        }

        public static dynamic ToData(CdmPurposeReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectRefPersistence.ToData(instance, resOpt, options);
        }
    }
}
