// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.modeljson;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmE2ERelationship;
import com.microsoft.commondatamodel.objectmodel.persistence.common.InterfaceToImpl;
import com.microsoft.commondatamodel.objectmodel.persistence.common.PersistenceType;

public class ModelJsonType implements PersistenceType {

  private InterfaceToImpl registeredClasses;

  public ModelJsonType() {
    registeredClasses = new InterfaceToImpl();
    registeredClasses.register(CdmArgumentDefinition.class, ArgumentPersistence.class);
    registeredClasses.register(CdmDataPartitionDefinition.class, DataPartitionPersistence.class);
    registeredClasses.register(CdmDocumentDefinition.class, DocumentPersistence.class);
    registeredClasses.register(CdmEntityDefinition.class, EntityPersistence.class);
    registeredClasses.register(CdmManifestDefinition.class, ManifestPersistence.class);
    registeredClasses.register(CdmLocalEntityDeclarationDefinition.class, LocalEntityDeclarationPersistence.class);
    registeredClasses.register(CdmReferencedEntityDeclarationDefinition.class, ReferencedEntityDeclarationPersistence.class);
    registeredClasses.register(CdmE2ERelationship.class, RelationshipPersistence.class);
    registeredClasses.register(CdmTypeAttributeDefinition.class, TypeAttributePersistence.class);
  }

  @Override
  public InterfaceToImpl getRegisteredClasses() {
    return registeredClasses;
  }

  @Override
  public void setRegisteredClasses(final InterfaceToImpl registeredClasses) {
    this.registeredClasses = registeredClasses;
  }

}
