// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Utilities;
    using System.Collections.Generic;
    using System.Threading.Tasks;

    class TestUtils
    {
        /// <summary>
        /// Resolves an entity
        /// </summary>
        /// <param name="corpus">The corpus</param>
        /// <param name="inputEntity">The entity to resolve</param>
        /// <param name="resolutionOptions">The resolution options</param>
        /// <param name="addResOptToName">Whether to add the resolution options as part of the resolved entity name</param>
        public static async Task<CdmEntityDefinition> GetResolvedEntity(CdmCorpusDefinition corpus, CdmEntityDefinition inputEntity, List<string> resolutionOptions, bool addResOptToName = false)
        {
            HashSet<string> roHashSet = new HashSet<string>(resolutionOptions);

            string resolvedEntityName = "";

            if (addResOptToName)
            {
                string fileNameSuffix = GetResolutionOptionNameSuffix(resolutionOptions);
                resolvedEntityName = $"Resolved_{inputEntity.EntityName}{fileNameSuffix}";
            }
            else
            {
                resolvedEntityName = $"Resolved_{inputEntity.EntityName}";
            }

            ResolveOptions ro = new ResolveOptions(inputEntity.InDocument)
            {
                Directives = new AttributeResolutionDirectiveSet(roHashSet)
            };

            CdmFolderDefinition resolvedFolder = corpus.Storage.FetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = await inputEntity.CreateResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder);
            await resolvedEntity.InDocument.SaveAsAsync($"{resolvedEntityName}.cdm.json", saveReferenced: false);

            return resolvedEntity;
        }

        /// <summary>
        /// Returns a suffix that contains the file name and resolution option used
        /// </summary>
        /// <param name="resolutionOptions">The resolution options</param>
        public static string GetResolutionOptionNameSuffix(List<string> resolutionOptions)
        {
            string fileNamePrefix = string.Empty;

            for (int i = 0; i < resolutionOptions.Count; i++)
            {
                fileNamePrefix = $"{fileNamePrefix}_{resolutionOptions[i]}";
            }

            if (string.IsNullOrWhiteSpace(fileNamePrefix))
            {
                fileNamePrefix = "_default";
            }

            return fileNamePrefix;
        }
    }
}
