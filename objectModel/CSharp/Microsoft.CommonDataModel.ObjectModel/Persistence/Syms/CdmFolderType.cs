// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.Syms
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Common;

    class SymsFolderType : IPersistenceType
    {
        public InterfaceToImpl RegisteredClasses { get; set; }

        public SymsFolderType()
        {
            RegisteredClasses = new InterfaceToImpl();
            RegisteredClasses.Register<CdmArgumentDefinition, ArgumentPersistence>();
            RegisteredClasses.Register<CdmAttributeContext, AttributeContextPersistence>();
            RegisteredClasses.Register<CdmAttributeContextReference, AttributeContextReferencePersistence>();
            RegisteredClasses.Register<CdmAttributeGroupDefinition, AttributeGroupPersistence>();
            RegisteredClasses.Register<CdmAttributeGroupReference, AttributeGroupReferencePersistence>();
            RegisteredClasses.Register<CdmAttributeReference, AttributeReferencePersistence>();
            RegisteredClasses.Register<CdmAttributeResolutionGuidance, AttributeResolutionGuidancePersistence>();
            RegisteredClasses.Register<CdmConstantEntityDefinition, ConstantEntityPersistence>();
            RegisteredClasses.Register<CdmDataPartitionDefinition, DataPartitionPersistence>();
            RegisteredClasses.Register<CdmDataPartitionPatternDefinition, DataPartitionPatternPersistence>();
            RegisteredClasses.Register<CdmDataTypeDefinition, DataTypePersistence>();
            RegisteredClasses.Register<CdmDataTypeReference, DataTypeReferencePersistence>();
            RegisteredClasses.Register<CdmDocumentDefinition, DocumentPersistence>();
            RegisteredClasses.Register<CdmEntityAttributeDefinition, EntityAttributePersistence>();
            RegisteredClasses.Register<CdmEntityDefinition, EntityPersistence>();
            RegisteredClasses.Register<CdmEntityReference, EntityReferencePersistence>();
            RegisteredClasses.Register<CdmManifestDeclarationDefinition, ManifestDeclarationPersistence>();
            RegisteredClasses.Register<CdmManifestDefinition, ManifestPersistence>();
            RegisteredClasses.Register<CdmImport, ImportPersistence>();
            RegisteredClasses.Register<CdmLocalEntityDeclarationDefinition, LocalEntityDeclarationPersistence>();
            RegisteredClasses.Register<CdmParameterDefinition, ParameterPersistence>();
            RegisteredClasses.Register<CdmPurposeDefinition, PurposePersistence>();
            RegisteredClasses.Register<CdmPurposeReference, PurposeReferencePersistence>();
            RegisteredClasses.Register<CdmReferencedEntityDeclarationDefinition, ReferencedEntityDeclarationPersistence>();
            RegisteredClasses.Register<CdmTraitDefinition, TraitPersistence>();
            RegisteredClasses.Register<CdmTraitGroupDefinition, TraitGroupPersistence>();
            RegisteredClasses.Register<CdmTraitReference, TraitReferencePersistence>();
            RegisteredClasses.Register<CdmTraitGroupReference, TraitGroupReferencePersistence>();
        }
    }
}
