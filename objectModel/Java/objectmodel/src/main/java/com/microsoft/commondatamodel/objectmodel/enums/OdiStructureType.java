package com.microsoft.commondatamodel.objectmodel.enums;

public enum OdiStructureType {
  None,
  Unknown,

  ActualEntity,
  LogicalEntity,
  ResolvedReference,
  UnmappedResolvedReference,

  LogicalTypeAttribute,
  LogicalEntityAttribute,
  IdentityValueAttribute,
  IdentityTypeAttribute,

  PhysicalLayout,
  PhysicalColumn,
  PhysicalColumnEntityGroup,
  PhysicalColumnInstanceGroup,
  Trait,
  Traits,

  GeneratedSet,
  GeneratedRound,
  GeneratedAttribute,

  Top,
  Extends;

  public static OdiStructureType defaultValue() {
    return OdiStructureType.None;
  }
}
