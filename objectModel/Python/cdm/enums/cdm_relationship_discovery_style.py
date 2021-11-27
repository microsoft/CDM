# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from .utils import AutoNumber


class CdmRelationshipDiscoveryStyle(AutoNumber):
    """Describes the types of relationships you want populated in a Manifest.
    'NONE' will not add any relationships to a Folio
    'EXCLUSIVE' will only include relationships where the toEntity and fromEntity are entities found in this folio
    'ALL' will include all relationships including any relationships where the toEntity or the fromEntity point to entities not found in the folio"""
    NONE = ()
    EXCLUSIVE = ()
    ALL = ()
