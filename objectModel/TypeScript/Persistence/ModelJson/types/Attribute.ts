import { DataObject, dataObjectBaseProperties } from './DataObject';
import { DataType } from './DataType';

/**
 * Represents a field within an entity.
 */
export abstract class Attribute extends DataObject {
    public dataType : DataType;
}

export const attributeBaseProperties: string[] = [
    ...dataObjectBaseProperties,
    'dataType'
];
