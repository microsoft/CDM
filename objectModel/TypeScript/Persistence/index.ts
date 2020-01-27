// CdmFolder
import { ArgumentPersistence as CdmFolderArgumentPersistence } from './CdmFolder/ArgumentPersistence';
import { AttributeContextPersistence as CdmFolderAttributeContextPersistence } from './CdmFolder/AttributeContextPersistence';
import { AttributeContextReferencePersistence as CdmFolderAttributeContextReferencePersistence } from './CdmFolder/AttributeContextReferencePersistence';
import { AttributeGroupPersistence as CdmFolderAttributeGroupPersistence } from './CdmFolder/AttributeGroupPersistence';
import { AttributeGroupReferencePersistence as CdmFolderAttributeGroupReferencePersistence } from './CdmFolder/AttributeGroupReferencePersistence';
import { AttributeReferencePersistence as CdmFolderAttributeReferencePersistence } from './CdmFolder/AttributeReferencePersistence';
import { AttributeResolutionGuidancePersistence as CdmFolderAttributeResolutionGuidancePersistence } from './CdmFolder/AttributeResolutionGuidancePersistence';
import { ConstantEntityPersistence as CdmFolderConstantEntityPersistence } from './CdmFolder/ConstantEntityPersistence';
import { DataPartitionPatternPersistence as CdmFolderDataPartitionPatternPersistence } from './CdmFolder/DataPartitionPatternPersistence';
import { DataPartitionPersistence as CdmFolderDataPartitionPersistence } from './CdmFolder/DataPartitionPersistence';
import { DataTypePersistence as CdmFolderDataTypePersistence } from './CdmFolder/DataTypePersistence';
import { DataTypeReferencePersistence as CdmFolderDataTypeReferencePersistence } from './CdmFolder/DataTypeReferencePersistence';
import { DocumentPersistence as CdmFolderDocumentPersistence } from './CdmFolder/DocumentPersistence';
import { E2ERelationshipPersistence as CdmFolderE2ERelationshipPersistence } from './CdmFolder/E2ERelationshipPersistence';
import { EntityAttributePersistence as CdmFolderEntityAttributePersistence } from './CdmFolder/EntityAttributePersistence';
import { EntityPersistence as CdmFolderEntityPersistence } from './CdmFolder/EntityPersistence';
import { EntityReferencePersistence as CdmFolderEntityReferencePersistence } from './CdmFolder/EntityReferencePersistence';
import { ImportPersistence as CdmFolderImportPersistence } from './CdmFolder/ImportPersistence';
import { LocalEntityDeclarationPersistence as CdmFolderLocalEntityDeclarationPersistence } from './CdmFolder/LocalEntityDeclarationPersistence';
import { ManifestDeclarationPersistence as CdmFolderManifestDeclarationPersistence } from './CdmFolder/ManifestDeclarationPersistence';
import { ManifestPersistence as CdmFolderManifestPersistence } from './CdmFolder/ManifestPersistence';
import { ParameterPersistence as CdmFolderParameterPersistence } from './CdmFolder/ParameterPersistence';
import { PurposePersistence as CdmFolderPurposePersistence } from './CdmFolder/PurposePersistence';
import { PurposeReferencePersistence as CdmFolderPurposeReferencePersistence } from './CdmFolder/PurposeReferencePersistence';
import { ReferencedEntityDeclarationPersistence as CdmFolderReferencedEntityDeclarationPersistence } from './CdmFolder/ReferencedEntityDeclarationPersistence';
import { TraitPersistence as CdmFolderTraitPersistence } from './CdmFolder/TraitPersistence';
import { TraitReferencePersistence as CdmFolderTraitReferencePersistence } from './CdmFolder/TraitReferencePersistence';
import { TypeAttributePersistence as CdmFolderTypeAttributePersistence } from './CdmFolder/TypeAttributePersistence';
import * as CdmFolderTypes from './CdmFolder/types';

