// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

using Microsoft.CommonDataModel.ObjectModel.Storage;

namespace Microsoft.CommonDataModel.ObjectModel.Tests
{
    /// <summary>
    /// Class to initialize Local Adpter for model.json unit test. 
    /// Having this to test ReferencedEntityDeclaration in model.json which is ReferenceModels.
    /// A valid path for a ReferenceModel has to be an absolute path, starting with "http://" or "https://", which means it can't use LocalAdapter
    /// However, assuming the path to the ReferenceModel is valid and the file can be loaded. we can use LocalAdapter for some unit tests.
    /// </summary>
    internal class ModelJsonUnitTestLocalAdapter : LocalAdapter
    {
        internal ModelJsonUnitTestLocalAdapter(string root) : base(root)
        {
        }

        public override string CreateCorpusPath(string adapterPath)
        {
            return adapterPath;
        }
    }
}
