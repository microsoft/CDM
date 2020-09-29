// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

/**
 * Specifies how the OM will load the imports from a document.
 */
export enum importsLoadStrategy {
    // With the lazyLoad option, the imports will only be loaded when a symbol from an external file is needed by the OM.
    lazyLoad,
    // The imports will be loaded along with the file.
    load,
    // The imports will not be loaded at all. If a symbol is needed the OM will log an error.
    doNotLoad
}
