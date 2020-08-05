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
        /// Get resolved entity
        /// </summary>
        /// <param name="corpus"></param>
        /// <param name="inputEntity"></param>
        /// <param name="resolutionOptions"></param>
        /// <returns></returns>
        public static async Task<CdmEntityDefinition> GetResolvedEntity(CdmCorpusDefinition corpus, CdmEntityDefinition inputEntity, List<string> resolutionOptions)
        {
            HashSet<string> roHashSet = new HashSet<string>(resolutionOptions);

            string resolvedEntityName = $"Resolved_{inputEntity.EntityName}";

            ResolveOptions ro = new ResolveOptions(inputEntity.InDocument)
            {
                Directives = new AttributeResolutionDirectiveSet(roHashSet)
            };

            CdmFolderDefinition resolvedFolder = corpus.Storage.FetchRootFolder("output");
            CdmEntityDefinition resolvedEntity = await inputEntity.CreateResolvedEntityAsync(resolvedEntityName, ro, resolvedFolder);
            resolvedEntity.InDocument.SaveAsAsync($"{resolvedEntityName}.cdm.json", saveReferenced: false).GetAwaiter().GetResult();

            return resolvedEntity;
        }
    }
}
