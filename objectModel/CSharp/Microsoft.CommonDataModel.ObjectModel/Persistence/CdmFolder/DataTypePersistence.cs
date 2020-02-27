// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class DataTypePersistence
    {
        public static CdmDataTypeDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {
            if (obj == null)
            {
                return null;
            }
            CdmDataTypeDefinition dataType = ctx.Corpus.MakeObject<CdmDataTypeDefinition>(CdmObjectType.DataTypeDef, (string)obj["dataTypeName"]);
            dataType.ExtendsDataType = DataTypeReferencePersistence.FromData(ctx, obj["extendsDataType"]);

            if (obj["explanation"] != null)
                dataType.Explanation = (string)obj["explanation"];

            Utils.AddListToCdmCollection(dataType.ExhibitsTraits, Utils.CreateTraitReferenceList(ctx, obj["exhibitsTraits"]));
            return dataType;
        }

        public static DataType ToData(CdmDataTypeDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            return new DataType
            {
                Explanation = instance.Explanation,
                DataTypeName = instance.DataTypeName,
                ExtendsDataType =  Utils.JsonForm(instance.ExtendsDataType, resOpt, options),
                ExhibitsTraits = CopyDataUtils.ListCopyData(resOpt, instance.ExhibitsTraits, options)
            };
        }
    }
}
