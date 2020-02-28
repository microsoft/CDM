// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.utilities;

enum CdmTraitName {
  ATTRIBUTE_GROUP("is.CDM.attributeGroup"),
  DESCRIPTION("is.localized.describedAs"),
  DISPLAY_NAME("is.localized.displayedAs"),
  DOES_HAVE_DEFAULT("does.haveDefault"),
  IS_CONSTRAINED("is.constrained"),
  IS_IDENTIFIED_BY("is.identifiedBy"),
  IS_NULLABLE("is.nullable"),
  IS_READ_ONLY("is.readOnly"),
  SOURCE_NAME("is.CDS.sourceNamed"),
  SOURCE_ORDERING("is.CDS.ordered"),
  VALUE_CONSTRAINED_TO_LIST("is.constrainedList"),
  VERSION("is.CDM.entityVersion"),

  DEFAULT("default");

  private final String traitName;

  CdmTraitName(final String value) {
    this.traitName = value;
  }

  @Override
  public String toString() {
    return this.traitName;
  }
}
