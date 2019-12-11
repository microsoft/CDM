import { DataObject, dataObjectBaseProperties } from './DataObject';
import { Entity } from './Entity';
import { ReferenceModel } from './ReferenceModel';
import { SingleKeyRelationship } from './SingleKeyRelationship';

/**
 * Represents the data in the CDM folder, metadata and location,
 * as well as how it was generated and by which data producer.
 */
export abstract class Model extends DataObject {
    public application : string;
    public version : string;
    public entities : Entity[];
    public relationships : SingleKeyRelationship[];
    public referenceModels : ReferenceModel[];
    public culture : string;
    public modifiedTime? : string;
    public 'cdm:imports': object[];
    public 'cdm:lastFileStatusCheckTime'? : string;
    public 'cdm:lastChildFileModifiedTime'? : string;
}

export const modelBaseProperties: string[] = [
    ...dataObjectBaseProperties,
    'application',
    'version',
    'entities',
    'relationships',
    'referenceModels',
    'culture',
    'modifiedTime',
    'cdm:imports',
    'cdm:lastFileStatusCheckTime',
    'cdm:lastChildFileModifiedTime'
];
