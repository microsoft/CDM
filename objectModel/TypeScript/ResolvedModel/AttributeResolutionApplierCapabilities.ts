// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
     * @internal
     */
export interface AttributeResolutionApplierCapabilities {
    canAlterDirectives: boolean;
    canCreateContext: boolean;
    canRemove: boolean;
    canAttributeModify: boolean;
    canGroupAdd: boolean;
    canRoundAdd: boolean;
    canAttributeAdd: boolean;
}
