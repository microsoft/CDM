namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;
    using System.Collections.Generic;

    class DataTypeReferencePersistence
    {
        public static CdmDataTypeReference FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }

            bool simpleReference = true;
            dynamic dataType = null;
            List<CdmTraitReference> appliedTraits = null;

            if (obj is JValue)
                dataType = obj;
            else
            {
                simpleReference = false;
                if (obj["dataTypeReference"] is JValue)
                    dataType = (string)obj["dataTypeReference"];
                else
                    dataType = DataTypePersistence.FromData(ctx, obj["dataTypeReference"]);
            }

            CdmDataTypeReference dataTypeReference = ctx.Corpus.MakeRef<CdmDataTypeReference>(CdmObjectType.DataTypeRef, dataType, simpleReference);

            if (!(obj is JValue))
                appliedTraits = Utils.CreateTraitReferenceList(ctx, obj["appliedTraits"]);

            Utils.AddListToCdmCollection(dataTypeReference.AppliedTraits, appliedTraits);

            return dataTypeReference;
        }

        public static dynamic ToData(CdmDataTypeReference instance, ResolveOptions resOpt, CopyOptions options)
        {
            return CdmObjectRefPersistence.ToData(instance, resOpt, options);
        }
    }
}
