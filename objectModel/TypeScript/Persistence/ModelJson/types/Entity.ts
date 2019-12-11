import { DataObject, dataObjectBaseProperties } from './DataObject';

/**
 * Defines a base class for an entity.
 * An entity is a set of attributes and metadata that defines a concept
 * like Account or Contact and can be defined by any data producer.
 */
export abstract class Entity extends DataObject {
    public $type : string;
    public 'cdm:lastChildFileModifiedTime'? : string;
    public 'cdm:lastFileModifiedTime'? : string;
    public 'cdm:lastFileStatusCheckTime'? : string;
}

export const entityBaseProperties: string[] = [
    ...dataObjectBaseProperties,
    '$type',
    'cdm:lastChildFileModifiedTime',
    'cdm:lastFileModifiedTime',
    'cdm:lastFileStatusCheckTime'
];
