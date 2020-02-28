// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.common;

public interface PersistenceType {

  InterfaceToImpl getRegisteredClasses();

  void setRegisteredClasses(InterfaceToImpl registeredClasses);
}
