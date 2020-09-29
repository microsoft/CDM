// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

public interface CdmContainerDefinition extends CdmObject {

  /**
   * The namespace where this object can be found.
   * @return String
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  String getNamespace();

  /**
   * The namespace where this object can be found.
   * @param value String
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  void setNamespace(String value);

  /**
   * The folder where this object exists.
   * @return string
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  String getFolderPath();

  /**
   * The folder where this object exists.
   * @param value String
   * @deprecated This function is extremely likely to be removed in the public interface, and not
   * meant to be called externally at all. Please refrain from using it.
   */
  @Deprecated
  void setFolderPath(String value);
}
