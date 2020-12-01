// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License. See License.txt in the project root for license information.

import { readFileSync } from 'fs';
import { CdmFolder, ModelJson } from '..';
import {
    CdmArgumentDefinition,
    CdmCorpusContext,
    cdmObjectType,
    CdmTraitCollection,
    CdmTraitReference,
    Logger
} from '../../internal';
import { CdmJsonType, TraitReference } from '../CdmFolder/types';
import { processExtensionTraitToObject, traitRefIsExtension } from './ExtensionHelper';
import { Annotation, AnnotationTraitMapping, CsvFormatSettings, MetadataObject } from './types';
import { NameValuePair } from '../../Utilities/NameValuePair';

const annotationToTraitMap: Map<string, string> = new Map([['version', 'is.CDM.entityVersion']]);

export const ignoredTraits: Set<string> = new Set<string>().add('is.modelConversion.otherAnnotations')
    .add('is.propertyContent.multiTrait')
    .add('is.modelConversion.referenceModelMap')
    .add('is.modelConversion.modelVersion')
    .add('means.measurement.version')
    .add('is.CDM.entityVersion')
    .add('is.partition.format.CSV')
    .add('is.partition.culture')
    .add('is.managedBy')
    .add('is.hidden');

// Traits to ignore if they come from properties.
// These traits become properties on the model.json. To avoid persisting both a trait
// and a property on the model.json, we filter these traits out.
export const modelJsonPropertyTraits: Set<string> = new Set<string>().add('is.localized.describedAs');

export function shouldAnnotationGoIntoASingleTrait(name: string): boolean {
    return annotationToTraitMap.has(name);
}

export function convertAnnotationToTrait(name: string): string {
    return annotationToTraitMap.get(name);
}

export function createCsvTrait(object: CsvFormatSettings, ctx: CdmCorpusContext): CdmTraitReference {
    const csvFormatTrait: CdmTraitReference = ctx.corpus.MakeObject(cdmObjectType.traitRef, 'is.partition.format.CSV');
    csvFormatTrait.simpleNamedReference = false;

    if (object.columnHeaders !== undefined) {
        const columnHeadersArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'columnHeaders');
        columnHeadersArg.value = object.columnHeaders ? 'true' : 'false';
        csvFormatTrait.arguments.push(columnHeadersArg);
    }

    if (object.csvStyle !== undefined) {
        const csvStyleArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'csvStyle');
        csvStyleArg.value = object.csvStyle;
        csvFormatTrait.arguments.push(csvStyleArg);
    }

    if (object.delimiter !== undefined) {
        const delimiterArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'delimiter');
        delimiterArg.value = object.delimiter;
        csvFormatTrait.arguments.push(delimiterArg);
    }

    if (object.quoteStyle !== undefined) {
        const quoteStyleArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'quoteStyle');
        quoteStyleArg.value = object.quoteStyle;
        csvFormatTrait.arguments.push(quoteStyleArg);
    }

    if (object.encoding !== undefined) {
        const encodingArg: CdmArgumentDefinition = ctx.corpus.MakeObject(cdmObjectType.argumentDef, 'encoding');
        encodingArg.value = object.encoding;
        csvFormatTrait.arguments.push(encodingArg);
    }

    return csvFormatTrait;
}

export function createCsvFormatSettings(csvFormatTrait: CdmTraitReference): CsvFormatSettings {
    const result: CsvFormatSettings = <CsvFormatSettings>{};

    for (const argument of csvFormatTrait.arguments.allItems) {
        if (argument.name === 'columnHeaders') {
            result.columnHeaders = argument.value === 'true';
        }

        if (argument.name === 'csvStyle') {
            result.csvStyle = argument.value as string;
        }

        if (argument.name === 'delimiter') {
            result.delimiter = argument.value as string;
        }

        if (argument.name === 'quoteStyle') {
            result.quoteStyle = argument.value as string;
        }

        if (argument.name === 'encoding') {
            result.encoding = argument.value as string;
        }
    }

    return result;
}

export async function processAnnotationsFromData(ctx: CdmCorpusContext, object: MetadataObject, traits: CdmTraitCollection)
    : Promise<void> {
    const multiTraitAnnotations: NameValuePair[] = [];

    if (object.annotations !== undefined) {
        for (const annotation of object.annotations) {
            if (!shouldAnnotationGoIntoASingleTrait(annotation.name)) {
                const cdmElement: NameValuePair = new NameValuePair();
                cdmElement.name = annotation.name;
                cdmElement.value = annotation.value;
                multiTraitAnnotations.push(cdmElement);
            } else {
                const innerTrait: CdmTraitReference =
                    ctx.corpus.MakeObject(cdmObjectType.traitRef, convertAnnotationToTrait(annotation.name));
                innerTrait.arguments.push(await ModelJson.ArgumentPersistence.fromData(ctx, annotation));
                traits.push(innerTrait);
            }
        }

        if (multiTraitAnnotations.length > 0) {
            const trait: CdmTraitReference =
                ctx.corpus.MakeObject(cdmObjectType.traitRef, 'is.modelConversion.otherAnnotations', false);
            trait.isFromProperty = false;

            const annotationsArguemnt: CdmArgumentDefinition = new CdmArgumentDefinition(ctx, 'annotations');
            annotationsArguemnt.value = multiTraitAnnotations;
            trait.arguments.push(annotationsArguemnt);
            traits.push(trait);
        }
    }

    if (object['cdm:traits'] !== undefined) {
        object['cdm:traits'].forEach((trait: string | TraitReference) => {
            traits.push(CdmFolder.TraitReferencePersistence.fromData(ctx, trait));
        });
    }
}

export function processTraitsAndAnnotationsToData(
    ctx: CdmCorpusContext,
    entityObject: MetadataObject,
    traits: CdmTraitCollection): Promise<void> {
    if (traits === undefined) {
        return;
    }

    const annotations: Annotation[] = [];

    const extensions: CdmJsonType[] = [];

    for (const trait of traits) {
        if (traitRefIsExtension(trait)) {
            processExtensionTraitToObject(trait, entityObject);

            continue;
        }

        if (trait.namedReference === 'is.modelConversion.otherAnnotations') {
            for (const annotation of (trait.arguments.allItems[0].value as any)) {
                if (annotation instanceof NameValuePair) {
                    const element: Annotation = new Annotation();
                    element.name = annotation.name;
                    element.value = annotation.value;
                    annotations.push(element);
                } 
                else if (typeof annotation === 'object') {
                    annotations.push(annotation);
                } else {
                    Logger.warning('Utils', ctx, 'Unsupported annotation type.');
                }
            }
        } else if (!ignoredTraits.has(trait.namedReference)
                    && !trait.namedReference.startsWith('is.dataFormat')
                    && !(modelJsonPropertyTraits.has(trait.namedReference) && trait.isFromProperty)) {
            const extension: CdmJsonType = CdmFolder.TraitReferencePersistence.toData(trait, undefined, undefined);
            extensions.push(extension);
        }

        if (annotations.length > 0) {
            entityObject.annotations = annotations;
        }

        if (extensions.length > 0) {
            entityObject['cdm:traits'] = extensions;
        }
    }
}

export function traitToAnnotationName(traitName: string): string {
    if (traitName === 'is.CDM.entityVersion') {
        return 'version';
    }

    return undefined;
}
