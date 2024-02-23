// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    public class FileStatusCheckOptions
    {
        public bool IncludeDataPartitionSize { get; set; }

        public double? RegexTimeoutSeconds { get; set; }
        
        public bool ThrowOnPartitionError { get; set; }
    }
}
