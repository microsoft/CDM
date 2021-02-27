// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

namespace Microsoft.CommonDataModel.ObjectModel.Persistence.ModelJson
{
    using Microsoft.CommonDataModel.ObjectModel.Cdm;
    using Microsoft.CommonDataModel.ObjectModel.Persistence.Common;

    class ModelJsonType : IPersistenceType
    {
        public InterfaceToImpl RegisteredClasses { get; set; }

        public ModelJsonType()
        {
            RegisteredClasses = new InterfaceToImpl();
            RegisteredClasses.Register<CdmArgumentDefinition, ArgumentPersistence>();
            RegisteredClasses.Register<CdmDataPartitionDefinition, DataPartitionPersistence>();
            RegisteredClasses.Register<CdmDocumentDefinition, DocumentPersistence>();
            RegisteredClasses.Register<CdmEntityDefinition, EntityPersistence>();
            RegisteredClasses.Register<CdmLocalEntityDeclarationDefinition, LocalEntityDeclarationPersistence>();
            RegisteredClasses.Register<CdmManifestDefinition, ManifestPersistence>();
            RegisteredClasses.Register<CdmReferencedEntityDeclarationDefinition, ReferencedEntityDeclarationPersistence>();
            RegisteredClasses.Register<CdmE2ERelationship, RelationshipPersistence>();
            RegisteredClasses.Register<CdmTypeAttributeDefinition, TypeAttributePersistence>();
        }
    }
}
