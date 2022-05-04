// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Enums
{
    public enum CdmIncrementalPartitionType
    {
        None,
        Insert,
        Update,
        Delete,
        Upsert,
        UpsertAndDelete
    }
}
