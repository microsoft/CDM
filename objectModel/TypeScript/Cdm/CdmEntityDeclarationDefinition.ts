// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import {
    CdmCollection,
    CdmDataPartitionDefinition,
    CdmDataPartitionPatternDefinition,
    CdmFileStatus,
    CdmObjectDefinition
} from '../internal';

export interface CdmEntityDeclarationDefinition extends CdmObjectDefinition, CdmFileStatus {
    entityName: string;
    /**
     * EntityPath is only implemented by LocalEntityDeclaration
     */
    entityPath: string;
    /**
     * DataPartition is only implemented by LocalEntityDeclaration
     */
    dataPartitions: CdmCollection<CdmDataPartitionDefinition>;    
    /**
     * DataPartitionPatters is only implemented by LocalEntityDeclaration
     */
    dataPartitionPatterns: CdmCollection<CdmDataPartitionPatternDefinition>;
    /**
     * incrementalPartitions is only implemented by LocalEntityDeclaration
     */
    incrementalPartitions: CdmCollection<CdmDataPartitionDefinition>;    
    /**
     * incrementalPartitionPatterns is only implemented by LocalEntityDeclaration
     */
    incrementalPartitionPatterns: CdmCollection<CdmDataPartitionPatternDefinition>;
}
