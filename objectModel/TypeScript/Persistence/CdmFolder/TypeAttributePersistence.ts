import {
    AttributeContextReferencePersistence,
    AttributeResolutionGuidancePersistence,
    DataTypeReferencePersistence,
    PurposeReferencePersistence
} from '.';
import {
    CdmCorpusContext,
    cdmDataFormat,
    cdmObjectType,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
    copyOptions,
    Logger,
    resolveOptions
} from '../../internal';
import {
    AttributeResolutionGuidance,
    DataTypeReference,
    PurposeReference,
    TraitReference,
    TypeAttribute
} from './types';
import * as utils from './utils';

export class TypeAttributePersistence {
    public static fromData(ctx: CdmCorpusContext, object: TypeAttribute): CdmTypeAttributeDefinition {
        const typeAttribute: CdmTypeAttributeDefinition = ctx.corpus.MakeObject(cdmObjectType.typeAttributeDef, object.name);

        if (object.explanation) {
            typeAttribute.explanation = object.explanation;
        }

        typeAttribute.purpose = PurposeReferencePersistence.fromData(ctx, object.purpose);
        typeAttribute.dataType = DataTypeReferencePersistence.fromData(ctx, object.dataType);
        typeAttribute.attributeContext =
            AttributeContextReferencePersistence.fromData(ctx, object.attributeContext);
        utils.addArrayToCdmCollection<CdmTraitReference>(typeAttribute.appliedTraits, utils.createTraitReferenceArray(ctx, object.appliedTraits));
        typeAttribute.resolutionGuidance =
            AttributeResolutionGuidancePersistence.fromData(ctx, object.resolutionGuidance);

        if (object.isReadOnly) {
            typeAttribute.isReadOnly = object.isReadOnly;
        }
        if (object.isNullable) {
            typeAttribute.isNullable = object.isNullable;
        }
        if (object.sourceName) {
            typeAttribute.sourceName = object.sourceName;
        }
        if (object.sourceOrdering) {
            typeAttribute.sourceOrdering = object.sourceOrdering;
        }
        if (object.displayName) {
            typeAttribute.displayName = object.displayName;
        }
        if (object.description) {
            typeAttribute.description = object.description;
        }
        if (object.valueConstrainedToList) {
            typeAttribute.valueConstrainedToList = object.valueConstrainedToList;
        }
        if (object.maximumLength) {
            typeAttribute.maximumLength = object.maximumLength;
        }
        if (object.maximumValue) {
            typeAttribute.maximumValue = object.maximumValue;
        }
        if (object.minimumValue) {
            typeAttribute.minimumValue = object.minimumValue;
        }
        if (object.dataFormat) {
            typeAttribute.dataFormat = this.dataTypeFromData(object.dataFormat);
            if (typeAttribute.dataFormat === undefined) {
                Logger.warning(
                    TypeAttributePersistence.name,
                    ctx,
                    `Couldn't find an enum value for ${object.dataFormat}.`,
                    'FromData'
                );
            }
        }
        if (object.defaultValue) {
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
            appliedTraits: utils.arrayCopyData<string | TraitReference>(resOpt, appliedTraits, options),
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
        object.sourceOrdering = !isNaN(sourceOrdering) ? sourceOrdering : undefined;

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

        const defaultValue: any = instance.getProperty('');
        if (defaultValue) {
            object.defaultValue = defaultValue;
        }

        return object;
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
                return undefined;
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
