// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System;
    using Newtonsoft.Json.Linq;

    // <summary>
    //   The manifest declaration for CDM folders format.
    // </summary>
    class ManifestDeclarationPersistence
    {
        public static CdmManifestDeclarationDefinition FromData(CdmCorpusContext ctx, DatabaseEntity obj)
        {
            var name = obj.Name.Replace(".manifest.cdm.json", "");
            var newManifestDoc = ctx.Corpus.MakeObject<CdmManifestDeclarationDefinition>(CdmObjectType.ManifestDeclarationDef, name);
            newManifestDoc.Definition = name + "/" + name + ".manifest.cdm.json";

            DatabaseProperties databaseProperties = ((JToken)obj.Properties).ToObject<DatabaseProperties>();
            if (databaseProperties.Properties != null)
            {
                if (databaseProperties.Properties.ContainsKey("cdm:lastFileStatusCheckTime"))
                {
                    newManifestDoc.LastFileStatusCheckTime = DateTimeOffset.Parse(databaseProperties.Properties["cdm:lastFileStatusCheckTime"].ToObject<string>());
                }

                if (databaseProperties.Properties.ContainsKey("cdm:lastFileModifiedTime"))
                {
                    newManifestDoc.LastFileModifiedTime = DateTimeOffset.Parse(databaseProperties.Properties["cdm:lastFileModifiedTime"].ToObject<string>());
                }

                if (databaseProperties.Properties.ContainsKey("cdm:explanation"))
                {
                    newManifestDoc.Explanation = databaseProperties.Properties["cdm:explanation"].ToObject<string>();
                }
            }
            return newManifestDoc;
        }

        public static ManifestDeclaration ToData(CdmManifestDeclarationDefinition instance, ResolveOptions resOpt, CopyOptions options)
        {
            var result = new ManifestDeclaration
            {
                Explanation = instance.Explanation,
                ManifestName = instance.ManifestName,
                LastFileStatusCheckTime = TimeUtils.GetFormattedDateString(instance.LastFileStatusCheckTime),
                LastFileModifiedTime = TimeUtils.GetFormattedDateString(instance.LastFileModifiedTime),
                Definition = instance.Definition
            };

            return result;
        }
    }
}
