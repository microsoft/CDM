// Copyright (c) Microsoft Corporation.

package com.microsoft.commondatamodel.objectmodel.utilities;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmObject;

@FunctionalInterface
public interface VisitCallback {

  boolean invoke(CdmObject obj, String str);
}
