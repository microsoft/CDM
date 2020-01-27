import { MetadataObject, metadataObjectBaseProperties } from './MetadataObject';

/**
 * Defines a base class for a data object.
 */
export abstract class DataObject extends MetadataObject {
    public isHidden?: boolean;
}

export const dataObjectBaseProperties: string[] = [
    ...metadataObjectBaseProperties,
    'isHidden'
];
