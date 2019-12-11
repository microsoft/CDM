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
}
