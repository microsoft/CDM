// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Enums
{
    /// <summary>
    /// Describes the types of relationships you want populated in a Manifest.
    /// 'None' will not add any relationships to a Manifest.
    /// 'Exclusive' will only include relationships where the toEntity and 
    ///     fromEntity are entities found in this manifest.
    /// 'All' will include all relationships including any relationships where 
    ///     the toEntity or the fromEntity point to entities not found in the manifest.
    /// </summary>
    public enum CdmRelationshipDiscoveryStyle
    {
        None,
        Exclusive,
        All
    }
}
