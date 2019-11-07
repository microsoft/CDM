// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.enums;

/**
 * Definition of validation process steps.
 */
public enum CdmValidationStep {
  Start,
  Imports,
  Integrity,
  Declarations,
  References,
  Parameters,
  TraitAppliers,
  MinimumForResolving,
  Traits,
  Attributes,
  EntityReferences,
  Cleanup,
  Finished,
  Error
}