// ModelJson
import { ArgumentPersistence as ModelJsonArgumentPersistence } from './ModelJson/ArgumentPersistence';
import { DataPartitionPersistence as ModelJsonDataPartitionPersistence } from './ModelJson/DataPartitionPersistence';
import { DocumentPersistence as ModelJsonDocumentPersistence } from './ModelJson/DocumentPersistence';
import { EntityPersistence as ModelJsonEntityPersistence } from './ModelJson/EntityPersistence';
import { LocalEntityDeclarationPersistence as ModelJsonLocalEntityDeclarationPersistence } from './ModelJson/LocalEntityDeclarationPersistence';
import { ManifestPersistence as ModelJsonManifestPersistence } from './ModelJson/ManifestPersistence';
import { ReferencedEntityDeclarationPersistence as ModelJsonReferencedEntityDeclarationPersistence } from './ModelJson/ReferencedEntityDeclarationPersistence';
import { RelationshipPersistence as ModelJsonRelationshipPersistence } from './ModelJson/RelationshipPersistence';
import { TypeAttributePersistence as ModelJsonTypeAttributePersistence } from './ModelJson/TypeAttributePersistence';
import * as ModelJsonUtils from './ModelJson/utils';

const CdmFolder = {
    ArgumentPersistence: CdmFolderArgumentPersistence,
    AttributeContextPersistence: CdmFolderAttributeContextPersistence,
    AttributeContextReferencePersistence: CdmFolderAttributeContextReferencePersistence,
    AttributeGroupPersistence: CdmFolderAttributeGroupPersistence,
    AttributeGroupReferencePersistence: CdmFolderAttributeGroupReferencePersistence,
    AttributeReferencePersistence: CdmFolderAttributeReferencePersistence,
    ConstantEntityPersistence: CdmFolderConstantEntityPersistence,
    DataTypePersistence: CdmFolderDataTypePersistence,
    DataTypeReferencePersistence: CdmFolderDataTypeReferencePersistence,
    DataPartitionPatternPersistence: CdmFolderDataPartitionPatternPersistence,
    DataPartitionPersistence: CdmFolderDataPartitionPersistence,
    DocumentPersistence: CdmFolderDocumentPersistence,
    E2ERelationshipPersistence: CdmFolderE2ERelationshipPersistence,
    EntityPersistence: CdmFolderEntityPersistence,
    EntityAttributePersistence: CdmFolderEntityAttributePersistence,
    EntityReferencePersistence: CdmFolderEntityReferencePersistence,
    ManifestDeclarationPersistence: CdmFolderManifestDeclarationPersistence,
    ManifestPersistence: CdmFolderManifestPersistence,
    ImportPersistence: CdmFolderImportPersistence,
    LocalEntityDeclarationPersistence: CdmFolderLocalEntityDeclarationPersistence,
    ParameterPersistence: CdmFolderParameterPersistence,
    ReferencedEntityDeclarationPersistence: CdmFolderReferencedEntityDeclarationPersistence,
    PurposePersistence: CdmFolderPurposePersistence,
    PurposeReferencePersistence: CdmFolderPurposeReferencePersistence,
    TraitPersistence: CdmFolderTraitPersistence,
    TraitReferencePersistence: CdmFolderTraitReferencePersistence,
    TypeAttributePersistence: CdmFolderTypeAttributePersistence,
    AttributeResolutionGuidancePersistence: CdmFolderAttributeResolutionGuidancePersistence,
    types: CdmFolderTypes
};

const ModelJson = {
    ArgumentPersistence: ModelJsonArgumentPersistence,
    DataPartitionPersistence: ModelJsonDataPartitionPersistence,
    DocumentPersistence: ModelJsonDocumentPersistence,
    EntityPersistence: ModelJsonEntityPersistence,
    LocalEntityDeclarationPersistence: ModelJsonLocalEntityDeclarationPersistence,
    ManifestPersistence: ModelJsonManifestPersistence,
    ReferencedEntityDeclarationPersistence: ModelJsonReferencedEntityDeclarationPersistence,
    RelationshipPersistence: ModelJsonRelationshipPersistence,
    TypeAttributePersistence: ModelJsonTypeAttributePersistence,
    utils: ModelJsonUtils
};

import { PersistenceLayer } from './PersistenceLayer';

export {
    CdmFolder,
    ModelJson,
    PersistenceLayer
};
