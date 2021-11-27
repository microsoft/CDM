// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CardinalitySettings } from '../../internal';
import { CdmFolder } from '..';
import {
    ArgumentValue,
    CdmAttribute,
    CdmAttributeItem,
    CdmCollection,
    CdmCorpusContext,
    cdmLogCode,
    CdmObject,
    CdmObjectDefinition,
    CdmObjectReference,
    CdmTraitReferenceBase,
    copyOptions,
    identifierRef,
    Logger,
    resolveOptions
} from '../../internal';
import {
    AttributeGroupReference,
    CardinalitySettingsData,
    CdmJsonType,
    DataTypeReference,
    EntityAttribute,
    EntityReferenceDefinition,
    PurposeReference,
    TraitGroupReference,
    TraitReference,
    TypeAttribute
} from './types';

function isTypeAttribute(object: object): object is TypeAttribute {
    return !('entity' in object);
}

function isEntityAttribute(object: object): object is EntityAttribute {
    return 'entity' in object;
}

function isAttributeGroupReference(object: object): object is AttributeGroupReference {
    return 'attributeGroupReference' in object;
}

/**
 * Converts a JSON object to a CdmCollection of TraitReferences and TraitGroupReferences
 */
export function createTraitReferenceArray(
    ctx: CdmCorpusContext,
    object: (string | TraitReference | TraitGroupReference)[]): CdmTraitReferenceBase[] {
    if (!object || !object.map) { return; }

    const result: CdmTraitReferenceBase[] = [];
    object.forEach((traitReference: string | TraitReference | TraitGroupReference) => {
        if (typeof traitReference !== 'string' && 'traitGroupReference' in traitReference) {
            result.push(CdmFolder.TraitGroupReferencePersistence.fromData(ctx, traitReference as TraitGroupReference));
        } else {
            result.push(CdmFolder.TraitReferencePersistence.fromData(ctx, traitReference));
        }
    });

    return result;
}

/**
 * Adds all elements of an array to a CdmCollection
 */
export function addArrayToCdmCollection<T extends CdmObject>(cdmCollection: CdmCollection<T>, array: T[]): void {
    if (cdmCollection && array) {
        for (const element of array) {
            cdmCollection.push(element);
        }
    }
}

/**
 * Creates a CDM object from a JSON object
 */
export function createConstant(ctx: CdmCorpusContext, object: CdmJsonType): ArgumentValue {
    if (object === undefined || object === null) {
        return undefined;
    }
    if (typeof object === 'string') {
        return object;
    } else {
        const objectproperties: string[] = Object.getOwnPropertyNames(object);
        const checkExistingProperty: (propertyName: string) => boolean
            = (propertyName: string): boolean => {
                return objectproperties.some(
                    (element: string) => {
                        return element === propertyName;
                    });
            };
        if (checkExistingProperty('purpose') || checkExistingProperty('dataType') || checkExistingProperty('entity')) {
            if (checkExistingProperty('dataType')) {
                return CdmFolder.TypeAttributePersistence.fromData(ctx, object as TypeAttribute);
            } else if (checkExistingProperty('entity')) {
                return CdmFolder.EntityAttributePersistence.fromData(ctx, object as EntityAttribute);
            } else {
                return object;
            }
        } else if (checkExistingProperty('purposeReference')) {
            return CdmFolder.PurposeReferencePersistence.fromData(ctx, object as PurposeReference);
        } else if (checkExistingProperty('traitReference')) {
            return CdmFolder.TraitReferencePersistence.fromData(ctx, object as TraitReference);
        } else if (checkExistingProperty('traitGroupReference')) {
            return CdmFolder.TraitGroupReferencePersistence.fromData(ctx, object as TraitGroupReference);
        } else if (checkExistingProperty('dataTypeReference')) {
            return CdmFolder.DataTypeReferencePersistence.fromData(ctx, object as DataTypeReference);
        } else if (checkExistingProperty('entityReference')) {
            return CdmFolder.EntityReferencePersistence.fromData(ctx, object as EntityReferenceDefinition);
        } else if (checkExistingProperty('attributeGroupReference')) {
            return CdmFolder.AttributeGroupReferencePersistence.fromData(ctx, object as AttributeGroupReference);
        } else {
            return object;
        }
    }
}

