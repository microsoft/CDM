package com.microsoft.commondatamodel.objectmodel.persistence.common;

public interface PersistenceType {

  InterfaceToImpl getRegisteredClasses();

  void setRegisteredClasses(InterfaceToImpl registeredClasses);
}
