// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson.types;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Threading.Tasks;

    /// <summary>
    /// The argument persistence.
    /// </summary>
    class ArgumentPersistence
    {
        public static async Task<CdmArgumentDefinition> FromData(CdmCorpusContext ctx, Annotation obj)
        {
            var argument = ctx.Corpus.MakeObject<CdmArgumentDefinition>(CdmObjectType.ArgumentDef);

            argument.Name = obj.Name;
            argument.Value = obj.Value;

            return argument;
        }

        public static async Task<Annotation> ToData(CdmArgumentDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            if(instance.Value is string)
            {
                return new Annotation
                {
                    Name = instance.Name,
                    Value = instance.Value
                };
            }

            return null;
        }
    }
}
