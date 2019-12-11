import { MetadataObject } from './MetadataObject';

/**
 * Describes how entities are connected.
 */
export abstract class Relationship extends MetadataObject {
    public $type : string;
}
