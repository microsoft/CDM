package com.microsoft.commondatamodel.objectmodel.persistence.common;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;
import java.util.LinkedHashMap;
import java.util.Map;

public class InterfaceToImpl {

  public static final Map<Class, Class> persistenceClasses = new LinkedHashMap<>();

  public <T extends CdmObject> void register(final Class<T> interfaze, final Class clazz) {
    persistenceClasses.put(interfaze, clazz);
  }

  public <T extends CdmObject> Class getPersistenceClass(final Class<T> interfaze) {
    return persistenceClasses.getOrDefault(interfaze, null);
  }
}