/**
 * Converts a JSON object to an Attribute object
 */
export function createAttribute(ctx: CdmCorpusContext, object: (string | AttributeGroupReference | EntityAttribute | TypeAttribute), entityName?: string)
    : CdmAttributeItem {
    if (!object) {
        return undefined;
    }

    if (typeof object === 'string' || isAttributeGroupReference(object)) {
        return CdmFolder.AttributeGroupReferencePersistence.fromData(ctx, object, entityName);
    } else if (isEntityAttribute(object)) {
        return CdmFolder.EntityAttributePersistence.fromData(ctx, object);
    } else if (isTypeAttribute(object)) {
        return CdmFolder.TypeAttributePersistence.fromData(ctx, object, entityName);
    }
}

/**
 * Converts a JSON object to a CdmCollection of attributes
 */
export function createAttributeArray(
    ctx: CdmCorpusContext,
    object: (string | AttributeGroupReference | EntityAttribute | TypeAttribute)[],
    entityName?: string): CdmAttributeItem[] {
    if (!object) {
        return undefined;
    }

    const result: CdmAttributeItem[] = [];

    const l: number = object.length;
    for (let i: number = 0; i < l; i++) {
        const ea: (string | AttributeGroupReference | EntityAttribute | TypeAttribute) = object[i];
        result.push(createAttribute(ctx, ea, entityName));
    }

    return result;
}

/**
 * Create a copy of the reference object
 */
export function copyIdentifierRef(objRef: CdmObjectReference, resOpt: resolveOptions, options: copyOptions): string | identifierRef {
    const identifier: string = objRef.namedReference;
    if (!options || !options.stringRefs) {
        return identifier;
    }
    const resolved: CdmObjectDefinition = objRef.fetchObjectDefinition(resOpt);
    if (resolved === undefined) {
        return identifier;
    }

    return {
        corpusPath: resolved.atCorpusPath,
        identifier: identifier
    };
}

/**
 * Converts dynamic input into a string for a property (ints are converted to string)
 * @param value The value that should be converted to a string.
 */
export function propertyFromDataToString(value): string {
    if (typeof value === 'string' && value.trim() !== '') {
        return value;
    } else if (typeof value === 'number') {
        return value.toString();
    }

    return undefined;
}

/**
 * Converts dynamic input into an int for a property (numbers represented as strings are converted to int)
 * @param value The value that should be converted to an int.
 */
export function propertyFromDataToInt(value): number {
    if (typeof value === 'number') {
        return value;
    } else if (typeof value === 'string') {
        const numberValue: number = Number(value);
        if (!isNaN(numberValue)) {
            return numberValue;
        }
    }

    return undefined;
}

/**
 * Converts dynamic input into a boolean for a property (booleans represented as strings are converted to boolean)
 * @param value The value that should be converted to a boolean.
 */
export function propertyFromDataToBool(value): boolean {
    if (typeof value === 'boolean') {
        return value;
    } else if (typeof value === 'string') {
        if (value === 'true' || value === 'True') {
            return true;
        } else if (value === 'false' || value === 'False') {
            return false;
        }
    }

    return undefined;
}

/**
 * Converts cardinality data into a CardinalitySettings object
 * @param object The dasta representation of CardinalitySettings.
 * @param attribute The attribute object where the cardinality object belongs.
 * @returns The CardinalitySettings object.
 */
export function cardinalitySettingsFromData(object: CardinalitySettingsData, attribute: CdmAttribute): CardinalitySettings {
    if (!object) {
        return;
    }

    const cardinality: CardinalitySettings = new CardinalitySettings(attribute);
    cardinality.minimum = object.minimum;
    cardinality.maximum = object.maximum;

    return cardinality.minimum !== undefined && cardinality.maximum !== undefined ?
        cardinality : undefined;
}

/**
 * Converts CardinalitySettings into a CardinalitySettingsData object
 * @param instance The CardinalitySettings object.
 */
export function cardinalitySettingsToData(instance: CardinalitySettings): CardinalitySettingsData {
    if (!instance || instance.minimum === undefined || instance.maximum === undefined) {
        return undefined;
    }

    return {
        minimum: instance.minimum,
        maximum: instance.maximum
    };
}
