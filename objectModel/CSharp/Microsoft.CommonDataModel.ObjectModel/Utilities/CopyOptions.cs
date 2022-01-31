// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    public class CopyOptions
    {
        public bool? StringRefs { get; set; } // turn simple named string object references into objects with a relative path. used for links in viz
        public bool? RemoveSingleRowLocalizedTableTraits { get; set; }

        /// <summary>
        /// Determines if the config.json file should be saved when calling SaveAsAsync.
        /// </summary>
        public bool? SaveConfigFile { get; set; }

        /// <summary>
        /// A value that helps us to figure out is the document that is using this object top level.
        /// </summary>
        internal bool IsTopLevelDocument { get; set; }
        internal string PersistenceTypeName { get; set; }

        public CopyOptions()
        {
            this.IsTopLevelDocument = true;
            this.StringRefs = false;
            PersistenceTypeName = "";
        }
    }
}
