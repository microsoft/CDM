import { Entity, entityBaseProperties } from './Entity';

/**
 * Represents an entity that belongs to an external model.
 */
export abstract class ReferenceEntity extends Entity {
    public source: string;
    public modelId: string;
}

export const referenceEntityBaseProperties: string[] = [
    ...entityBaseProperties,
    'source',
    'modelId'
];
