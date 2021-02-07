// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.enums;

/**
 * Definition of validation process steps.
 */
public enum CdmValidationStep {
  Attributes,
  Cleanup,
  Declarations,
  EntityReferences,
  Error,
  Finished,
  Imports,
  Integrity,
  MinimumForResolving,
  Parameters,
  References,
  Start,
  TraitAppliers,
  Traits,
}
