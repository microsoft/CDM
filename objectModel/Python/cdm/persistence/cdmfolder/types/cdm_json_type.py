# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for license information.

from typing import Union

from .argument import Argument
from .attribute_context import AttributeContext
from .attribute_group import AttributeGroup
from .attribute_group_reference import AttributeGroupReference
from .cdm_import import Import
from .constant_entity import ConstantEntity
from .data_partition import DataPartition
from .data_partition_pattern import DataPartitionPattern
from .data_type import DataType
from .data_type_reference import DataTypeReference
from .document_content import DocumentContent
from .entity import Entity
from .entity_attribute import EntityAttribute
from .entity_reference import EntityReference
from .folder import Folder
from .local_entity_declaration import LocalEntityDeclaration
from .manifest_declaration import ManifestDeclaration
from .parameter import Parameter
from .projections.operation_add_count_attribute import OperationAddCountAttribute
from .projections.operation_add_supporting_attribute import OperationAddSupportingAttribute
from .projections.operation_add_type_attribute import OperationAddTypeAttribute
from .projections.operation_exclude_attributes import OperationExcludeAttributes
from .projections.operation_array_expansion import OperationArrayExpansion
from .projections.operation_combine_attributes import OperationCombineAttributes
from .projections.operation_rename_attributes import OperationRenameAttributes
from .projections.operation_replace_as_foreign_key import OperationReplaceAsForeignKey
from .projections.operation_include_attributes import OperationIncludeAttributes
from .projections.operation_add_attribute_group import OperationAddAttributeGroup
from .projections.projection import Projection
from .purpose import Purpose
from .purpose_reference import PurposeReference
from .referenced_entity_declaration import ReferencedEntityDeclaration
from .trait import Trait
from .trait_reference import TraitReference
from .type_attribute import TypeAttribute

CdmJsonType = Union[
    str,
    object,
    Argument,
    AttributeContext,
    AttributeGroup,
    AttributeGroupReference,
    ConstantEntity,
    DataPartition,
    DataPartitionPattern,
    DataType,
    DataTypeReference,
    DocumentContent,
    Entity,
    EntityAttribute,
    EntityReference,
    Folder,
    Import,
    LocalEntityDeclaration,
    ManifestDeclaration,
    OperationAddCountAttribute,
    OperationAddSupportingAttribute,
    OperationAddTypeAttribute,
    OperationExcludeAttributes,
    OperationArrayExpansion,
    OperationCombineAttributes,
    OperationRenameAttributes,
    OperationReplaceAsForeignKey,
    OperationIncludeAttributes,
    OperationAddAttributeGroup,
    Parameter,
    Projection,
    Purpose,
    PurposeReference,
    ReferencedEntityDeclaration,
    Trait,
    TraitReference,
    TypeAttribute
]
