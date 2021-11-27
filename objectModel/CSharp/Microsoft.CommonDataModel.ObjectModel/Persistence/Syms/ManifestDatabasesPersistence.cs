// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Enums;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Types;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Syms.Models;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using Microsoft.CommonDataModel.ObjectModel.Utilities.Logging;
    using Newtonsoft.Json;
    using Newtonsoft.Json.Linq;
    using Newtonsoft.Json.Serialization;
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;

    public class ManifestDatabasesPersistence
    {
        /// <summary>
        /// Whether this persistence class has async methods.
        /// </summary>
        public static readonly bool IsPersistenceAsync = false;

        /// <summary>
        /// The file format/extension types this persistence class supports.
        /// </summary>
        public static readonly string[] Formats = { PersistenceLayer.ManifestExtension, PersistenceLayer.FolioExtension };

        public static CdmManifestDefinition FromObject(CdmCorpusContext ctx, string name, string nameSpace, string path, SymsDatabasesResponse dataObjs)
        {
            var manifest = ctx.Corpus.MakeObject<CdmManifestDefinition>(CdmObjectType.ManifestDef, name);

            manifest.Name = name; 
            manifest.FolderPath = path;
            manifest.Namespace = nameSpace;
            manifest.Explanation = "This manifest contains list of syms DB as sub-manifest";

            if (!manifest.Imports.Any((CdmImport importPresent) => importPresent.CorpusPath == "cdm:/foundations.cdm.json"))
            {
                manifest.Imports.Add("cdm:/foundations.cdm.json");
            }

            if (dataObjs != null && dataObjs.Databases.Count > 0)
            {
                foreach (var database in dataObjs.Databases)
                {
                    if ( database.Type == SASEntityType.DATABASE )
                        manifest.SubManifests.Add(ManifestDeclarationPersistence.FromData(ctx, database));
                }
            }

            return manifest;
        }
    }
}
