package com.microsoft.commondatamodel.objectmodel.utilities;

enum CdmTraitName {
  VERSION("is.CDM.entityVersion"),
  ATTRIBUTE_GROUP("is.CDM.attributeGroup"),
  SOURCE_NAME("is.CDS.sourceNamed"),
  DISPLAY_NAME("is.localized.displayedAs"),
  DESCRIPTION("is.localized.describedAs"),
  SOURCE_ORDERING("is.CDS.ordered"),
  IS_IDENTIFIED_BY("is.identifiedBy"),
  IS_READ_ONLY("is.readOnly"),
  IS_NULLABLE("is.nullable"),
  VALUE_CONSTRAINED_TO_LIST("is.constrainedList"),
  IS_CONSTRAINED("is.constrained"),
  DOES_HAVE_DEFAULT("does.haveDefault"),

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
