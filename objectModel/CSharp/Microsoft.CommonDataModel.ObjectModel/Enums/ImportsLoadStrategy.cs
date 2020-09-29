// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Enums
{
    /// <summary>
    /// Specifies how the OM will load the imports from a document.
    /// </summary>
    public enum ImportsLoadStrategy
    {
        // With the LazyLoad option, the imports will only be loaded when a symbol from an external file is needed by the OM.
        LazyLoad,
        // The imports will be loaded along with the file.
        Load,
        // The imports will not be loaded at all. If a symbol is needed the OM will log an error.
        DoNotLoad
    }
}
