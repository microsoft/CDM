// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { CdmFolder } from '..';
import {
    CdmCorpusContext,
    cdmDataFormat,
    cdmObjectType,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
    copyOptions,
    Logger,
    resolveOptions,
    traitToPropertyMap
} from '../../internal';
import * as copyDataUtils from '../../Utilities/CopyDataUtils';
import {
    AttributeResolutionGuidance,
    DataTypeReference,
    PurposeReference,
    TraitReference,
    TypeAttribute
} from './types';
import * as utils from './utils';

export class TypeAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: TypeAttribute, entityName?: string): CdmTypeAttributeDefinition {
        const typeAttribute: CdmTypeAttributeDefinition = ctx.corpus.MakeObject(cdmObjectType.typeAttributeDef, object.name);

        if (object.explanation) {
            typeAttribute.explanation = object.explanation;
        }

        typeAttribute.purpose = CdmFolder.PurposeReferencePersistence.fromData(ctx, object.purpose);
        typeAttribute.dataType = CdmFolder.DataTypeReferencePersistence.fromData(ctx, object.dataType);
        typeAttribute.attributeContext =
            CdmFolder.AttributeContextReferencePersistence.fromData(ctx, object.attributeContext);
        utils.addArrayToCdmCollection<CdmTraitReference>(
            typeAttribute.appliedTraits,
            utils.createTraitReferenceArray(ctx, object.appliedTraits)
        );
        typeAttribute.resolutionGuidance =
            CdmFolder.AttributeResolutionGuidancePersistence.fromData(ctx, object.resolutionGuidance);

        if (object.isPrimaryKey && entityName) {
            const t2pMap: traitToPropertyMap = new traitToPropertyMap(typeAttribute);
            t2pMap.updatePropertyValue('isPrimaryKey', entityName + '/(resolvedAttributes)/' + typeAttribute.name);
        }

        typeAttribute.isReadOnly = TypeAttributePersistence.propertyFromDataToBool(object.isReadOnly);
        typeAttribute.isNullable = TypeAttributePersistence.propertyFromDataToBool(object.isNullable);
        typeAttribute.sourceName = TypeAttributePersistence.propertyFromDataToString(object.sourceName);
        typeAttribute.sourceOrdering = TypeAttributePersistence.propertyFromDataToInt(object.sourceOrdering);
        typeAttribute.displayName = TypeAttributePersistence.propertyFromDataToString(object.displayName);
        typeAttribute.description = TypeAttributePersistence.propertyFromDataToString(object.description);
        typeAttribute.valueConstrainedToList = TypeAttributePersistence.propertyFromDataToBool(object.valueConstrainedToList);
        typeAttribute.maximumLength = TypeAttributePersistence.propertyFromDataToInt(object.maximumLength);
        typeAttribute.maximumValue = TypeAttributePersistence.propertyFromDataToString(object.maximumValue);
        typeAttribute.minimumValue = TypeAttributePersistence.propertyFromDataToString(object.minimumValue);

        if (object.dataFormat !== undefined) {
            typeAttribute.dataFormat = TypeAttributePersistence.dataTypeFromData(object.dataFormat);
            if (typeAttribute.dataFormat === undefined) {
                Logger.warning(
                    TypeAttributePersistence.name,
                    ctx,
                    `Couldn't find an enum value for ${object.dataFormat}.`,
                    this.fromData.name
                );
            }
        }
        if (object.defaultValue !== undefined) {
            typeAttribute.defaultValue = object.defaultValue;
        }

