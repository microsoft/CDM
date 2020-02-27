// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.enums;

/**
 * Describes the types of relationships you want populated in a Manifest.
 * 'None' will not add any relationships to a Folio
 * 'Exclusive' will only include relationships where the toEntity and 
 *     fromEntity are entities found in this folio
 * 'All' will include all relationships including any relationships where 
 *     the toEntity or the fromEntity point to entities not found in the folio
 */
public enum CdmRelationshipDiscoveryStyle {
    None,
    Exclusive,
    All
} 
