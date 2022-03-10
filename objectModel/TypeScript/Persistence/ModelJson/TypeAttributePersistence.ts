// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { ModelJson } from '..';
import {
    CdmCorpusContext,
    cdmDataFormat,
    cdmObjectType,
    CdmTraitDefinition,
    CdmTraitReference,
    CdmTypeAttributeDefinition,
    copyOptions,
    resolveOptions,
    traitToPropertyMap
} from '../../internal';
import { processExtensionFromJson } from './ExtensionHelper';
import { Attribute, attributeBaseProperties, DataType } from './types';

export class TypeAttributePersistence {
    public static async fromData(
        ctx: CdmCorpusContext,
        object: Attribute,
        extensionTraitDefList: CdmTraitDefinition[],
        localExtensionTraitDefList: CdmTraitDefinition[]
    ): Promise<CdmTypeAttributeDefinition> {
        const attribute: CdmTypeAttributeDefinition = ctx.corpus.MakeObject(cdmObjectType.typeAttributeDef, `${object.name} attribute`);

        attribute.name = object.name;
        // Do a conversion between CDM data format and model.json data type.
        attribute.dataFormat = this.dataTypeFromData(object.dataType);

        if (object.description && object.description.trim() !== '') {
            attribute.description = object.description;
        }

        if (object.isHidden === true) {
            const isHiddenTrait: CdmTraitReference = ctx.corpus.MakeObject(cdmObjectType.traitRef, 'is.hidden');
            isHiddenTrait.isFromProperty = true;

            attribute.appliedTraits.push(isHiddenTrait);
        }

        await ModelJson.utils.processAnnotationsFromData(ctx, object, attribute.appliedTraits);
        processExtensionFromJson(
            ctx,
            object,
            attributeBaseProperties,
            attribute.appliedTraits,
            extensionTraitDefList,
            localExtensionTraitDefList
        );

        return attribute;
    }

    public static async toData(instance: CdmTypeAttributeDefinition, resOpt: resolveOptions, options: copyOptions): Promise<Attribute> {
        const attribute: Attribute = {
            name: instance.name,
            description: instance.getProperty('description') as string,
            dataType: this.dataTypeToData(instance.dataFormat) as DataType,
            annotations: undefined,
            'cdm:traits': undefined
        };

        await ModelJson.utils.processTraitsAndAnnotationsToData(instance.ctx, attribute, instance.appliedTraits);

        const t2pm: traitToPropertyMap = new traitToPropertyMap(instance);
        const isHiddenTrait: CdmTraitReference = t2pm.fetchTraitReference('is.hidden');

        if (isHiddenTrait !== undefined) {
            attribute.isHidden = true;
        }

        return attribute;
    }

    // case insensitive for input
    private static dataTypeFromData(dataType: string): cdmDataFormat {
        switch (dataType.toLowerCase()) {
            case 'string':
                return cdmDataFormat.string;
            case 'int64':
                return cdmDataFormat.int64;
            case 'double':
                return cdmDataFormat.double;
            case 'date':
                return cdmDataFormat.date;
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
            case 'guid':
                return cdmDataFormat.guid;
            case 'json':
                return cdmDataFormat.json;
            default:
                return undefined;
        }
    }

    // outputs to camelcase
    private static dataTypeToData(dataType: cdmDataFormat): string {
        switch (dataType) {
            case cdmDataFormat.int16:
            case cdmDataFormat.int32:
            case cdmDataFormat.int64:
                return 'int64';
            case cdmDataFormat.float:
            case cdmDataFormat.double:
                return 'double';
            case cdmDataFormat.char:
            case cdmDataFormat.string:
                return 'string';
            case cdmDataFormat.guid:
                return 'guid';
            case cdmDataFormat.binary:
                return 'boolean';
            case cdmDataFormat.time:
                return 'time';
            case cdmDataFormat.date:
                return 'date';
            case cdmDataFormat.dateTime:
                return 'dateTime';
            case cdmDataFormat.dateTimeOffset:
                return 'dateTimeOffset';
            case cdmDataFormat.boolean:
                return 'boolean';
            case cdmDataFormat.decimal:
                return 'decimal';
            case cdmDataFormat.json:
                return 'json';
            default:
                return 'unclassified';
        }
    }
}
