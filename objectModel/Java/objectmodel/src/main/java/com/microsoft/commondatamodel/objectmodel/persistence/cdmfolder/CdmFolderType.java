// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.*;
import com.microsoft.commondatamodel.objectmodel.cdm.projections.*;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.projections.*;
import com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder.types.projections.OperationAlterTraits;
import com.microsoft.commondatamodel.objectmodel.persistence.common.InterfaceToImpl;
import com.microsoft.commondatamodel.objectmodel.persistence.common.PersistenceType;

public class CdmFolderType implements PersistenceType {

  private InterfaceToImpl registeredClasses;

  public CdmFolderType() {
    registeredClasses = new InterfaceToImpl();
    registeredClasses.register(CdmArgumentDefinition.class, ArgumentPersistence.class);
    registeredClasses.register(CdmAttributeContext.class, AttributeContextPersistence.class);
    registeredClasses.register(CdmAttributeContextReference.class, AttributeContextReferencePersistence.class);
    registeredClasses.register(CdmAttributeGroupDefinition.class, AttributeGroupPersistence.class);
    registeredClasses.register(CdmAttributeGroupReference.class, AttributeGroupReferencePersistence.class);
    registeredClasses.register(CdmAttributeReference.class, AttributeReferencePersistence.class);
    registeredClasses.register(CdmAttributeResolutionGuidance.class, AttributeResolutionGuidancePersistence.class);
    registeredClasses.register(CdmConstantEntityDefinition.class, ConstantEntityPersistence.class);
    registeredClasses.register(CdmDataPartitionDefinition.class, DataPartitionPersistence.class);
    registeredClasses.register(CdmDataPartitionPatternDefinition.class, DataPartitionPatternPersistence.class);
    registeredClasses.register(CdmDataTypeDefinition.class, DataTypePersistence.class);
    registeredClasses.register(CdmDataTypeReference.class, DataTypeReferencePersistence.class);
    registeredClasses.register(CdmDocumentDefinition.class, DocumentPersistence.class);
    registeredClasses.register(CdmEntityAttributeDefinition.class, EntityAttributePersistence.class);
    registeredClasses.register(CdmEntityDefinition.class, EntityPersistence.class);
    registeredClasses.register(CdmEntityReference.class, EntityReferencePersistence.class);
    registeredClasses.register(CdmManifestDeclarationDefinition.class, ManifestDeclarationPersistence.class);
    registeredClasses.register(CdmManifestDefinition.class, ManifestPersistence.class);
    registeredClasses.register(CdmImport.class, ImportPersistence.class);
    registeredClasses.register(CdmLocalEntityDeclarationDefinition.class, LocalEntityDeclarationPersistence.class);
    registeredClasses.register(CdmParameterDefinition.class, ParameterPersistence.class);
    registeredClasses.register(CdmPurposeDefinition.class, PurposePersistence.class);
    registeredClasses.register(CdmPurposeReference.class, PurposeReferencePersistence.class);
    registeredClasses.register(CdmReferencedEntityDeclarationDefinition.class, ReferencedEntityDeclarationPersistence.class);
    registeredClasses.register(CdmTraitDefinition.class, TraitPersistence.class);
    registeredClasses.register(CdmTraitGroupDefinition.class, TraitGroupPersistence.class);
    registeredClasses.register(CdmTraitReference.class, TraitReferencePersistence.class);
    registeredClasses.register(CdmTraitGroupReference.class, TraitGroupReferencePersistence.class);
    registeredClasses.register(CdmTypeAttributeDefinition.class, TypeAttributePersistence.class);
    registeredClasses.register(CdmProjection.class, ProjectionPersistence.class);
    registeredClasses.register(CdmOperationAddCountAttribute.class, OperationAddCountAttributePersistence.class);
    registeredClasses.register(CdmOperationAddSupportingAttribute.class, OperationAddSupportingAttributePersistence.class);
    registeredClasses.register(CdmOperationAddTypeAttribute.class, OperationAddTypeAttributePersistence.class);
    registeredClasses.register(CdmOperationExcludeAttributes.class, OperationExcludeAttributesPersistence.class);
    registeredClasses.register(CdmOperationArrayExpansion.class, OperationArrayExpansionPersistence.class);
    registeredClasses.register(CdmOperationCombineAttributes.class, OperationCombineAttributesPersistence.class);
    registeredClasses.register(CdmOperationRenameAttributes.class, OperationRenameAttributesPersistence.class);
    registeredClasses.register(CdmOperationReplaceAsForeignKey.class, OperationReplaceAsForeignKeyPersistence.class);
    registeredClasses.register(CdmOperationIncludeAttributes.class, OperationIncludeAttributesPersistence.class);
    registeredClasses.register(CdmOperationAddAttributeGroup.class, OperationAddAttributeGroupPersistence.class);
    registeredClasses.register(CdmOperationAlterTraits.class, OperationAlterTraits.class);
    registeredClasses.register(CdmOperationAddArtifactAttribute.class, OperationAddArtifactAttributePersistence.class);
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
