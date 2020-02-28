// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.cdm;

import com.microsoft.commondatamodel.objectmodel.enums.CdmObjectType;

public class CdmDefinitionCollection extends CdmCollection<CdmObjectDefinition> {
  public CdmDefinitionCollection(final CdmCorpusContext ctx, final CdmObject owner) {
    super(ctx, owner, CdmObjectType.EntityDef);
  }

  @Override
  public CdmEntityDefinition add(final String name) {
    return this.add(name, false);
  }

  @Override
  public CdmEntityDefinition add(final String name, final boolean simpleRef) {
    return (CdmEntityDefinition) super.add(name, simpleRef);
  }

  /**
   * Creates a {@link CdmObject} of the provided type,
   * with the provided name and adds it to the collection.
   *
   * @param ofType The type of the object to be created and added to the list.
   * @param name   The name to be used for the created object.<
   * @return The created object after it was added to the collection.
   */
  public CdmObjectDefinition add(final CdmObjectType ofType, final String name) {
    final CdmObjectDefinition createdObject =
        this.getCtx().getCorpus().makeObject(ofType, name, false);
    return super.add(createdObject);
  }
}
