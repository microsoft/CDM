// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

export enum cdmValidationStep {
    start,
    imports,
    integrity,
    declarations,
    references,
    parameters,
    traitAppliers,
    minimumForResolving,
    traits,
    attributes,
    entityReferences,
    finished,
    error
}
