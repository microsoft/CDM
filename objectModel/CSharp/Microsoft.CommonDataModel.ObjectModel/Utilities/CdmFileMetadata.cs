// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Utilities
{
    using System;

    public class CdmFileMetadata
    {
        public long? FileSizeBytes { get; set; }

        public DateTimeOffset? LastModifiedTime { get; set; }
    }
}
