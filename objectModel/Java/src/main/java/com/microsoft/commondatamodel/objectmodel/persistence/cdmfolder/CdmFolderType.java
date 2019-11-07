package com.microsoft.commondatamodel.objectmodel.persistence.cdmfolder;

import com.microsoft.commondatamodel.objectmodel.cdm.CdmArgumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContext;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeContextReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeGroupReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmAttributeResolutionGuidance;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmConstantEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataPartitionPatternDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataTypeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDataTypeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmDocumentDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmEntityReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmImport;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmLocalEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmManifestDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmParameterDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmPurposeDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmPurposeReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmReferencedEntityDeclarationDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitDefinition;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTraitReference;
import com.microsoft.commondatamodel.objectmodel.cdm.CdmTypeAttributeDefinition;
import com.microsoft.commondatamodel.objectmodel.persistence.common.InterfaceToImpl;
import com.microsoft.commondatamodel.objectmodel.persistence.common.PersistenceType;

public class CdmFolderType implements PersistenceType {

  private InterfaceToImpl registeredClasses;

  public CdmFolderType() {
    registeredClasses = new InterfaceToImpl();
    registeredClasses.register(CdmArgumentDefinition.class, ArgumentPersistence.class);
    registeredClasses.register(CdmAttributeContext.class, AttributeContextPersistence.class);
    registeredClasses
            .register(CdmAttributeContextReference.class, AttributeContextReferencePersistence.class);
    registeredClasses.register(CdmAttributeGroupDefinition.class, AttributeGroupPersistence.class);
    registeredClasses
            .register(CdmAttributeGroupReference.class, AttributeGroupReferencePersistence.class);
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
    registeredClasses
        .register(CdmLocalEntityDeclarationDefinition.class, LocalEntityDeclarationPersistence.class);
    registeredClasses.register(CdmParameterDefinition.class, ParameterPersistence.class);
    registeredClasses.register(CdmPurposeDefinition.class, PurposePersistence.class);
    registeredClasses.register(CdmPurposeReference.class, PurposeReferencePersistence.class);
    registeredClasses.register(CdmReferencedEntityDeclarationDefinition.class,
        ReferencedEntityDeclarationPersistence.class);
    registeredClasses.register(CdmTraitDefinition.class, TraitPersistence.class);
    registeredClasses.register(CdmTraitReference.class, TraitReferencePersistence.class);
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