        return typeAttribute;
    }

    public static toData(instance: CdmTypeAttributeDefinition, resOpt: resolveOptions, options: copyOptions): TypeAttribute {
        const appliedTraits: CdmTraitReference[] = instance.appliedTraits ?
            instance.appliedTraits.allItems.filter((trait: CdmTraitReference) => !trait.isFromProperty) : undefined;
        const object: TypeAttribute = {
            explanation: instance.explanation,
            purpose: instance.purpose
                ? instance.purpose.copyData(resOpt, options) as (string | PurposeReference)
                : undefined,
            dataType: instance.dataType ? instance.dataType.copyData(resOpt, options) as (string | DataTypeReference) : undefined,
            name: instance.name,
            appliedTraits: copyDataUtils.arrayCopyData<string | TraitReference>(resOpt, appliedTraits, options),
            resolutionGuidance: instance.resolutionGuidance
                ? instance.resolutionGuidance.copyData(resOpt, options) as AttributeResolutionGuidance : undefined,
            attributeContext: instance.attributeContext ? instance.attributeContext.copyData(resOpt, options) as string : undefined
        };
        const isReadOnly: boolean = instance.getProperty('isReadOnly') as boolean;
        object.isReadOnly = isReadOnly ? isReadOnly : undefined;

        const isNullable: boolean = instance.getProperty('isNullable') as boolean;
        object.isNullable = isNullable ? isNullable : undefined;

        object.sourceName = instance.getProperty('sourceName') as string;

        const sourceOrdering: number = instance.getProperty('sourceOrdering') as number;
        object.sourceOrdering = !isNaN(sourceOrdering) && sourceOrdering !== 0 ? sourceOrdering : undefined;

        object.displayName = instance.getProperty('displayName') as string;
        object.description = instance.getProperty('description') as string;

        const valueConstrainedToList: boolean = instance.getProperty('valueConstrainedToList') as boolean;
        object.valueConstrainedToList = valueConstrainedToList ? valueConstrainedToList : undefined;

        const isPrimaryKey: boolean = instance.getProperty('isPrimaryKey') as boolean;
        object.isPrimaryKey = isPrimaryKey ? isPrimaryKey : undefined;

        object.maximumLength = instance.getProperty('maximumLength') as number;
        object.maximumValue = instance.getProperty('maximumValue') as string;
        object.minimumValue = instance.getProperty('minimumValue') as string;

        const dataFormat: cdmDataFormat = instance.getProperty('dataFormat') as cdmDataFormat;
        object.dataFormat = dataFormat !== cdmDataFormat.unknown ? this.dataTypeToData(dataFormat) : undefined;

        const defaultValue: any = instance.getProperty('defaultValue');
        if (defaultValue instanceof Array) {
            object.defaultValue = (defaultValue as Array<any>).length > 0 ? defaultValue : undefined;
        } else if (defaultValue) {
            object.defaultValue = defaultValue;
        }

        return object;
    }

    /**
     * Converts dynamic input into a string for a property (ints are converted to string)
     * @param value The value that should be converted to a string.
     */
    private static propertyFromDataToString(value): string {
        if (typeof value === 'string' && value !== '' && value.trim() !== '') {
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
    private static propertyFromDataToInt(value): number {
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
    private static propertyFromDataToBool(value): boolean {
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

    // case insensitive for input
    private static dataTypeFromData(dataType: string): cdmDataFormat {
        switch (dataType.toLowerCase()) {
            case 'string':
                return cdmDataFormat.string;
            case 'char':
                return cdmDataFormat.char;
            case 'int16':
                return cdmDataFormat.int16;
            case 'int32':
                return cdmDataFormat.int32;
            case 'int64':
                return cdmDataFormat.int64;
            case 'float':
                return cdmDataFormat.float;
            case 'double':
                return cdmDataFormat.double;
            case 'time':
                return cdmDataFormat.time;
            case 'date':
                return cdmDataFormat.date;
            case 'datetime':
                return cdmDataFormat.dateTime;
            case 'datetimeoffset':
                return cdmDataFormat.dateTimeOffset;
            case 'decimal':
                return cdmDataFormat.decimal;
            case 'boolean':
                return cdmDataFormat.boolean;
            case 'byte':
                return cdmDataFormat.byte;
            case 'binary':
                return cdmDataFormat.binary;
            case 'guid':
                return cdmDataFormat.guid;
            case 'json':
                return cdmDataFormat.json;
            default:
                return cdmDataFormat.unknown;
        }
    }

    // outputs pascal case
    private static dataTypeToData(dataType: cdmDataFormat): string {
        switch (dataType) {
            case cdmDataFormat.int16:
                return 'Int16';
            case cdmDataFormat.int32:
                return 'Int32';
            case cdmDataFormat.int64:
                return 'Int64';
            case cdmDataFormat.float:
                return 'Float';
            case cdmDataFormat.double:
                return 'Double';
            case cdmDataFormat.char:
                return 'Char';
            case cdmDataFormat.string:
                return 'String';
            case cdmDataFormat.guid:
                return 'Guid';
            case cdmDataFormat.time:
            case cdmDataFormat.date:
            case cdmDataFormat.dateTime:
                return 'DateTime';
            case cdmDataFormat.dateTimeOffset:
                return 'DateTimeOffset';
            case cdmDataFormat.boolean:
                return 'Boolean';
            case cdmDataFormat.decimal:
                return 'Decimal';
            case cdmDataFormat.byte:
                return 'Byte';
            case cdmDataFormat.binary:
                return 'Binary';
            case cdmDataFormat.json:
                return 'Json';
            case cdmDataFormat.unknown:
            default:
                return undefined;
        }
    }
}
