// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    /// <summary>
    /// Operation AlterTraits persistence
    /// </summary>
    public class OperationAlterTraitsPersistence
    {
        private static readonly string Tag = nameof(OperationAlterTraitsPersistence);
        public static CdmOperationAlterTraits FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            CdmOperationAlterTraits alterTraitsOp = OperationBasePersistence.FromData<CdmOperationAlterTraits>(ctx, CdmObjectType.OperationAlterTraitsDef, obj);
            if (obj["traitsToAdd"] != null)
            {
                alterTraitsOp.TraitsToAdd = new CdmCollection<CdmTraitReferenceBase>(ctx, alterTraitsOp, CdmObjectType.TraitRef);
                Utils.AddListToCdmCollection(alterTraitsOp.TraitsToAdd, Utils.CreateTraitReferenceList(ctx, obj["traitsToAdd"]));
            }
            if (obj["traitsToRemove"] != null)
            {
                alterTraitsOp.TraitsToRemove = new CdmCollection<CdmTraitReferenceBase>(ctx, alterTraitsOp, CdmObjectType.TraitRef);
                Utils.AddListToCdmCollection(alterTraitsOp.TraitsToRemove, Utils.CreateTraitReferenceList(ctx, obj["traitsToRemove"]));
            }
            alterTraitsOp.ArgumentsContainWildcards = (bool?)obj["argumentsContainWildcards"];

            if (obj["applyTo"] is JValue)
            {
                alterTraitsOp.ApplyTo = new List<string>
                {
                    (string)obj["applyTo"]
                };
            }
            else if (obj["applyTo"] is JArray applyToArray)
            {
                alterTraitsOp.ApplyTo = applyToArray.ToObject<List<string>>();
            }
            else if (obj["applyTo"] != null)
            {
                Logger.Error((ResolveContext)ctx, Tag, nameof(FromData), null, CdmLogCode.ErrPersistProjUnsupportedProp, "applyTo", "string or list of strings");
                return null;
            }

            return alterTraitsOp;
        }

        public static OperationAlterTraits ToData(CdmOperationAlterTraits instance, ResolveOptions resOpt, CopyOptions options)
        {
            if (instance == null)
            {
                return null;
            }

            OperationAlterTraits obj = OperationBasePersistence.ToData<OperationAlterTraits>(instance, resOpt, options);
            obj.TraitsToAdd = CopyDataUtils.ListCopyData(resOpt, instance.TraitsToAdd, options);
            obj.TraitsToRemove = CopyDataUtils.ListCopyData(resOpt, instance.TraitsToRemove, options);
            obj.ArgumentsContainWildcards = instance.ArgumentsContainWildcards;
            obj.ApplyTo = instance.ApplyTo;

            return obj;
        }
    }
}
