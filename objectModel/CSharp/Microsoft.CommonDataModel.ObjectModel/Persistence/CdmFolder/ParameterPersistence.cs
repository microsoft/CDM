// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.CdmFolder.Types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Newtonsoft.Json.Linq;

    class ParameterPersistence
    {
        public static CdmParameterDefinition FromData(CdmCorpusContext ctx, JToken obj)
        {

            var parameter = ctx.Corpus.MakeObject<CdmParameterDefinition>(CdmObjectType.ParameterDef, (string)obj["name"]);
            parameter.Explanation = (string)obj["explanation"];
            parameter.Required = obj["required"] != null ? (bool)obj["required"] : false;

            parameter.DefaultValue = Utils.CreateConstant(ctx, obj["defaultValue"]);
            parameter.DataTypeRef = DataTypeReferencePersistence.FromData(ctx, obj["dataType"]);

            return parameter;
        }

        public static Parameter ToData(CdmParameterDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            dynamic defVal = null;
            if (instance.DefaultValue != null)
            {
                if (instance.DefaultValue is string || instance.DefaultValue is JValue)
                    defVal = instance.DefaultValue;
                else
                    defVal = ((CdmObject)instance.DefaultValue).CopyData(resOpt, options);
            }
            return new Parameter
            {
                Explanation = instance.Explanation,
                Name = instance.Name,
                DefaultValue = defVal,
                Required = instance.Required == true ? (bool?) true : null,
                DataType =  Utils.JsonForm(instance.DataTypeRef, resOpt, options)
            };
        }
    }
}
